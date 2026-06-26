import { Card, Badge, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import BusLocationList from "./BusLocationList";
import RouteBusCard from "./RouteBusCard";

function RouteDetail({ route, setSelectedRoute, setSelectedStation }) {
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
  const [openStops, setOpenStops] = useState({});

  const [arrivalMap, setArrivalMap] = useState({});

  const [busLocationMap, setBusLocationMap] = useState({});

  // 특정 정류장 도착 정보 조회
  const loadArrival = async (stationId, cityCode, routeId, ord, pathIndex) => {
    console.log("========== loadArrival ==========");
    console.log("stationId :", stationId);
    console.log("cityCode  :", cityCode);
    console.log("routeId   :", routeId);
    console.log("ord       :", ord);
    console.log("===============================");
    try {
      const res = await axios.get("http://localhost:8080/api/bus/arrival", {
        params: {
          stationId,
          cityCode,
          routeId,
          ord,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("도착정보: ", res.data);

      const raw = res.data.response?.msgBody?.busArrivalList;

      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      setArrivalMap((prev) => {
        const next = {
          ...prev,
          [pathIndex]: list,
        };

        return next;
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 버스의 위치 정보 조회
  const loadBusLocation = async (cityCode, routeId, pathIndex) => {
    try {
      const res = await axios.get("http://localhost:8080/api/bus/location", {
        params: {
          routeId,
          cityCode,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const raw = res.data.response?.msgBody?.busLocationList;

      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      setBusLocationMap((prev) => ({
        ...prev,
        [pathIndex]: list,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!route) return;

    route.subPath.forEach((path, index) => {
      if (path.trafficType !== 2) return;

      const startStation = path.passStopList?.stations?.find(
        (station) =>
          String(station.localStationID) === String(path.startLocalStationID),
      );

      const ord = startStation ? startStation.index + 1 : 1;

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
    });
  }, [route]);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(openStops).forEach((index) => {
        if (!openStops[index]) return;

        const path = route?.subPath?.[index];

        if (!path) return;

        if (path.trafficType !== 2) return;

        // 도착정보 새로고침
        const startStation = path.passStopList?.stations?.find(
          (station) =>
            String(station.localStationID) === String(path.startLocalStationID),
        );

        const ord = startStation ? startStation.index + 1 : 1;

        if (path.startLocalStationID) {
          loadArrival(
            path.startLocalStationID,
            path.startStationCityCode,
            path.lane[0].busLocalBlID,
            ord,
            index,
          );
        }

        // 차량위치 새로고침
        if (path.lane?.[0]?.busLocalBlID) {
          loadBusLocation(
            path.startStationCityCode,
            path.lane[0].busLocalBlID,
            index,
          );
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [openStops, route]);

  if (!route) return null;

  return (
    <Card className="mt-3">
      <Button
        variant="light"
        className="mb-3"
        onClick={() => setSelectedRoute(null)}
      >
        ← 경로 목록
      </Button>
      <Card.Body>
        <h4>{route.info.totalTime}분</h4>

        <hr />

        {route.subPath.map((path, index) => {
          if (path.trafficType === 3) {
            return <div key={index}>🚶 도보 {path.distance}m</div>;
          }

          <RouteBusCard
            key={index}
            path={path}
            index={index}
            arrivalMap={arrivalMap}
            busLocationMap={busLocationMap}
            openStops={openStops}
            setOpenStops={setOpenStops}
            loadArrival={loadArrival}
            loadBusLocation={loadBusLocation}
            setSelectedStation={setSelectedStation}
          />;

          return null;
        })}
      </Card.Body>
    </Card>
  );
}

export default RouteDetail;
