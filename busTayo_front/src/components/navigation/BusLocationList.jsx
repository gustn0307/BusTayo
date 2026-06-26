function BusLocationList(vehicles, isSeoul) {
  return (
    <>
      {openStops[index] && vehicles && (
        <div className="mt-3">
          <h6>실시간 차량 위치</h6>

          {[...vehicles]
            .sort((a, b) => b.stationSeq - a.stationSeq)
            .slice(0, 5)
            .map((vehicle) => {
              return (
                <div key={vehicle.vehId} className="border rounded p-2 mb-2">
                  <div className="fw-bold">
                    🚍 {isSeoul ? vehicle.plainNo : vehicle.plateNo}
                  </div>

                  {/* 현재 정류장까지 남은 정거장 수 */}

                  {/* 좌석 정보 */}
                  {vehicle.remainSeatCnt > 0 && (
                    <div>🪑 빈자리 {vehicle.remainSeatCnt}석</div>
                  )}

                  {!isSeoul && <div>{getCrowdedBadge(vehicle.crowded)}</div>}

                  {/* 차량 상태 */}
                  <div>
                    📍
                    {vehicle.stateCd === 0 && "교차로 통과"}
                    {vehicle.stateCd === 1 && "정류장 도착"}
                    {vehicle.stateCd === 2 && "정류장 출발"}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

export default BusLocationList;
