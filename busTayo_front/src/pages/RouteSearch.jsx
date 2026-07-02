import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import KakaoMap from "../components/navigation/KakaoMap";
import RouteSearchPanel from "../components/navigation/RouteSearchPanel";

// 길찾기 페이지의 최상위 컴포넌트
// 지도 영역(KakaoMap)과 오른쪽 검색 패널(RouteSearchPanel)을 함께 관리한다.
//
// RouteSearch
//  ├─ KakaoMap
//  └─ RouteSearchPanel
//       ├─ SearchResultList
//       └─ RouteDetail
//            ├─ RouteBusCard
//            │    ├─ BusInfoCard
//            │    └─ BusStopList
//            └─ RouteWalkCard

function RouteSearch() {
  // 현재 브라우저 위치 좌표
  // KakaoMap에서 geolocation으로 받아온 값을 저장한다.
  // "내 위치를 출발지로 설정" 기능과 지도 우측 상단 내 위치 이동 버튼에서 사용된다.
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });

  // 사용자가 선택한 출발지 정보
  // 형태: { name, lat, lng }
  // 장소 검색 결과 선택 또는 "내 위치를 출발지로 설정" 버튼 클릭 시 변경된다.
  const [startPlace, setStartPlace] = useState(null);

  // 사용자가 선택한 도착지 정보
  // 형태: { name, lat, lng }
  // 장소 검색 결과 선택 시 변경된다.
  const [endPlace, setEndPlace] = useState(null);

  // ODsay 경로 검색 API 응답으로 받은 경로 목록
  // SearchResultList에서 목록 카드로 렌더링된다.
  const [routes, setRoutes] = useState([]);

  // 사용자가 경로 목록에서 선택한 상세 경로
  // null이면 경로 목록(SearchResultList)을 보여주고,
  // 값이 있으면 상세 경로(RouteDetail)를 보여준다.
  const [selectedRoute, setSelectedRoute] = useState(null);

  // 지도 중심을 이동시킬 선택 정류장 또는 위치 정보
  // 정류장 클릭, 출발지/도착지 클릭, 내 위치 설정 시 변경된다.
  // KakaoMap은 이 값이 바뀌면 해당 좌표로 지도 중심을 이동한다.
  const [selectedStation, setSelectedStation] = useState(null);

  // 지도에 표시할 실시간 버스 마커 목록
  // RouteBusCard에서 차량 위치 API 응답을 가공해 저장하고,
  // KakaoMap에서 실제 버스 아이콘 마커로 표시한다.
  const [busMarkers, setBusMarkers] = useState([]);

  // 최근 길찾기 목록
  // RouteSearchPanel에서 /api/navigating/history 응답을 받아 저장한다.
  const [history, setHistory] = useState([]);

  const location = useLocation();

  const favorite = location.state?.favorite;
  const reset = location.state?.reset;

  useEffect(() => {}, [selectedStation]);
  useEffect(() => {
    if (!favorite) return;

    setStartPlace({
      name: favorite.start,
      lat: favorite.startY,
      lng: favorite.startX,
    });

    setEndPlace({
      name: favorite.end,
      lat: favorite.endY,
      lng: favorite.endX,
    });
  }, [favorite]);
  useEffect(() => {
  if (!location.state?.reset) return;

  setStartPlace(null);
  setEndPlace(null);
  setRoutes([]);
  setSelectedRoute(null);
  setSelectedStation(null);
  setBusMarkers([]);
}, [location.state?.reset]);

  return (
    
    // 전체 길찾기 화면 높이를 브라우저 높이로 고정한다.
    // overflow hidden을 주어 페이지 전체가 스크롤되지 않고,
    // 오른쪽 패널만 내부 스크롤되도록 만든다.
    <Row className="g-0" style={{ height: "100vh", overflow: "hidden" }}>
      {/* 왼쪽/중앙 카카오맵 영역 */}
      <Col style={{ height: "100vh" }}>
        <KakaoMap
          // 현재 위치 좌표와 setter를 전달한다.
          // KakaoMap에서 geolocation 성공 시 setCurrentLocation으로 값을 갱신한다.
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          // 선택된 정류장/위치로 지도 중심 이동
          selectedStation={selectedStation}
          // 선택된 상세 경로를 지도에 polyline과 정류장 마커로 표시
          selectedRoute={selectedRoute}
          // 실시간 버스 위치 마커 표시
          busMarkers={busMarkers}
        />
      </Col>

      {/* 오른쪽 길찾기 검색 패널 영역 */}
      <Col xs={4} xxl={3} style={{ height: "100vh", overflow: "hidden" }}>
        <RouteSearchPanel
          // 현재 위치를 출발지로 설정할 때 사용
          currentLocation={currentLocation}
          // 출발지 상태와 setter
          startPlace={startPlace}
          setStartPlace={setStartPlace}
          // 도착지 상태와 setter
          endPlace={endPlace}
          setEndPlace={setEndPlace}
          // 경로 목록 상태와 setter
          routes={routes}
          setRoutes={setRoutes}
          // 선택된 상세 경로 상태와 setter
          // 검색 목록 ↔ 상세 경로 화면 전환에 사용된다.
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          // 지도 중심 이동 대상 상태와 setter
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          // 최근 길찾기 목록 상태와 setter
          history={history}
          setHistory={setHistory}
          // 지도에 표시할 버스 마커 상태와 setter
          busMarkers={busMarkers}
          setBusMarkers={setBusMarkers}
        />
      </Col>
    </Row>
  );
}

export default RouteSearch;
