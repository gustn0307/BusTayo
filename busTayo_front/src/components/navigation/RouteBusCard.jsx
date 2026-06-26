import { Button } from "react-bootstrap";
import BusLocationList from "./BusLocationList";

function RouteBusCard({
  path,
  index,
  arrivalMap,
  busLocationMap,
  openStops,
  setOpenStops,
  loadArrival,
  loadBusLocation,
  setSelectedStation,
}) {
  if (path.trafficType !== 2) {
    return null;
  }

  const currentArrival =
    arrivalMap[index]?.find(
      (bus) =>
        String(bus.routeName) ===
        String(path.lane[0].busNo)
    );

  const isSeoul =
    path.startStationCityCode === 1000;

  const startStation =
    path.passStopList?.stations?.find(
      (station) =>
        String(station.localStationID) ===
        String(path.startLocalStationID)
    );

  const ord =
    startStation ? startStation.index + 1 : 1;

  return (
    <div>

      {/* 여기부터 기존 RouteDetail 안의 버스카드 JSX 붙여넣기 */}

    </div>
  );
}

export default RouteBusCard;



if (path.trafficType === 2) {
            console.log("===== path =====");
            console.log({
              startID: path.startID,
              startLocalStationID: path.startLocalStationID,
              startName: path.startName,
              busLocalBlID: path.lane[0].busLocalBlID,
            });
            const currentArrival = arrivalMap[index]?.find(
              (bus) => String(bus.routeName) === String(path.lane[0].busNo),
            );
            const isSeoul = path.startStationCityCode === 1000;

            return (
              <div key={index}>
                <div
                  className="border rounded p-3 my-2"
                  style={{
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="fw-bold fs-5">
                      🚌 {path.lane[0].busNo}번
                    </div>
                    <Button
                      size="sm"
                      className="ms-auto border-0 shadow-none"
                      variant="light"
                      onClick={() => {
                        const startStation = path.passStopList?.stations?.find(
                          (station) =>
                            String(station.localStationID) ===
                            String(path.startLocalStationID),
                        );

                        const ord = startStation ? startStation.index + 1 : 1;

                        if (path.startLocalStationID) {
                          console.log({
                            cityCode: path.startStationCityCode,
                            stationId: path.startLocalStationID,
                            routeId: path.lane?.[0]?.busLocalBlID,
                            busNo: path.lane?.[0]?.busNo,
                          });
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
                <div
                  className="fw-bold text-success"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedStation({
                      lat: Number(path.startY),
                      lng: Number(path.startX),
                      name: path.startName,
                      zoomLevel: 2,
                    });
                  }}
                >
                  🚏 {path.startName}
                </div>
                <div className="text-center my-2">↓</div>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => {
                    const open = !openStops[index];

                    setOpenStops((prev) => ({
                      ...prev,
                      [index]: open,
                    }));

                    if (open && path.startLocalStationID) {
                      const startStation = path.passStopList?.stations?.find(
                        (station) =>
                          String(station.localStationID) ===
                          String(path.startLocalStationID),
                      );

                      const ord = startStation ? startStation.index + 1 : 1;

                      console.log({
                        cityCode: path.startStationCityCode,
                        stationId: path.startLocalStationID,
                        routeId: path.lane?.[0]?.busLocalBlID,
                        busNo: path.lane?.[0]?.busNo,
                      });
                      loadArrival(
                        path.startLocalStationID,
                        path.startStationCityCode,
                        path.lane[0].busLocalBlID,
                        ord,
                        index,
                      );

                      loadBusLocation(
                        path.startStationCityCode,
                        path.lane[0].busLocalBlID,
                        index,
                      );
                    }
                  }}
                >
                  정류장 보기 {openStops[index] ? "▲" : "▼"}
                </Button>

                {/* 정류장 목록 보여주기  */}
                {openStops[index] && (
                  <div className="mt-2 ms-3 border-start ps-3">
                    {path.passStopList?.stations?.map(
                      (station, stationIndex) => (
                        <div
                          key={stationIndex}
                          className="mb-1 small"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // 정류장 원본 데이터 유지
                            setSelectedStation({
                              ...station,

                              lat: Number(station.y),
                              lng: Number(station.x),

                              name: station.stationName,
                            });
                          }}
                        >
                          {station.stationName}
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div className="text-center my-2">↓</div>
                <div
                  className="fw-bold text-danger"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedStation({
                      lat: Number(path.endY),
                      lng: Number(path.endX),
                      name: path.endName,
                      zoomLevel: 2,
                    });
                  }}
                >
                  🚏 {path.endName}
                </div>
                <BusLocationList
                  vehicles={busLocationMap[index]}
                  isSeoul={isSeoul}
                />
              </div>
            );
          }