function BusStopList({
  stations,
  setSelectedStation,
}) {
  if (!stations) return null;

  return (
    <div className="mt-2 ms-3 border-start ps-3">
      {stations.map((station, stationIndex) => (
        <div
          key={stationIndex}
          className="mb-1 small"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setSelectedStation({
              ...station,
              lat: Number(station.y),
              lng: Number(station.x),
              name: station.stationName,
            })
          }
        >
          {station.stationName}
        </div>
      ))}
    </div>
  );
}

export default BusStopList;