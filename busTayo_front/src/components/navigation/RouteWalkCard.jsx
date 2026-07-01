// 도보 구간 카드 컴포넌트
// 역할:
// 1. 버스 경로 사이의 도보 이동 구간 표시
// 2. 사용자가 환승 시 얼마나 걸어야 하는지 보여줌
// 3. RouteDetail에서 trafficType === 3 일 때 렌더링
function RouteWalkCard({
  // ODsay subPath 중 도보 구간 데이터
  // trafficType === 3
  path,
}) {
  return (
    <div className="my-3">
      {/* 도보 이동 거리 표시 */}
      🚶 도보 {path.distance}m
    </div>
  );
}

export default RouteWalkCard;