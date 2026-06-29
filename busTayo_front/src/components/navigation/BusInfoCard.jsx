import { Button } from "react-bootstrap";

function BusInfoCard({
  path,
  currentArrival,
  isSeoul,
  ord,
  index,
  loadArrival,
  loadBusLocation,
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
            <div>⏱ {currentArrival.arrmsg1}</div>
          ) : (
            <div>⏱ {currentArrival.predictTime1}분 후 도착</div>
          )}

          <div>📍 {currentArrival.locationNo1}정류장 전</div>

          {currentArrival.remainSeatCnt1 > 0 && (
            <div>🪑 빈자리 {currentArrival.remainSeatCnt1}석</div>
          )}
        </>
      )}
    </div>
  );
}

export default BusInfoCard;
