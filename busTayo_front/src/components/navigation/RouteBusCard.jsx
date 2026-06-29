import { Button } from "react-bootstrap";
import BusLocationList from "./BusLocationList";
import BusStopList from "./BusStopList";
import BusInfoCard from "./BusInfoCard";

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

  const currentArrival = arrivalMap[index]?.find(
    (bus) => String(bus.routeName) === String(path.lane[0].busNo),
  );

  const isSeoul = path.startStationCityCode === 1000;

  const startStation = path.passStopList?.stations?.find(
    (station) =>
      String(station.localStationID) === String(path.startLocalStationID),
  );

  const ord = startStation ? startStation.index + 1 : 1;

  return (
    <div>
      <BusInfoCard
        path={path}
        currentArrival={currentArrival}
        isSeoul={isSeoul}
        ord={ord}
        index={index}
        loadArrival={loadArrival}
        loadBusLocation={loadBusLocation}
      />
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
            loadArrival(
              path.startLocalStationID,
              path.startStationCityCode,
              path.lane[0].busLocalBlID,
              ord,
              index,
            );

            if (path.lane?.[0]?.busLocalBlID) {
              loadBusLocation(
                path.startStationCityCode,
                path.lane[0].busLocalBlID,
                index,
              );
            }
          }
        }}
      >
        정류장 보기 {openStops[index] ? "▲" : "▼"}
      </Button>

      {/* 정류장 목록 보여주기  */}
      {openStops[index] && (
        <BusStopList
          stations={path.passStopList?.stations}
          setSelectedStation={setSelectedStation}
        />
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
      {openStops[index] && (
        <BusLocationList vehicles={busLocationMap[index]} isSeoul={isSeoul} />
      )}
    </div>
  );
}

export default RouteBusCard;
