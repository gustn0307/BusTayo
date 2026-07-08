import { useState, useEffect } from "react";
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

  // 패널 열고 닫기를 위한 state
  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(true);

  const location = useLocation();

  const favorite = location.state?.favorite;

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
    <div className="route-page">
      {/* 지도 영역 */}
      <div className="route-map-area">
        <KakaoMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          selectedStation={selectedStation}
          selectedRoute={selectedRoute}
          busMarkers={busMarkers}
        />
      </div>

      {/* 길찾기 패널 영역 */}
      <div className="route-panel-area">
        <RouteSearchPanel
          isRoutePanelOpen={isRoutePanelOpen}
          setIsRoutePanelOpen={setIsRoutePanelOpen}
          currentLocation={currentLocation}
          startPlace={startPlace}
          setStartPlace={setStartPlace}
          endPlace={endPlace}
          setEndPlace={setEndPlace}
          routes={routes}
          setRoutes={setRoutes}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          history={history}
          setHistory={setHistory}
          busMarkers={busMarkers}
          setBusMarkers={setBusMarkers}
        />
      </div>
    </div>
  );
}

export default RouteSearch;
