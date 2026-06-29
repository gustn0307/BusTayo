function BusLocationList({ vehicles, isSeoul, stations, startOrd, startLocalStationID }) {
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

  if (!vehicles) return null;

  const startStation = stations?.find(
    (station) =>
      String(station.localStationID) === String(startLocalStationID)
  );

  const startIndex = startStation?.index ?? 0;

  return (
    <>
      <div className="mt-3">
        <h6>실시간 차량 위치</h6>

        {[...vehicles]
          .sort((a, b) =>
            isSeoul
              ? Number(a.sectOrd) - Number(b.sectOrd)
              : b.stationSeq - a.stationSeq
          )
          .slice(0, 5)
          .map((vehicle) => {
            console.log("vehicle =", vehicle);

            console.log(
              "stationIDs =",
              stations.map((s) => ({
                name: s.stationName,
                stationID: s.stationID,
                localStationID: s.localStationID,
              }))
            );
            console.log("vehicle.nextStId =", vehicle.nextStId);
            console.log("vehicle.trnstnid =", vehicle.trnstnid);
            let currentStation = null;
            let remainStops = null;

            if (isSeoul && stations) {

              currentStation = stations.find(
                (station) =>
                  String(station.stationID) === String(vehicle.trnstnid)
              );

              if (currentStation) {
                remainStops =
                  currentStation.index - startIndex;
              }
            }

            return (
              <div key={vehicle.vehId} className="border rounded p-2 mb-2">
                <div className="fw-bold">
                  🚍 {isSeoul ? vehicle.plainNo : vehicle.plateNo}
                </div>
                {isSeoul && (
                  <>
                    <div>📍 {currentStation?.stationName}</div>
                    <div>남은 정류장 : {remainStops}정거장</div>
                  </>
                )}

                {/* 현재 정류장까지 남은 정거장 수 */}

                {/* 좌석 정보 */}
                {vehicle.remainSeatCnt > 0 && (
                  <div>🪑 빈자리 {vehicle.remainSeatCnt}석</div>
                )}

                <div>
                  {getCrowdedBadge(
                    isSeoul ? vehicle.congetion : vehicle.crowded
                  )}
                </div>

                {/* 차량 상태 */}
                <div>
                  📍
                  {isSeoul ? (
                    Number(vehicle.stopFlag) === 1
                      ? "정류장 정차"
                      : "운행중"
                  ) : (
                    <>
                      {vehicle.stateCd === 0 && "교차로 통과"}
                      {vehicle.stateCd === 1 && "정류장 도착"}
                      {vehicle.stateCd === 2 && "정류장 출발"}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default BusLocationList;
