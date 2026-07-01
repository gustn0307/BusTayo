import { useEffect, useRef } from "react";
import { loadKakaoMap } from "../../util/loadKakaoMap";

function KakaoMap({ currentLocation, setCurrentLocation, selectedStation, selectedRoute }) {
  const mapRef = useRef(null);

  const mapContainerRef = useRef(null);

  const mapInstanceRef = useRef(null);

  const stationMarkerRef = useRef(null);

  const routePolylinesRef = useRef([]);

  const stopMarkersRef = useRef([]);

  const stopOverlaysRef = useRef([]);

  const mapLevelListenerRef = useRef(null)

  // 현재 위치 좌표로 카카오맵 지도 불러오기
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCurrentLocation({
          lat,
          lng,
        });

        loadKakaoMap().then((kakao) => {
          const map = new kakao.maps.Map(mapContainerRef.current, {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3,
          });

          mapInstanceRef.current = map;

          new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(lat, lng),
          });
        });
      },

      (error) => {
        console.error(error);

        // 위치 권한 거부 시 서울시청으로 대체
        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 4,
          });
        });
      },
      {
        enableHighAccuracy: true, // GPS 우선 사용
        timeout: 10000, // 10초까지 위치 수집
        maximumAge: 0, // 캐시 사용 금지
      },
    );
  }, []);

  useEffect(() => {

    if (
      !selectedStation ||
      !mapInstanceRef.current
    ) {
      return;
    }

    const kakao = window.kakao;

    const position = new kakao.maps.LatLng(
      selectedStation.lat,
      selectedStation.lng
    );

    mapInstanceRef.current.setCenter(position);

    mapInstanceRef.current.setLevel(
      3,
      { animate: true }
    );


    if (stationMarkerRef.current) {
      stationMarkerRef.current.setMap(null);
    }

    stationMarkerRef.current =
      new kakao.maps.Marker({
        map: mapInstanceRef.current,
        position,
      });
  }, [selectedStation]);

  // 경로 선택 시 경로 그리기(Polyline)
  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    if (!selectedRoute) {

      routePolylinesRef.current.forEach(
        (line) => {
          line.setMap(null);
        }
      );

      routePolylinesRef.current = [];

      stopMarkersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      stopMarkersRef.current = [];

      stopOverlaysRef.current.forEach((overlay) => {
        overlay.setMap(null);
      });

      stopOverlaysRef.current = [];

      return;
    }

    const kakao = window.kakao;

    routePolylinesRef.current.forEach(
      (line) => {
        line.setMap(null);
      }
    );

    routePolylinesRef.current = [];

    const linePath = [];

    stopMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    stopMarkersRef.current = [];

    stopOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });

    stopOverlaysRef.current = [];

    selectedRoute.subPath.forEach((path, index) => {
      if (path.trafficType === 2) {

        const busLinePath = [];

        path.passStopList?.stations?.forEach(
          (station) => {
            busLinePath.push(
              new kakao.maps.LatLng(
                Number(station.y),
                Number(station.x)
              )
            );
          }
        );

        const busLine =
          new kakao.maps.Polyline({
            path: busLinePath,

            strokeWeight: 6,

            strokeColor: "#007bff",

            strokeOpacity: 0.8,

            strokeStyle: "solid",
          });

        busLine.setMap(
          mapInstanceRef.current
        );

        routePolylinesRef.current.push(
          busLine
        );
      }

      if (path.trafficType === 3) {

        const walkStart =
          selectedRoute.subPath[index - 1];

        const walkEnd =
          selectedRoute.subPath[index + 1];

        if (
          walkStart?.endX &&
          walkStart?.endY &&
          walkEnd?.startX &&
          walkEnd?.startY
        ) {

          const walkLine =
            new kakao.maps.Polyline({
              path: [
                new kakao.maps.LatLng(
                  walkStart.endY,
                  walkStart.endX
                ),

                new kakao.maps.LatLng(
                  walkEnd.startY,
                  walkEnd.startX
                ),
              ],

              strokeWeight: 5,

              strokeColor: "#9b59b6",

              strokeOpacity: 0.9,

              strokeStyle: "dash",
            });

          walkLine.setMap(
            mapInstanceRef.current
          );

          routePolylinesRef.current.push(
            walkLine
          );
        }
      }


      if (path.trafficType !== 2) {
        return;
      }

      path.passStopList?.stations?.forEach(
        (station, stationIndex) => {

          const position =
            new kakao.maps.LatLng(
              Number(station.y),
              Number(station.x)
            );

          linePath.push(position);

          let color = "#0d6efd"
          let size = 12;

          // 승차 정류장 색상, 크기 지정
          if (stationIndex === 0) {
            color = "#28a745";
            size = 18;
          }

          // 하차 정류장 색상, 크기 지정
          if (
            stationIndex ===
            path.passStopList.stations.length - 1
          ) {
            color = "#dc3545";
            size = 18;
          }

          const marker =
            new kakao.maps.CustomOverlay({
              position,

              content: `
                <div
                  style="
                    width:${size}px;
                    height:${size}px;
                    border-radius:50%;
                    background:${color};
                    border:3px solid white;
                    box-shadow:0 1px 4px rgba(0,0,0,0.35);
                  "
                ></div>
                `,
            });

          marker.setMap(mapInstanceRef.current);

          const label =
            new kakao.maps.CustomOverlay({
              position,

              yAnchor: 1.3,

              content: `
                <div
                  style="
                    background:white;
                    border:1px solid #ddd;
                    border-radius:4px;
                    padding:2px 6px;
                    font-size:11px;
                    white-space:nowrap;
                  "
                >
                  ${station.stationName}
                </div>
              `,
            });

          stopOverlaysRef.current.push(label);

          stopMarkersRef.current.push(marker);

        }
      );
    });

    const bounds =
      new kakao.maps.LatLngBounds();

    linePath.forEach((point) => {
      bounds.extend(point);
    });

    mapInstanceRef.current.setBounds(bounds);

    const level =
      mapInstanceRef.current.getLevel();

    stopOverlaysRef.current.forEach(
      (overlay) => {
        overlay.setMap(
          level <= 5
            ? mapInstanceRef.current
            : null
        );
      }
    );

    if (!mapLevelListenerRef.current) {
      mapLevelListenerRef.current = () => {
        const level =
          mapInstanceRef.current.getLevel();

        stopOverlaysRef.current.forEach(
          (overlay) => {
            overlay.setMap(
              level <= 5
                ? mapInstanceRef.current
                : null
            );
          }
        );
      };

      kakao.maps.event.addListener(
        mapInstanceRef.current,
        "zoom_changed",
        mapLevelListenerRef.current
      );
    }

  }, [selectedRoute]);

  return <div ref={mapContainerRef} className="w-100 h-100" />;
}

export default KakaoMap;
