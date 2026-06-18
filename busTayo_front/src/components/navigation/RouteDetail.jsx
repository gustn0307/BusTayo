import { Card, Badge } from "react-bootstrap";

function RouteDetail({ route }) {
  if (!route) return null;

  return (
    <Card className="mt-3">
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

                <div className="mt-2">승차 : {path.startName}</div>

                <div>{path.stationCount}개 정류장 이동</div>

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
