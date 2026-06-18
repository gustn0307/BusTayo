import { Card, Badge } from "react-bootstrap";

function SearchResultList({ routes, setSelectedRoute }) {
  const busRoutes = routes.filter((route) => route.pathType === 2);

  return (
    <>
      {busRoutes.map((route, index) => {
        // ★ 수정 : 현재 route의 버스 구간 찾기
        const busPaths = route.subPath.filter((path) => path.trafficType === 2);

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
              <h5 className="fw-bold">{route.info.totalTime}분</h5>

              <div className="small text-muted mb-2">
                환승 {route.info.busTransitCount}회 · 요금{" "}
                {route.info.payment.toLocaleString()}원 ·
                {(route.info.trafficDistance / 1000).toFixed(1)}km
              </div>

              {/* ★ 승차 정류장 */}
              <div>{busPaths[0]?.startName}</div>

              {/* ★ 버스 번호 */}
              <div className="my-2">
                {busPaths.map((bus, idx) => (
                  <Badge key={idx} bg="primary" className="me-1">
                    {bus.lane[0].busNo}
                  </Badge>
                ))}
              </div>

              {/* ★ 하차 정류장 */}
              <div>{busPaths[busPaths.length - 1]?.endName}</div>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}

export default SearchResultList;
