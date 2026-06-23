import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function BusArrivalPanel({ selectedStation }) {
  const [arrivals, setArrivals] = useState([]);

  const [busLocations, setBusLocations] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState(null);

  if (!selectedStation) {
    return null;
  }

  const getCrowdedBadge = (crowded) => {
    switch (Number(crowded)) {
      case 1:
        return "🟢 여유";

      case 2:
        return "🟡 보통";

      case 3:
        return "🟠 혼잡";

      case 4:
        return "🔴 매우 혼잡";

      default:
        return "정보없음";
    }
  };

  const loadArrival = () => {
    if (!selectedStation?.localStationID) return;

    axios
      .get("http://localhost:8080/api/bus/arrival", {
        params: {
          stationId: selectedStation.localStationID,
          cityCode: selectedStation.stationCityCode,
        },
      })
      .then((res) => {
        const list = res.data.response?.msgBody?.busArrivalList || [];

        const filtered = list.filter(
          (bus) => bus.predictTime1 !== "" && bus.predictTime1 != null,
        );

        setArrivals(filtered);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!selectedStation?.localStationID) {
      return;
    }

    setBusLocations([]);
    setSelectedRoute(null);

    loadArrival();
  }, [selectedStation]);

  useEffect(() => {
    if (!selectedStation?.localStationID) return;

    // 15초에 한 번씩 새로고침
    const interval = setInterval(() => {
      loadArrival();
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedStation]);

  const loadBusLocation = (routeId = selectedRoute?.routeId) => {
    if (!routeId) return;

    axios
      .get("http://localhost:8080/api/bus/location", {
        params: {
          routeId,
        },
      })
      .then((res) => {
        const list = res.data.response?.msgBody?.busLocationList || [];

        setBusLocations(list);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!selectedRoute) return;

    const interval = setInterval(() => {
      loadBusLocation();
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <h6>🚏 {selectedStation.stationName}</h6>

          <hr />

          {arrivals.length === 0 ? (
            <div className="text-muted">도착 정보 없음</div>
          ) : (
            arrivals.map((bus, index) => (
              <div key={index} className="border rounded p-2 mb-2">
                <div
                  className="fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedRoute(bus);
                    loadBusLocation(bus.routeId);
                  }}
                >
                  {bus.routeName}번
                </div>

                <div>
                  {bus.predictTime1
                    ? `${bus.predictTime1}분 후 도착`
                    : "운행 정보 없음"}
                </div>

                {bus.locationNo1 && <div>{bus.locationNo1}정류장 전</div>}

                {bus.remainSeatCnt1 > 0 && (
                  <div>🪑 빈자리 {bus.remainSeatCnt1}석</div>
                )}
              </div>
            ))
          )}
        </Card.Body>
      </Card>
      <hr />

      {selectedRoute && (
        <>
          <h6>실시간 차량</h6>

          {busLocations
            .filter(
              (bus) =>
                selectedRoute && selectedRoute.staOrder - bus.stationSeq >= 0,
            )
            .map((bus) => (
              <div key={bus.vehId} className="border rounded p-2 mb-2">
                <div>🚍 {bus.plateNo}</div>

                <div>
                  {selectedStation.stationName}까지{" "}
                  {Math.max(0, selectedRoute.staOrder - bus.stationSeq)}
                  정거장
                </div>

                {bus.remainSeatCnt > 0 ? (
                  <div>🪑 빈자리 {bus.remainSeatCnt}석</div>
                ) : (
                  <div>{getCrowdedBadge(bus.crowded)}</div>
                )}

                <div>
                  {bus.stateCd === 0 && "교차로 통과"}
                  {bus.stateCd === 1 && "정류장 도착"}
                  {bus.stateCd === 2 && "정류장 출발"}
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
}

export default BusArrivalPanel;
