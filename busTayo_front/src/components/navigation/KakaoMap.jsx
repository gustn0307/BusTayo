import { useEffect, useRef } from "react";
import { loadKakaoMap } from "../../util/loadKakaoMap";

function KakaoMap({
  currentLocation,
  setCurrentLocation,
  selectedStation,
  selectedRoute,
  busMarkers,
}) {
  const mapRef = useRef(null);

  const mapContainerRef = useRef(null);

  const mapInstanceRef = useRef(null);

  const stationMarkerRef = useRef(null);

  const routePolylinesRef = useRef([]);

  const stopMarkersRef = useRef([]);

  const stopOverlaysRef = useRef([]);

  const busMarkersRef = useRef([]);

  const busOverlaysRef = useRef([]);

  const infoOverlayRef = useRef(null);

  const mapLevelListenerRef = useRef(null);

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

          kakao.maps.event.addListener(map, "click", () => {
            if (infoOverlayRef.current) {
              infoOverlayRef.current.setMap(null);
              infoOverlayRef.current = null;
            }
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

  // 정류장 선택시 해당 정류장으로 중심 이동
  useEffect(() => {
    if (!selectedStation || !mapInstanceRef.current) {
      return;
    }

    const kakao = window.kakao;

    const position = new kakao.maps.LatLng(
      selectedStation.lat,
      selectedStation.lng,
    );

    mapInstanceRef.current.setCenter(position);

    mapInstanceRef.current.setLevel(3, { animate: true });

    if (stationMarkerRef.current) {
      stationMarkerRef.current.setMap(null);
    }

    stationMarkerRef.current = new kakao.maps.Marker({
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
      routePolylinesRef.current.forEach((line) => {
        line.setMap(null);
      });

      routePolylinesRef.current = [];

      stopMarkersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      stopMarkersRef.current = [];

      stopOverlaysRef.current.forEach((overlay) => {
        overlay.setMap(null);
      });

      stopOverlaysRef.current = [];

      busMarkersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      busMarkersRef.current = [];

      busOverlaysRef.current.forEach((overlay) => {
        overlay.setMap(null);
      });

      busOverlaysRef.current = [];

      return;
    }

    const kakao = window.kakao;

    routePolylinesRef.current.forEach((line) => {
      line.setMap(null);
    });

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

        path.passStopList?.stations?.forEach((station) => {
          busLinePath.push(
            new kakao.maps.LatLng(Number(station.y), Number(station.x)),
          );
        });

        const busLine = new kakao.maps.Polyline({
          path: busLinePath,

          strokeWeight: 6,

          strokeColor: "#007bff",

          strokeOpacity: 0.8,

          strokeStyle: "solid",
        });

        busLine.setMap(mapInstanceRef.current);

        routePolylinesRef.current.push(busLine);
      }

      if (path.trafficType === 3) {
        const walkStart = selectedRoute.subPath[index - 1];

        const walkEnd = selectedRoute.subPath[index + 1];

        if (
          walkStart?.endX &&
          walkStart?.endY &&
          walkEnd?.startX &&
          walkEnd?.startY
        ) {
          const walkLine = new kakao.maps.Polyline({
            path: [
              new kakao.maps.LatLng(walkStart.endY, walkStart.endX),

              new kakao.maps.LatLng(walkEnd.startY, walkEnd.startX),
            ],

            strokeWeight: 5,

            strokeColor: "#9b59b6",

            strokeOpacity: 0.9,

            strokeStyle: "dash",
          });

          walkLine.setMap(mapInstanceRef.current);

          routePolylinesRef.current.push(walkLine);
        }
      }

      if (path.trafficType !== 2) {
        return;
      }

      path.passStopList?.stations?.forEach((station, stationIndex) => {
        const position = new kakao.maps.LatLng(
          Number(station.y),
          Number(station.x),
        );

        linePath.push(position);

        let color = "#0d6efd";
        let size = 12;

        // 승차 정류장 색상, 크기 지정
        if (stationIndex === 0) {
          color = "#28a745";
          size = 18;
        }

        // 하차 정류장 색상, 크기 지정
        if (stationIndex === path.passStopList.stations.length - 1) {
          color = "#dc3545";
          size = 18;
        }

        const marker = new kakao.maps.CustomOverlay({
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

        const label = new kakao.maps.CustomOverlay({
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
      });
    });

    const bounds = new kakao.maps.LatLngBounds();

    linePath.forEach((point) => {
      bounds.extend(point);
    });

    mapInstanceRef.current.setBounds(bounds);

    const level = mapInstanceRef.current.getLevel();

    stopOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(level <= 5 ? mapInstanceRef.current : null);
    });

    if (!mapLevelListenerRef.current) {
      mapLevelListenerRef.current = () => {
        const level = mapInstanceRef.current.getLevel();

        stopOverlaysRef.current.forEach((overlay) => {
          overlay.setMap(level <= 5 ? mapInstanceRef.current : null);
        });

        busOverlaysRef.current.forEach((overlay) => {
          overlay.setMap(level <= 5 ? mapInstanceRef.current : null);
        });
      };

      kakao.maps.event.addListener(
        mapInstanceRef.current,
        "zoom_changed",
        mapLevelListenerRef.current,
      );
    }
  }, [selectedRoute]);

  // 버스 위치 정보 API 받아와서 지도에 버스 위치 띄워주기
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!busMarkers || busMarkers.length === 0) {
      busMarkersRef.current.forEach((marker) => marker.setMap(null));
      busMarkersRef.current = [];

      busOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
      busOverlaysRef.current = [];

      return;
    }

    busMarkersRef.current.forEach((marker) => marker.setMap(null));
    busMarkersRef.current = [];

    busOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    busOverlaysRef.current = [];

    const kakao = window.kakao;

    const imageSrc = "/bus-marker.png";

    const imageSize = new kakao.maps.Size(32, 32);

    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    busMarkers.forEach((bus) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(Number(bus.lat), Number(bus.lng)),

        map: mapInstanceRef.current,

        image: markerImage,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        if (infoOverlayRef.current) {
          infoOverlayRef.current.setMap(null);
        }

        const info = new kakao.maps.CustomOverlay({
          position: marker.getPosition(),

          yAnchor: 2.6,

          content: `
            <div style="
            background:white;
            border-radius:8px;
            padding:10px;
            border:1px solid #ddd;
            box-shadow:0 3px 10px rgba(0,0,0,.2);
            min-width:170px;
            ">
              <div style="
              font-weight:bold;
              margin-bottom:8px;
              font-size:13px;
              ">
              🚌 ${bus.plateNo}
              </div>
              <div style="margin-bottom:4px;">
              혼잡도 :
              ${
                bus.isSeoul
                  ? Number(bus.congetion) === 1
                    ? "🟢 여유"
                    : Number(bus.congetion) === 2
                      ? "🟡 보통"
                      : Number(bus.congetion) === 3
                        ? "🟠 혼잡"
                        : "🔴 매우혼잡"
                  : Number(bus.crowded) === 1
                    ? "🟢 여유"
                    : Number(bus.crowded) === 2
                      ? "🟡 보통"
                      : Number(bus.crowded) === 3
                        ? "🟠 혼잡"
                        : "정보없음"
              }
              </div>
              <div>
              상태 :
              ${
                bus.isSeoul
                  ? Number(bus.stopFlag) === 1
                    ? "정류장 정차"
                    : "운행중"
                  : Number(bus.stateCd) === 1
                    ? "정류장 도착"
                    : Number(bus.stateCd) === 2
                      ? "정류장 출발"
                      : "운행중"
              }
              </div>
            </div>`,
        });

        info.setMap(mapInstanceRef.current);

        infoOverlayRef.current = info;
      });

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(Number(bus.lat), Number(bus.lng)),

        yAnchor: 2.4,

        content: `
          <div style="
            background:white;
            border:1px solid #ccc;
            border-radius:4px;
            padding:2px 5px;
            font-size:11px;
            white-space:nowrap;
            font-weight:bold;
          ">
          ${bus.plateNo}
          </div>
        `,
      });

      busMarkersRef.current.push(marker);
      busOverlaysRef.current.push(overlay);
    });

    const showOverlay = mapInstanceRef.current.getLevel() <= 5;

    busOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(showOverlay ? mapInstanceRef.current : null);
    });
  }, [busMarkers]);

  return <div ref={mapContainerRef} className="w-100 h-100" />;
}

export default KakaoMap;
