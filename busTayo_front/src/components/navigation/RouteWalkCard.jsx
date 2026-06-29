function RouteWalkCard({ path }) {
  return (
    <div className="my-3">
      🚶 도보 {path.distance}m
    </div>
  );
}

export default RouteWalkCard;