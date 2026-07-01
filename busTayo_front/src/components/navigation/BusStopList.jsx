// 정류장 목록 컴포넌트
// 역할:
// 1. 현재 버스 노선의 모든 정류장을 리스트로 표시
// 2. 사용자가 정류장을 클릭하면 해당 정류장 위치로 지도 이동
function BusStopList({
  // 현재 버스 구간의 전체 정류장 목록
  // RouteBusCard → path.passStopList.stations 전달
  stations,

  // 클릭한 정류장을 부모(RouteSearch → KakaoMap)로 전달
  // 선택된 정류장 기준으로 지도 중심 이동
  setSelectedStation,
}) {
  // 정류장 데이터가 없으면 렌더링하지 않음
  if (!stations) return null;

  return (
    <div className="mt-2 ms-3 border-start ps-3">
      {/* 전체 정류장 목록 렌더링 */}
      {stations.map((station, stationIndex) => (
        <div
          key={stationIndex}
          className="mb-1 small"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setSelectedStation({
              // 원본 정류장 데이터 유지
              ...station,

              // KakaoMap에서 사용하는 좌표 형식으로 변환
              lat: Number(station.y),
              lng: Number(station.x),

              // 지도 marker label용 이름
              name: station.stationName,
            })
          }
        >
          {/* 정류장 이름 표시 */}
          {station.stationName}
        </div>
      ))}
    </div>
  );
}

export default BusStopList;