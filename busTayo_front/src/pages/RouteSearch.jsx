import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

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

  const [busMarkers, setBusMarkers] = useState([]);

  const [history, setHistory] = useState([]);

  useEffect(() => {
  }, [selectedStation]);

  return (
    <Row className="g-0" style={{ height: "100vh", overflow: "hidden" }}>
      <Col style={{ height: "100vh" }}>
        <KakaoMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          selectedStation={selectedStation}
          selectedRoute={selectedRoute}
          busMarkers={busMarkers}
        />
      </Col>

      <Col xs={4} xxl={3} style={{ height: "100vh", overflow: "hidden" }}>
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
          busMarkers={busMarkers}
          setBusMarkers={setBusMarkers}
        />
      </Col>
    </Row>
  );
}

export default RouteSearch;
