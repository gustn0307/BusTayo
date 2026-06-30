import { Button } from "react-bootstrap";

function BusInfoCard({
  path,
  currentArrival,
  isSeoul,
  ord,
  index,
  loadArrival,
  loadBusLocation,
  allVehiclesPassed,
}) {
  return (
    <div
      className="border rounded p-3 my-2"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="d-flex align-items-center">
        <div className="fw-bold fs-5">🚌 {path.lane[0].busNo}번</div>

        <Button
          size="sm"
          className="ms-auto border-0 shadow-none"
          variant="light"
          onClick={() => {
            if (path.startLocalStationID) {
              loadArrival(
                path.startLocalStationID,
                path.startStationCityCode,
                path.lane[0].busLocalBlID,
                ord,
                index,
              );
            }

            if (path.lane?.[0]?.busLocalBlID) {
              loadBusLocation(
                path.startStationCityCode,
                path.lane[0].busLocalBlID,
                index,
              );
            }
          }}
        >
          🔄
        </Button>
      </div>

      {currentArrival && (
        <>
          {isSeoul ? (
            <>
              <div>⏱ {currentArrival.arrmsg1}</div>

              {currentArrival.locationNo1 && (
                <div>📍 {currentArrival.locationNo1}정류장 전</div>
              )}

              {Number(currentArrival.remainSeatCnt1) > 0 && (
                <div>🪑 빈자리 {currentArrival.remainSeatCnt1}석</div>
              )}
            </>
          ) : currentArrival.flag === "STOP" ? (
            <div>🛑 오늘 운행이 종료되었습니다.</div>
          ) : currentArrival.flag === "WAIT" ? (
            <div>🔄 차량이 회차지에서 대기 중입니다.</div>
          ) : currentArrival.predictTime1 ? (
            <>
              <div>⏱ {currentArrival.predictTime1}분 후 도착</div>

              <div>📍 {currentArrival.locationNo1}정류장 전</div>

              {Number(currentArrival.remainSeatCnt1) > 0 && (
                <div>🪑 빈자리 {currentArrival.remainSeatCnt1}석</div>
              )}
            </>
          ) : allVehiclesPassed ? (
            <div>🌙 오늘 남은 도착 예정 차량이 없습니다.</div>
          ) : (
            <div>🚌 현재 도착 예정 차량이 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
}

export default BusInfoCard;
