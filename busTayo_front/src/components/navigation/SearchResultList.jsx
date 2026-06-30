import { Card, Badge } from "react-bootstrap";

function getBusColor(type) {
  switch (type) {
    case 14:
      return "#e74c3c"; // 광역 빨강

    case 11:
      return "#2e86de"; // 간선 파랑

    case 12:
      return "#27ae60"; // 지선 초록

    case 4:
      return "#c0392b"; // 직행좌석 빨강

    case 3:
      return "#2ecc71"; // 마을 초록

    case 1:
      return "#f1c40f"; // 일반 노랑

    default:
      return "#6c757d";
  }
}

function SearchResultList({ routes, setSelectedRoute, setSelectedStation }) {
  const busRoutes = routes.filter((route) => route.pathType === 2);

  return (
    <>
      {busRoutes.map((route, index) => {
        // ★ 수정 : 현재 route의 버스 구간 찾기
        const busPaths = route.subPath.filter((path) => path.trafficType === 2);

        const busNumbers = busPaths.map((path) => path.lane[0].busNo);

        const firstBus = busPaths[0];

        const lastBus = busPaths[busPaths.length - 1];

        return (
          <Card
            key={index}
            className="mb-2"
            onClick={() => setSelectedRoute(route)}
            style={{
              cursor: "pointer",
            }}
          >
            <Card.Body>
              <h5 className="fw-bold mb-2">{route.info.totalTime}분</h5>

              <div className="mt-2">
                {busPaths.map((bus, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: idx === 0 ? "#28a745" : "#ffc107",
                          marginRight: "8px",
                        }}
                      />

                      <div
                        className="fw-semibold"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          const station = bus.passStopList?.stations?.[0];

                          if (!station) return;

                          setSelectedStation({
                            lat: Number(station.y),
                            lng: Number(station.x),
                            name: station.stationName,
                          });
                        }}
                      >
                        {idx === 0
                          ? bus.startName
                          : "🔄 환승 : " + bus.startName}
                      </div>
                    </div>

                    <div className="ms-3 my-1">
                      ↓
                      <Badge
                        bg=""
                        style={{
                          backgroundColor: getBusColor(bus.lane[0].type),
                        }}
                      >
                        {bus.lane[0].busNo}
                      </Badge>
                      <span className="ms-2 small text-muted">
                        {bus.stationCount}개 정류장
                      </span>
                    </div>

                    {idx === busPaths.length - 1 && (
                      <div className="d-flex align-items-center mt-2">
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#dc3545",
                            marginRight: "8px",
                          }}
                        />

                        <div
                          className="fw-semibold"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();

                            const stations = bus.passStopList?.stations;

                            if (!stations?.length) return;

                            const station = stations[stations.length - 1];

                            setSelectedStation({
                              lat: Number(station.y),
                              lng: Number(station.x),
                              name: station.stationName,
                            });
                          }}
                        >
                          {bus.endName}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <hr />

              <div className="small text-muted">
                환승 {route.info.busTransitCount - 1}회 · 요금{" "}
                {route.info.payment.toLocaleString()}원 ·
                {(route.info.trafficDistance / 1000).toFixed(1)}km
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}

export default SearchResultList;
