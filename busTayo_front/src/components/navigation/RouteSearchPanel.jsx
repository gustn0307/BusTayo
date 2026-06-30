import { Card, Button } from "react-bootstrap";
import api from "../../api";
import PlaceSearchInput from "./PlaceSearchInput";
import SearchResultList from "./SearchResultList";
import RouteDetail from "./RouteDetail";
import { useEffect, useState } from "react";

function RouteSearchPanel({
  currentLocation,
  startPlace,
  setStartPlace,
  endPlace,
  setEndPlace,
  routes,
  setRoutes,
  selectedRoute,
  setSelectedRoute,
  selectedStation,
  setSelectedStation,
  history,
  setHistory,
  busMarkers,
  setBusMarkers
}) {
  const [loading, setLoading] = useState(false);

  const setCurrentLocationAsStart = () => {
    if (!currentLocation?.lat || !currentLocation?.lng) {
      alert("현재 위치를 아직 가져오지 못했습니다.");
      return;
    }

    const currentPlace = {
      name: "내 위치",
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    };

    setStartPlace(currentPlace);

    setSelectedStation({
      ...currentPlace,
      zoomLevel: 3,
    });

    setSelectedRoute(null);
    setBusMarkers([]);
  };

  const searchRoute = async () => {
    if (!startPlace || !endPlace) {
      alert("출발지와 도착지는 검색 결과에서 선택해야 합니다.\n서울·경기 지역만 검색할 수 있습니다.");
      return;
    }

    try {
      setLoading(true);

      setSelectedRoute(null);
      setSelectedStation(null);
      setBusMarkers([]);

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

      setRoutes(response.data.result.path);
    } catch (error) {
      console.error(error);
      alert("경로를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryRoute = async (history) => {
    try {
      setSelectedRoute(null);
      setSelectedStation(null);
      setBusMarkers([]);

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

      setRoutes(response.data.result.path);

      setStartPlace({
        name: history.start,
        lat: history.startY,
        lng: history.startX,
      });

      setEndPlace({
        name: history.end,
        lat: history.endY,
        lng: history.endX,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    api
      .get("/api/navigating/history")
      .then((res) => {
        setHistory(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="h-100 border-start bg-white p-3" style={{ overflowY: "auto" }}>
      <h3 className="mb-4">길찾기</h3>

      <Button
        variant="outline-primary"
        size="sm"
        className="w-100 mb-2"
        onClick={setCurrentLocationAsStart}
      >
        ⊙ 내 위치를 출발지로 설정
      </Button>

      <PlaceSearchInput
        placeholder="출발지 입력"
        value={startPlace}
        onSelect={setStartPlace}
      />


      <div className="mb-3"></div>

      <PlaceSearchInput
        placeholder="도착지 입력"
        value={endPlace}
        onSelect={setEndPlace}
      />

      <Button variant="primary" className="w-100 mt-3" onClick={searchRoute} disabled={loading}>
        {loading ? "경로 탐색 중..." : "검색"}
      </Button>

      {loading && (
        <div className="small text-muted text-center mt-2">
          버스 경로를 탐색하고 있습니다.
        </div>
      )}

      <hr />

      {startPlace && (
        <Card className="mb-2">
          <Card.Body>출발지: {startPlace.name}</Card.Body>
        </Card>
      )}

      {endPlace && (
        <Card className="mb-2">
          <Card.Body>도착지: {endPlace.name}</Card.Body>
        </Card>
      )}

      {!selectedRoute ? (
        <SearchResultList
          routes={routes}
          setSelectedRoute={setSelectedRoute}
          setSelectedStation={setSelectedStation}
        />
      ) : (
        <>
          <RouteDetail
            route={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            setSelectedStation={setSelectedStation}
            busMarkers={busMarkers}
            setBusMarkers={setBusMarkers}
          />
        </>
      )}

      {/* 이후 구현해야 할 부분 */}
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
