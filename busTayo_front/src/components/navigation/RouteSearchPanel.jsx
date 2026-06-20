import { Card, Button } from "react-bootstrap";
import axios from "axios";
import PlaceSearchInput from "./PlaceSearchInput";
import SearchResultList from "./SearchResultList";
import RouteDetail from "./RouteDetail";

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
}) {
  const searchRoute = async () => {
    if (!startPlace || !endPlace) {
      alert("출발지와 도착지를 선택하세요.");
      return;
    }

    try {
      const response = await axios.get(
        "https://api.odsay.com/v1/api/searchPubTransPathT",
        {
          params: {
            SX: startPlace.lng,
            SY: startPlace.lat,
            EX: endPlace.lng,
            EY: endPlace.lat,
            apiKey: import.meta.env.VITE_ODSAY_API_KEY,
            SearchPathType: 2,
          },
        },
      );

      const paths = response.data.result.path;

      setRoutes(response.data.result.path);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-100 border-start bg-white p-3">
      <h3 className="mb-4">길찾기</h3>

      <PlaceSearchInput placeholder="출발지 입력" onSelect={setStartPlace} />

      <div className="mb-3"></div>

      <PlaceSearchInput placeholder="도착지 입력" onSelect={setEndPlace} />

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
        <RouteDetail
          route={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          setSelectedStation={setSelectedStation}
        />
      )}

      {/* 이후 구현해야 할 부분 */}
      <h5 className="mt-4 mb-3">최근 길찾기</h5>

      <Card className="mb-2">
        <Card.Body>강남역 → 잠실역</Card.Body>
      </Card>

      <Card className="mb-2">
        <Card.Body>서울역 → 코엑스</Card.Body>
      </Card>
    </div>
  );
}

export default RouteSearchPanel;
