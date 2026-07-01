import { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { loadKakaoMap } from "../../util/loadKakaoMap";

// 카카오맵 컴포넌트
// 역할:
// 1. 지도 초기 렌더링
// 2. 현재 위치 표시
// 3. 선택된 경로 Polyline 표시
// 4. 정류장 마커 표시
// 5. 실시간 버스 위치 표시
function KakaoMap({
  currentLocation,
  setCurrentLocation,
  selectedStation,
  selectedRoute,
  busMarkers,
}) {
  // (예전 방식) map DOM ref
  // 현재는 mapContainerRef 사용 중이라 제거 가능
  const mapRef = useRef(null);

  // 실제 카카오맵이 그려질 div DOM
  const mapContainerRef = useRef(null);

  // 카카오 Map 인스턴스 저장
  // re-render 되어도 map 객체 유지
  const mapInstanceRef = useRef(null);

  // 사용자가 클릭한 정류장 마커
  const stationMarkerRef = useRef(null);

  // 현재 위치 마커
  const currentLocationMarkerRef = useRef(null);

  // 경로선(polyline) 배열
  const routePolylinesRef = useRef([]);

  // 정류장 원형 마커들
  const stopMarkersRef = useRef([]);

  // 정류장 이름 Overlay들
  const stopOverlaysRef = useRef([]);

  // 실시간 버스 Marker들
  const busMarkersRef = useRef([]);

  // 버스 차량번호 Overlay들
  const busOverlaysRef = useRef([]);

  // 차량번호 기준 Marker/Overlay 저장용
  // (현재는 미사용. 추후 marker 재사용 최적화 가능)
  const busObjectMapRef = useRef({});

  // 버스 클릭 시 뜨는 상세 정보 Overlay
  const infoOverlayRef = useRef(null);

  // zoom_changed 이벤트 리스너 중복 등록 방지용
  const mapLevelListenerRef = useRef(null);

  // 카카오맵 초기 로딩
  // 컴포넌트가 처음 렌더링될 때 한 번만 실행된다.
  //
  // 동작 순서:
  // 1. 브라우저 Geolocation 지원 여부 확인
  // 2. 현재 위치 좌표 조회
  // 3. currentLocation 상태를 부모(RouteSearch)에 저장
  // 4. 카카오맵 SDK 로드
  // 5. 현재 위치 중심으로 지도 생성
  // 6. 현재 위치 마커 표시
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // 부모 컴포넌트(RouteSearch)의 currentLocation 상태 갱신
        // 이 값은 "내 위치를 출발지로 설정" 버튼과
        // 지도 우측 상단 "현재 내 위치로 이동" 버튼에서 사용된다.
        setCurrentLocation({
          lat,
          lng,
        });

        // 카카오맵 SDK를 안전하게 로드한 뒤 지도 생성
        loadKakaoMap().then((kakao) => {
          const map = new kakao.maps.Map(mapContainerRef.current, {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3,
          });

          // 지도 빈 영역 클릭 시 버스 상세 정보 오버레이 닫기
          kakao.maps.event.addListener(map, "click", () => {
            if (infoOverlayRef.current) {
              infoOverlayRef.current.setMap(null);
              infoOverlayRef.current = null;
            }
          });

          // 생성된 지도 인스턴스를 ref에 저장
          // 이후 다른 useEffect에서 이 map 객체를 계속 사용한다.
          mapInstanceRef.current = map;

          // 초기 진입 시 현재 위치 마커 표시
          // 경로 선택 시 이 마커는 제거된다.
          currentLocationMarkerRef.current = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(lat, lng),
          });
        });
      },

      (error) => {
        console.error(error);

        // 위치 권한 거부 또는 위치 조회 실패 시 서울시청 좌표로 지도 생성
        // fallback 좌표: 서울시청
        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 4,
          });

          // fallback map도 이후 로직에서 사용할 수 있도록 저장하는 것이 안전하다.
          // 현재 코드에는 없지만, 필요하면 아래 줄을 추가할 수 있다.
          // mapInstanceRef.current = map;
        });
      },
      {
        enableHighAccuracy: true, // GPS 우선 사용
        timeout: 10000, // 10초까지 현재 위치 수집 시도
        maximumAge: 0, // 캐시 위치 사용 금지
      },
    );
  }, []);

  // 지도 우측 상단 "현재 내 위치로 이동" 버튼 클릭 시 실행
  //
  // 동작:
  // 1. currentLocation 값이 있는지 확인
  // 2. 지도 중심을 현재 위치로 이동
  // 3. 확대 레벨을 3으로 조정
  // 4. 현재 위치 마커를 다시 표시
  //
  // 주의:
  // 이 함수는 selectedRoute, polyline, 정류장 마커를 건드리지 않는다.
  // 따라서 경로가 그려진 상태에서 눌러도 경로는 그대로 유지된다.
  const moveToCurrentLocation = () => {
    if (!currentLocation?.lat || !currentLocation?.lng) {
      alert("현재 위치를 아직 가져오지 못했습니다.");
      return;
    }

    if (!mapInstanceRef.current) {
      return;
    }

    const kakao = window.kakao;

    const position = new kakao.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng,
    );

    // 지도 중심 이동 및 확대 레벨 조정
    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setLevel(3, { animate: true });

    // 기존 현재 위치 마커가 있다면 제거 후 새로 생성
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    currentLocationMarkerRef.current = new kakao.maps.Marker({
      map: mapInstanceRef.current,
      position,
    });
  };

  // RouteDetail / BusStopList 에서 정류장을 클릭하면 실행
  //
  // selectedStation 구조:
  // {
  //   lat,
  //   lng,
  //   name,
  //   zoomLevel
  // }
  //
  // 동작:
  // 1. 선택한 정류장 좌표로 지도 중심 이동
  // 2. 확대 레벨 조정
  // 3. 정류장 마커 표시
  useEffect(() => {
    if (!selectedStation || !mapInstanceRef.current) {
      return;
    }

    const kakao = window.kakao;

    const position = new kakao.maps.LatLng(
      selectedStation.lat,
      selectedStation.lng,
    );

    // 지도 중심 이동
    mapInstanceRef.current.setCenter(position);

    // 확대 레벨 설정
    // 현재는 고정값 3 사용 중
    mapInstanceRef.current.setLevel(3, { animate: true });

    // 기존 정류장 마커 제거
    if (stationMarkerRef.current) {
      stationMarkerRef.current.setMap(null);
    }

    // 새 정류장 마커 생성
    stationMarkerRef.current = new kakao.maps.Marker({
      map: mapInstanceRef.current,
      position,
    });
  }, [selectedStation]);

  // 사용자가 경로 목록에서 특정 경로를 선택하면 실행
  //
  // 역할:
  // 1. 기존 지도 요소 제거
  // 2. 선택된 경로를 지도에 Polyline으로 그림
  // 3. 정류장 마커 표시
  // 4. 지도 bounds 자동 조정
  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    // 경로 선택 후에는 현재 위치 마커 제거
    // (지도가 복잡해지는 것 방지)
    if (selectedRoute && currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
      currentLocationMarkerRef.current = null;
    }

    // 경로 해제 시 지도 초기화(경로 목록으로 돌아가기 버튼 클릭, 새 검색 시작)
    if (!selectedRoute) {
      // Polyline 제거
      routePolylinesRef.current.forEach((line) => {
        line.setMap(null);
      });

      routePolylinesRef.current = [];

      // 정류장 마커 제거
      stopMarkersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      stopMarkersRef.current = [];

      // 정류장 Overlay 제거
      stopOverlaysRef.current.forEach((overlay) => {
        overlay.setMap(null);
      });

      stopOverlaysRef.current = [];

      // 버스 마커 제거
      busMarkersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      busMarkersRef.current = [];

      // 버스 오버레이 제거
      busOverlaysRef.current.forEach((overlay) => {
        overlay.setMap(null);
      });

      busOverlaysRef.current = [];

      return;
    }

    // 새 경로 그리기 준비

    // 카카오 객체 가져오기
    const kakao = window.kakao;

    // 기존 polyline 제거 후 초기화
    routePolylinesRef.current.forEach((line) => {
      line.setMap(null);
    });

    routePolylinesRef.current = [];

    // bounds 계산용 배열(전체 경로가 화면 안에 보이도록 줌)
    const linePath = [];

    // 정류장 관련 초기화
    stopMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    stopMarkersRef.current = [];
    stopOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    stopOverlaysRef.current = [];

    // 선택된 경로의 세부 구간들을 순회한다.
    //
    // ODsay subPath 구조:
    // - trafficType === 2 : 버스 구간
    // - trafficType === 3 : 도보 구간
    //
    // 각 구간에 따라 지도에 다른 방식으로 표시한다.
    selectedRoute.subPath.forEach((path, index) => {
      // 버스 구간이면 정류장 좌표들을 연결해서 파란색 Polyline 표시
      if (path.trafficType === 2) {
        // 해당 버스 구간의 정류장 좌표들을 담는 배열
        const busLinePath = [];

        // passStopList.stations는 사용자가 실제로 타는 구간의 정류장 목록
        // 각 정류장의 x/y 좌표를 kakao LatLng 객체로 변환한다.
        path.passStopList?.stations?.forEach((station) => {
          busLinePath.push(
            new kakao.maps.LatLng(Number(station.y), Number(station.x)),
          );
        });

        // 버스 경로선 생성
        // 현재는 실제 도로 선형이 아니라 정류장 좌표를 직선으로 연결한다.
        const busLine = new kakao.maps.Polyline({
          path: busLinePath,

          // 선 두께
          strokeWeight: 6,

          // 버스 구간 색상
          strokeColor: "#007bff",

          // 선 투명도
          strokeOpacity: 0.8,

          // 실선
          strokeStyle: "solid",
        });

        // 지도에 버스 경로선 표시
        busLine.setMap(mapInstanceRef.current);

        // 나중에 경로 변경/초기화 시 제거하기 위해 ref 배열에 저장
        routePolylinesRef.current.push(busLine);
      }

      // 도보 구간이면 보라색 점선으로 표시
      if (path.trafficType === 3) {
        // 도보 구간 자체에는 좌표 목록이 부족한 경우가 있어
        // 이전 구간의 종료 좌표와 다음 구간의 시작 좌표를 연결한다.
        const walkStart = selectedRoute.subPath[index - 1];

        const walkEnd = selectedRoute.subPath[index + 1];

        // 이전 구간의 end 좌표와 다음 구간의 start 좌표가 모두 있을 때만 표시
        if (
          walkStart?.endX &&
          walkStart?.endY &&
          walkEnd?.startX &&
          walkEnd?.startY
        ) {
          const walkLine = new kakao.maps.Polyline({
            path: [
              // 도보 시작점
              new kakao.maps.LatLng(walkStart.endY, walkStart.endX),

              // 도보 종료점
              new kakao.maps.LatLng(walkEnd.startY, walkEnd.startX),
            ],

            // 선 두께
            strokeWeight: 5,

            // 도보 구간 색상
            strokeColor: "#9b59b6",

            // 선 투명도
            strokeOpacity: 0.9,

            // 점선
            strokeStyle: "dash",
          });

          // 지도에 도보 경로선 표시
          walkLine.setMap(mapInstanceRef.current);

          // 나중에 제거하기 위해 저장
          routePolylinesRef.current.push(walkLine);
        }
      }

      // 아래 정류장 마커 생성 로직은 버스 구간에서만 실행한다.
      // 도보 구간이면 여기서 종료한다.
      if (path.trafficType !== 2) {
        return;
      }

      // 버스 구간의 모든 정류장을 지도 위에 원형 마커로 표시한다.
      path.passStopList?.stations?.forEach((station, stationIndex) => {
        const position = new kakao.maps.LatLng(
          Number(station.y),
          Number(station.x),
        );

        // 전체 경로 bounds 계산용 배열에 좌표 추가
        // 나중에 setBounds로 전체 경로가 화면에 들어오게 한다.
        linePath.push(position);

        // 기본 정류장 마커 색상/크기
        let color = "#0d6efd";
        let size = 12;

        // 승차 정류장은 초록색 큰 원으로 표시
        if (stationIndex === 0) {
          color = "#28a745";
          size = 18;
        }

        // 하차 정류장은 빨간색 큰 원으로 표시
        if (stationIndex === path.passStopList.stations.length - 1) {
          color = "#dc3545";
          size = 18;
        }

        // 정류장 원형 마커는 Marker가 아니라 CustomOverlay로 생성
        // 디자인을 직접 제어하기 위해 HTML div를 사용한다.
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

        // 지도에 정류장 원형 마커 표시
        marker.setMap(mapInstanceRef.current);

        // 정류장 이름 라벨 Overlay 생성
        // 줌 레벨이 충분히 가까울 때만 표시된다.
        const label = new kakao.maps.CustomOverlay({
          position,

          // yAnchor를 조정해서 원형 마커 위쪽에 라벨 배치
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

        // 라벨과 마커를 ref에 저장
        // 이후 selectedRoute 변경 또는 목록으로 돌아가기 시 제거한다.
        stopOverlaysRef.current.push(label);

        stopMarkersRef.current.push(marker);
      });
    });

    // 전체 경로가 지도 화면 안에 들어오도록 bounds를 계산한다.
    // bounds는 여러 좌표를 포함하는 사각 영역이다.
    const bounds = new kakao.maps.LatLngBounds();

    // linePath에는 버스 구간 정류장 좌표들이 들어 있다.
    // 각 좌표를 bounds에 추가해서 전체 경로 영역을 만든다.
    linePath.forEach((point) => {
      bounds.extend(point);
    });

    // 계산된 bounds 기준으로 지도 중심과 확대 레벨을 자동 조정한다.
    // 사용자가 경로를 선택하면 전체 경로가 한 화면에 보이게 된다.
    mapInstanceRef.current.setBounds(bounds);

    // 현재 지도 확대 레벨 확인
    // KakaoMap은 숫자가 작을수록 더 확대된 상태다.
    const level = mapInstanceRef.current.getLevel();

    // 정류장 이름 라벨은 확대 레벨이 5 이하일 때만 표시한다.
    // 너무 멀리 줌아웃된 상태에서는 라벨이 많아져서 지도가 복잡해지기 때문이다.
    stopOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(level <= 5 ? mapInstanceRef.current : null);
    });

    // zoom_changed 이벤트 리스너는 한 번만 등록한다.
    // useEffect가 여러 번 실행될 수 있기 때문에 중복 등록을 방지한다.
    if (!mapLevelListenerRef.current) {
      mapLevelListenerRef.current = () => {
        const level = mapInstanceRef.current.getLevel();

        // 줌 레벨에 따라 정류장 이름 라벨 표시/숨김
        stopOverlaysRef.current.forEach((overlay) => {
          overlay.setMap(level <= 5 ? mapInstanceRef.current : null);
        });

        // 줌 레벨에 따라 버스 차량번호 Overlay 표시/숨김
        // 버스 아이콘은 항상 보이지만 번호판은 가까이 확대했을 때만 보여준다.
        busOverlaysRef.current.forEach((overlay) => {
          overlay.setMap(level <= 5 ? mapInstanceRef.current : null);
        });
      };

      // 카카오맵 zoom_changed 이벤트 등록
      // 사용자가 지도를 확대/축소할 때마다 위 함수가 실행된다.
      kakao.maps.event.addListener(
        mapInstanceRef.current,
        "zoom_changed",
        mapLevelListenerRef.current,
      );
    }
  }, [selectedRoute]);

  // 실시간 버스 마커 표시
  //
  // busMarkers는 RouteBusCard에서 차량 위치 API 응답을 가공해서 만든 배열이다.
  // 형태 예시:
  // {
  //   lat,
  //   lng,
  //   plateNo,
  //   isSeoul,
  //   congetion,
  //   stopFlag,
  //   crowded,
  //   stateCd
  // }
  //
  // 동작:
  // 1. 기존 버스 마커/번호판 Overlay 제거
  // 2. 새 busMarkers 기준으로 버스 아이콘 마커 생성
  // 3. 마커 클릭 시 차량 상세 정보 Overlay 표시
  // 4. 지도 확대 레벨에 따라 차량번호 Overlay 표시/숨김
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // busMarkers가 없거나 빈 배열이면 기존 버스 마커를 모두 제거한다.
    // 새 검색, 경로 목록으로 돌아가기, 버스 위치 없음 상태에서 실행된다.
    if (!busMarkers || busMarkers.length === 0) {
      busMarkersRef.current.forEach((marker) => marker.setMap(null));
      busMarkersRef.current = [];

      busOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
      busOverlaysRef.current = [];

      return;
    }

    // 새 버스 위치를 그리기 전에 기존 버스 마커 제거
    busMarkersRef.current.forEach((marker) => marker.setMap(null));
    busMarkersRef.current = [];

    // 기존 차량번호 Overlay 제거
    busOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    busOverlaysRef.current = [];

    const kakao = window.kakao;

    // public 폴더에 있는 버스 아이콘 이미지 사용
    // Vite 기준 public/bus-marker.png → "/bus-marker.png"로 접근
    const imageSrc = "/bus-marker.png";

    // 버스 아이콘 크기
    const imageSize = new kakao.maps.Size(32, 32);

    // 카카오맵 MarkerImage 객체 생성
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // busMarkers 배열의 각 차량을 지도 마커로 변환
    busMarkers.forEach((bus) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(Number(bus.lat), Number(bus.lng)),
        map: mapInstanceRef.current,
        image: markerImage,
      });

      // 버스 아이콘 클릭 시 차량 상세 정보 Overlay 표시
      kakao.maps.event.addListener(marker, "click", () => {
        // 기존에 열려 있던 차량 정보 Overlay가 있으면 먼저 닫는다.
        if (infoOverlayRef.current) {
          infoOverlayRef.current.setMap(null);
        }

        // 차량 상세 정보 Overlay 생성
        const info = new kakao.maps.CustomOverlay({
          position: marker.getPosition(),
          yAnchor: 2.6,

          // 서울/경기 응답 필드가 다르기 때문에 bus.isSeoul로 분기한다.
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

        // 상세 Overlay를 지도에 표시
        info.setMap(mapInstanceRef.current);

        // 다음 클릭 시 기존 Overlay를 닫기 위해 ref에 저장
        infoOverlayRef.current = info;
      });

      // 버스 차량번호 Overlay 생성
      // 아이콘 위쪽에 차량번호를 표시한다.
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

      // 다음 갱신/초기화 때 제거할 수 있도록 ref 배열에 저장
      busMarkersRef.current.push(marker);
      busOverlaysRef.current.push(overlay);
    });

    // 현재 줌 레벨 기준으로 차량번호 Overlay 표시 여부 결정
    // 확대된 상태(level <= 5)에서만 차량번호를 보여준다.
    const showOverlay = mapInstanceRef.current.getLevel() <= 5;

    busOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(showOverlay ? mapInstanceRef.current : null);
    });
  }, [busMarkers]);

  return (
    // 카카오맵 전체 영역
    // position-relative를 주는 이유:
    // 지도 위에 "현재 내 위치로 이동" 버튼을 absolute로 올리기 위해서
    <div className="position-relative w-100 h-100">
      {/* 실제 카카오맵이 렌더링되는 div */}
      {/* mapContainerRef를 카카오맵 생성 시 container로 사용한다. */}
      <div ref={mapContainerRef} className="w-100 h-100" />

      {/* 지도 우측 상단 현재 위치 이동 버튼 */}
      {/* 클릭 시 moveToCurrentLocation 함수 실행 */}
      {/* 경로/정류장/버스 마커는 유지하고 지도 중심만 현재 위치로 이동한다. */}
      <Button
        variant="light"
        size="sm"
        className="position-absolute shadow-sm"
        style={{
          top: "16px",
          right: "16px",
          zIndex: 10,
        }}
        onClick={moveToCurrentLocation}
      >
        📍 현재 내 위치로 이동
      </Button>
    </div>
  );
}

export default KakaoMap;
