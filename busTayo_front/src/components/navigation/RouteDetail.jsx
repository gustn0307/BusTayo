import { Card, Badge, Button } from "react-bootstrap";
import { useState } from "react";

function RouteDetail({ route, setSelectedRoute, setSelectedStation }) {
  if (!route) return null;

  const [openStops, setOpenStops] = useState({});

  return (
    <Card className="mt-3">
      <Button
        variant="light"
        className="mb-3"
        onClick={() => setSelectedRoute(null)}
      >
        ← 경로 목록
      </Button>
      <Card.Body>
        <h4>{route.info.totalTime}분</h4>

        <hr />

        {route.subPath.map((path, index) => {
          if (path.trafficType === 3) {
            return <div key={index}>🚶 도보 {path.distance}m</div>;
          }

          if (path.trafficType === 2) {
            console.log("첫번째 정류장", path.passStopList.stations[0]);
            console.log(path.passStopList.stations);
            return (
              <div key={index}>
                <Badge bg="primary">{path.lane[0].busNo}번</Badge>

                <div className="mt-2">승차 : {path.startName}</div>

                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() =>
                    setOpenStops((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                >
                  {path.stationCount}개 정류장 이동{" "}
                  {openStops[index] ? "▲" : "▼"}
                </Button>

                {openStops[index] && (
                  <div className="mt-2 ms-3 border-start ps-3">
                    {path.passStopList?.stations?.map(
                      (station, stationIndex) => (
                        <div
                          key={stationIndex}
                          className="mb-1 small"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setSelectedStation({
                              lat: station.y,
                              lng: station.x,
                              name: station.stationName,
                            })
                          }
                        >
                          {station.stationName}
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div>하차 : {path.endName}</div>
              </div>
            );
          }

          return null;
        })}
      </Card.Body>
    </Card>
  );
}

export default RouteDetail;
