import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import KakaoMap from "../components/navigation/KakaoMap";
import RouteSearchPanel from "../components/navigation/RouteSearchPanel";

function RouteSearch() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });

  const [startPlace, setStartPlace] = useState(null);
  const [endPlace, setEndPlace] = useState(null);

  const [routes, setRoutes] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [selectedStation, setSelectedStation] = useState(null);

  const [history, setHistory] = useState([]);

  const location = useLocation();
  const favorite = location.state;
  

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

  return (
    <Row className="g-0 h-100">
      <Col>
        <KakaoMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          selectedStation={selectedStation}
          selectedRoute={selectedRoute}
        />
      </Col>

      <Col xs={4} xxl={3}>
        <RouteSearchPanel
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
        />
      </Col>
    </Row>
  );
  
}

export default RouteSearch;
