import { Card, Button } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";
import api from "../../api";
import PlaceSearchInput from "./PlaceSearchInput";
import SearchResultList from "./SearchResultList";
import RouteDetail from "./RouteDetail";
import { useEffect, useState } from "react";

function RouteSearchPanel({
  // 현재 브라우저 위치 좌표
  // RouteSearch → KakaoMap에서 geolocation으로 받은 값을 내려준다.
  // "내 위치를 출발지로 설정" 버튼에서 사용한다.
  currentLocation,

  // 현재 선택된 출발지
  // 형태: { name, lat, lng }
  startPlace,

  // 출발지 상태 변경 함수
  // 장소 검색 결과 선택, 내 위치 버튼 클릭, 최근 길찾기 클릭 시 사용한다.
  setStartPlace,

  // 현재 선택된 도착지
  // 형태: { name, lat, lng }
  endPlace,

  // 도착지 상태 변경 함수
  // 장소 검색 결과 선택, 최근 길찾기 클릭 시 사용한다.
  setEndPlace,

  // ODsay 경로 검색 결과 목록
  // SearchResultList에서 카드 목록으로 보여준다.
  routes,

  // 경로 목록 상태 변경 함수
  // 새 경로 검색 또는 최근 길찾기 재검색 후 결과를 저장한다.
  setRoutes,

  // 사용자가 선택한 상세 경로
  // null이면 경로 목록을 보여주고, 값이 있으면 RouteDetail을 보여준다.
  selectedRoute,

  // 상세 경로 선택/해제 함수
  // 새 검색 시 null로 초기화해서 경로 목록 화면으로 돌아가게 한다.
  setSelectedRoute,

  // 지도 중심 이동 대상
  // 정류장, 출발지, 도착지, 내 위치 등을 클릭했을 때 KakaoMap이 이 값을 기준으로 이동한다.
  selectedStation,

  // 지도 중심 이동 대상 설정 함수
  setSelectedStation,

  // 최근 길찾기 목록
  history,

  // 최근 길찾기 목록 저장 함수
  // /api/navigating/history 응답을 저장한다.
  setHistory,

  // 지도에 표시할 실시간 버스 마커 목록
  busMarkers,

  // 실시간 버스 마커 상태 변경 함수
  // 새 검색 시 초기화하고, RouteBusCard에서 차량 위치를 받아 갱신한다.
  setBusMarkers,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const saveFavorite = async () => {
    if (!startPlace || !endPlace) {
      alert("출발지와 도착지를 먼저 입력하세요.");
      return;
    }
    try {
      await api.post("/api/favorites/navigating", {
        name: `${startPlace.name} → ${endPlace.name}`,
        start: startPlace.name,
        startX: startPlace.lng,
        startY: startPlace.lat,
        end: endPlace.name,
        endX: endPlace.lng,
        endY: endPlace.lat,
      });
      setIsFavorite(true);
      alert("즐겨찾기에 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("즐겨찾기 저장에 실패했습니다.");
    }
  };

  // 경로 검색 진행 여부
  // true이면 검색 버튼을 비활성화하고 "경로 탐색 중..." 문구를 표시한다.
  const [loading, setLoading] = useState(false);

  // 현재 위치를 출발지로 설정하는 함수
  const setCurrentLocationAsStart = () => {
    if (!currentLocation?.lat || !currentLocation?.lng) {
      alert("현재 위치를 아직 가져오지 못했습니다.");
      return;
    }

    // 출발지로 저장할 현재 위치 객체
    const currentPlace = {
      name: "내 위치",
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    };

    // 출발지 입력값을 "내 위치"로 설정
    setStartPlace(currentPlace);

    // 지도도 현재 위치로 이동하도록 selectedStation 갱신
    setSelectedStation({
      ...currentPlace,
      zoomLevel: 3,
    });

    // 기존 상세 경로와 버스 마커 초기화
    setSelectedRoute(null);
    setBusMarkers([]);
  };

  // 출발지/도착지를 기준으로 버스 경로 검색
  const searchRoute = async () => {
    if (!startPlace || !endPlace) {
      alert(
        "출발지와 도착지는 검색 결과에서 선택해야 합니다.\n서울·경기 지역만 검색할 수 있습니다.",
      );
      return;
    }

    try {
      // 검색 중 상태 시작
      setLoading(true);

      // 새 검색이므로 기존 상세 경로, 선택 정류장, 버스 마커 초기화
      setSelectedRoute(null);
      setSelectedStation(null);
      setBusMarkers([]);

      // 백엔드 경로 검색 API 호출
      const response = await api.get("/api/path/search", {
        params: {
          sx: startPlace.lng,
          sy: startPlace.lat,
          ex: endPlace.lng,
          ey: endPlace.lat,
          startName: startPlace.name,
          endName: endPlace.name,
        },
      });

      // 검색 결과 경로 목록 저장
      setRoutes(response.data.result.path);
    } catch (error) {
      console.error(error);
      alert("경로를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      // 성공/실패와 관계없이 로딩 상태 종료
      setLoading(false);
    }
  };

  // 최근 길찾기 항목 클릭 시 해당 기록으로 다시 경로 검색
  const loadHistoryRoute = async (history) => {
    try {
      // 기존 상세 경로, 선택 정류장, 버스 마커 초기화
      setSelectedRoute(null);
      setSelectedStation(null);
      setBusMarkers([]);

      // 최근 기록의 좌표를 사용해서 경로 재검색
      const response = await api.get("/api/path/search", {
        params: {
          sx: history.startX,
          sy: history.startY,
          ex: history.endX,
          ey: history.endY,
          startName: history.start,
          endName: history.end,
        },
      });

      // 재검색 결과 저장
      setRoutes(response.data.result.path);

      // 출발지 입력창에 최근 기록의 출발지 반영
      setStartPlace({
        name: history.start,
        lat: history.startY,
        lng: history.startX,
      });

      // 도착지 입력창에 최근 기록의 도착지 반영
      setEndPlace({
        name: history.end,
        lat: history.endY,
        lng: history.endX,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 최초 렌더링 시 최근 길찾기 목록 조회
  useEffect(() => {
    api
      .get("/api/navigating/history")
      .then((res) => {
        setHistory(res.data);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    setIsFavorite(false);
    if (startPlace && endPlace) {
      searchRoute();
    }
  }, [startPlace, endPlace]);

  
  return (
    // 오른쪽 길찾기 패널
    // 페이지 전체가 아니라 패널 내부만 스크롤되도록 overflowY를 지정한다.
    <div className="h-100 border-start bg-white p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">길찾기</h3>
        <button
          onClick={saveFavorite}
          className="btn btn-link p-0 text-warning"
          title="즐겨찾기 저장"
          style={{ fontSize: "1.5rem" }}
        >
          {isFavorite ? <BsStarFill /> : <BsStar />}
        </button>
      </div>
    
    

      {/* 현재 위치를 출발지로 설정 */}
      <Button
        variant="outline-primary"
        size="sm"
        className="w-100 mb-2"
        onClick={setCurrentLocationAsStart}
      >
        ⊙ 내 위치를 출발지로 설정
      </Button>

      {/* 출발지 검색 입력창 */}
      <PlaceSearchInput
        placeholder="출발지 입력"
        value={startPlace}
        onSelect={setStartPlace}
      />

      <div className="mb-3"></div>

      {/* 도착지 검색 입력창 */}
      <PlaceSearchInput
        placeholder="도착지 입력"
        value={endPlace}
        onSelect={setEndPlace}
      />

      {/* 경로 검색 버튼 */}
      <Button
        variant="primary"
        className="w-100 mt-3"
        onClick={searchRoute}
        disabled={loading}
      >
        {loading ? "경로 탐색 중..." : "검색"}
      </Button>

      {/* 경로 검색 로딩 안내 */}
      {loading && (
        <div className="small text-muted text-center mt-2">
          버스 경로를 탐색하고 있습니다.
        </div>
      )}

      <hr />

      {/* 현재 선택된 출발지 표시 */}
      {startPlace && (
        <Card className="mb-2">
          <Card.Body>출발지: {startPlace.name}</Card.Body>
        </Card>
      )}

      {/* 현재 선택된 도착지 표시 */}
      {endPlace && (
        <Card className="mb-2">
          <Card.Body>도착지: {endPlace.name}</Card.Body>
        </Card>
      )}

      {/* 경로 목록 또는 상세 경로 조건부 렌더링 */}
      {!selectedRoute ? (
        <SearchResultList
          routes={routes}
          setSelectedRoute={setSelectedRoute}
          setSelectedStation={setSelectedStation}
        />
      ) : (
        <RouteDetail
          route={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          setSelectedStation={setSelectedStation}
          busMarkers={busMarkers}
          setBusMarkers={setBusMarkers}
        />
      )}

      {/* 최근 길찾기 목록 */}
      <h5 className="mt-4 mb-3">최근 길찾기</h5>

      {history.map((item) => (
        <Card
          key={item.id}
          className="mb-2"
          style={{ cursor: "pointer" }}
          onClick={() => loadHistoryRoute(item)}
        >
          <Card.Body>
            {item.start} → {item.end}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default RouteSearchPanel;