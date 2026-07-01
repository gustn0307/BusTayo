import { Card, Badge } from "react-bootstrap";

// 버스 노선 유형에 따라 Badge 색상을 반환하는 함수
// ODsay 응답의 lane[0].type 값을 기준으로 색상을 결정한다.
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
      return "#6c757d"; // 알 수 없는 유형
  }
}

// 경로 검색 결과 목록 컴포넌트
// RouteSearchPanel에서 받은 routes 중 버스 경로만 카드 형태로 보여준다.
function SearchResultList({
  // ODsay API에서 받은 전체 경로 목록
  routes,

  // 사용자가 경로 카드를 클릭했을 때 상세 경로로 전환하는 setter
  // 값이 들어가면 RouteSearchPanel에서 RouteDetail이 렌더링된다.
  setSelectedRoute,

  // 출발/도착 정류장 이름을 클릭했을 때 지도 중심을 이동시키는 setter
  // KakaoMap은 selectedStation 변경을 감지해서 해당 좌표로 이동한다.
  setSelectedStation,
}) {
  // pathType === 2인 경로만 사용
  // 현재 서비스는 버스 전용 길찾기이므로 버스 경로만 목록에 표시한다.
  const busRoutes = routes.filter((route) => route.pathType === 2);

  return (
    <>
      {busRoutes.map((route, index) => {
        // 현재 경로 안에서 버스 탑승 구간만 추출
        // 도보 구간은 목록 카드 요약에서는 제외하고,
        // 상세 화면(RouteDetail)에서 별도로 보여준다.
        const busPaths = route.subPath.filter((path) => path.trafficType === 2);

        // 현재는 사용하지 않지만,
        // 여러 버스 번호를 요약 표시할 때 사용할 수 있는 값
        const busNumbers = busPaths.map((path) => path.lane[0].busNo);

        // 현재는 사용하지 않지만,
        // 첫 번째 버스 구간/마지막 버스 구간을 따로 다룰 때 사용할 수 있는 값
        const firstBus = busPaths[0];
        const lastBus = busPaths[busPaths.length - 1];

        return (
          // 경로 카드 전체 클릭 시 상세 경로 선택
          <Card
            key={index}
            className="mb-2"
            onClick={() => setSelectedRoute(route)}
            style={{
              cursor: "pointer",
            }}
          >
            <Card.Body>
              {/* 총 소요 시간 */}
              <h5 className="fw-bold mb-2">{route.info.totalTime}분</h5>

              <div className="mt-2">
                {busPaths.map((bus, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="d-flex align-items-center">
                      {/* 출발/환승 지점 표시 원 */}
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: idx === 0 ? "#28a745" : "#ffc107",
                          marginRight: "8px",
                        }}
                      />

                      {/* 승차 정류장 또는 환승 정류장 이름 */}
                      <div
                        className="fw-semibold"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          // 카드 클릭 이벤트가 실행되지 않도록 막는다.
                          // 정류장 이름 클릭은 상세 경로 진입이 아니라 지도 이동 목적이다.
                          e.stopPropagation();

                          const station = bus.passStopList?.stations?.[0];

                          if (!station) return;

                          // 지도 중심을 해당 승차 정류장으로 이동
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

                    {/* 버스 번호와 정류장 개수 표시 */}
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

                    {/* 마지막 버스 구간의 하차 정류장만 표시 */}
                    {idx === busPaths.length - 1 && (
                      <div className="d-flex align-items-center mt-2">
                        {/* 도착 지점 표시 원 */}
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#dc3545",
                            marginRight: "8px",
                          }}
                        />

                        {/* 최종 하차 정류장 이름 */}
                        <div
                          className="fw-semibold"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            // 카드 클릭 이벤트가 실행되지 않도록 막는다.
                            e.stopPropagation();

                            const stations = bus.passStopList?.stations;

                            if (!stations?.length) return;

                            const station = stations[stations.length - 1];

                            // 지도 중심을 최종 하차 정류장으로 이동
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

              {/* 경로 요약 정보 */}
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