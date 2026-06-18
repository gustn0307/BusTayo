import { useState } from "react";
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

  return (
    <Row className="g-0 h-100">
      <Col>
        <KakaoMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
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
        />
      </Col>
    </Row>
  );
}

export default RouteSearch;
