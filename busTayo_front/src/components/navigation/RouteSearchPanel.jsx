import { Card, Button } from "react-bootstrap";
import api from "../../api";
import PlaceSearchInput from "./PlaceSearchInput";
import SearchResultList from "./SearchResultList";
import RouteDetail from "./RouteDetail";
import { useEffect } from "react";

// RouteSearchPanel
//         │
//         ▼
// SearchResultList
//         │
//         ▼
// RouteDetail
//         │
//         ▼
// RouteBusCard
//         │
//  ┌──────┼──────────┐
//  ▼      ▼          ▼
// BusInfo BusStop  BusLocation

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
  const searchRoute = async () => {
    if (!startPlace || !endPlace) {
      alert("출발지와 도착지를 선택하세요.");
      return;
    }

    try {
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
      console.log(response.data.result);

      setRoutes(response.data.result.path);
    } catch (error) {
      console.error(error);
    }
  };

  const loadHistoryRoute = async (history) => {
    try {
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

      setSelectedRoute(null);

      setSelectedStation(null);

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
    <div className="h-100 border-start bg-white p-3">
      <h3 className="mb-4">길찾기</h3>

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

      <Button variant="primary" className="w-100 mt-3" onClick={searchRoute}>
        검색
      </Button>

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
