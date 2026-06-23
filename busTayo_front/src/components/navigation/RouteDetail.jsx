import { Card, Badge, Button } from "react-bootstrap";
import { useState } from "react";

function RouteDetail({ route, setSelectedRoute, setSelectedStation }) {
  const [openStops, setOpenStops] = useState({});

  if (!route) return null;

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
            return (
              <div key={index}>
                <Badge bg="primary">{path.lane[0].busNo}번</Badge>

                <div
                  className="mt-2"
                  style={{
                    cursor: "pointer",
                    color: "#28a745",
                  }}
                  onClick={() => {
                    setSelectedStation({
                      lat: Number(path.startY),
                      lng: Number(path.startX),
                      name: path.startName,
                      zoomLevel: 2,
                    });
                  }}
                >
                  승차 : {path.startName}
                </div>

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

                {/* 정류장 목록 보여주기  */}
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
                          onClick={() => {
                            // 정류장 원본 데이터 유지
                            setSelectedStation({
                              ...station,

                              lat: Number(station.y),
                              lng: Number(station.x),

                              name: station.stationName,
                            });
                          }}
                        >
                          {station.stationName}
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div
                  style={{
                    cursor: "pointer",
                    color: "#dc3545",
                  }}
                  onClick={() => {
                    setSelectedStation({
                      lat: Number(path.endY),
                      lng: Number(path.endX),
                      name: path.endName,
                      zoomLevel: 2,
                    });
                  }}
                >
                  하차 : {path.endName}
                </div>
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
