import { Button } from "react-bootstrap";
import { useEffect } from "react";
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
  setBusMarkers,
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

  console.log("ODsay 정류장 목록", path.passStopList?.stations);
  console.log("첫 번째 정류장", path.passStopList?.stations?.[0]);

  console.log(
    "ODsay localStationID 목록",
    path.passStopList?.stations?.map((station) => ({
      index: station.index,
      name: station.stationName,
      localStationID: station.localStationID,
    })),
  );

  const ord = startStation ? startStation.index + 1 : 1;

  useEffect(() => {
    if (!busLocationMap[index]) return;

    const markers = busLocationMap[index]
      .map((vehicle) => {
        if (isSeoul) {
          const nearestStation = path.passStopList?.stations?.reduce(
            (prev, current) => {
              const prevDist =
                Math.pow(Number(vehicle.gpsY) - Number(prev.y), 2) +
                Math.pow(Number(vehicle.gpsX) - Number(prev.x), 2);

              const currDist =
                Math.pow(Number(vehicle.gpsY) - Number(current.y), 2) +
                Math.pow(Number(vehicle.gpsX) - Number(current.x), 2);

              return currDist < prevDist ? current : prev;
            },
          );

          const nearestIndex = path.passStopList.stations.findIndex(
            (station) =>
              String(station.localStationID) ===
              String(nearestStation.localStationID),
          );

          console.log(
            vehicle.plainNo,
            "nearestIndex =",
            nearestIndex,
            nearestStation.stationName,
          );

          // 현재 이용 구간(승차~하차) 안의 차량만 표시
          if (nearestIndex < 0) {
            return null;
          }

          return {
            lat: Number(vehicle.gpsY),
            lng: Number(vehicle.gpsX),
            plateNo: vehicle.plainNo,
            congetion: vehicle.congetion,
            stopFlag: vehicle.stopFlag,
            nearestStation,
            nearestIndex,
            isSeoul: true,
          };
        }

        // 경기
        const station =
          path.passStopList?.stations?.[Number(vehicle.stationSeq) - 1];

        if (!station) {
          console.log("정류장 못찾음", vehicle.stationSeq);
          return null;
        }

        return {
          lat: Number(station.y),

          lng: Number(station.x),

          plateNo: vehicle.plateNo,

          crowded: vehicle.crowded,

          stateCd: vehicle.stateCd,

          isSeoul: false,
        };
      })

      .filter(Boolean);
    console.log("markers: ", markers);

    setBusMarkers(markers);
  }, [busLocationMap, index, isSeoul, setBusMarkers]);

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
    </div>
  );
}

export default RouteBusCard;
