import { Card, Badge, Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import api from "../../api";

function RouteDetail({
  route,
  startPlace,
  endPlace,
  setSelectedRoute,
  setSelectedStation,
}) {
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

  const [isFavorite, setIsFavorite] = useState(false);
  // 특정 정류장 도착 정보 조회
  const loadArrival = async (stationId, cityCode, pathIndex) => {
    try {
      const res = await api.get("/api/bus/arrival", {
        params: {
          stationId,
          cityCode,
        },
      });

      const list = res.data.response?.msgBody?.busArrivalList || [];

      setArrivalMap((prev) => ({
        ...prev,
        [pathIndex]: list,
      }));
    } catch (error) {
      console.error(error);
      console.log(error.response);
      console.log(error.response?.data);
    }
  };

  const loadBusLocation = async (routeId, pathIndex) => {
    try {
      const res = await api.get("/api/bus/location", {
        params: {
          routeId,
        },
      });

      const list = res.data.response?.msgBody?.busLocationList || [];

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

      if (path.startLocalStationID) {
        loadArrival(path.startLocalStationID, path.startStationCityCode, index);
      }

      if (path.lane?.[0]?.busLocalBlID) {
        loadBusLocation(path.lane[0].busLocalBlID, index);
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
        if (path.startLocalStationID) {
          loadArrival(
            path.startLocalStationID,
            path.startStationCityCode,
            index,
          );
        }

        // 차량위치 새로고침
        if (path.lane?.[0]?.busLocalBlID) {
          loadBusLocation(path.lane[0].busLocalBlID, index);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [openStops, route]);

  const handleFavorite = async () => {

  try {

    if (!route?.subPath?.length) {
      alert("경로 없음");
      return;
    }


    // 출발 정보 있는 첫 경로 찾기
    const startPath =
      route.subPath.find(
        path => path.startName
      );


    // 도착 정보 있는 마지막 경로 찾기
    const endPath =
      [...route.subPath]
      .reverse()
      .find(
        path => path.endName
      );


    if(!startPath || !endPath){
      alert("출발/도착 정보 없음");
      return;
    }



    const data = {

      name:
        `${startPath.startName} → ${endPath.endName}`,


      description:
        `${route.info.totalTime}분 경로`,


      start:
        startPath.startName,

      startX:
        Number(startPath.startX),

      startY:
        Number(startPath.startY),


      end:
        endPath.endName,

      endX:
        Number(endPath.endX),

      endY:
        Number(endPath.endY)

    };


    console.log(
      "저장 데이터",
      data
    );


    await api.post(
      "/api/favorites/navigating",
      data
    );


    setIsFavorite(true);

    alert("저장 완료");


  } catch(e){

    console.error(e);
    console.log(e.response?.data);

  }

};
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
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{route.info.totalTime}분</h4>

        </div>

        <hr />

        {route.subPath.map((path, index) => {
          if (path.trafficType === 3) {
            return <div key={index}>🚶 도보 {path.distance}m</div>;
          }

          if (path.trafficType === 2) {
            const currentArrival = arrivalMap[index]?.find(
              (bus) => String(bus.routeName) === String(path.lane[0].busNo),
            );

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
                        if (path.startLocalStationID) {
                          loadArrival(
                            path.startLocalStationID,
                            path.startStationCityCode,
                            index,
                          );
                        }

                        if (path.lane?.[0]?.busLocalBlID) {
                          loadBusLocation(path.lane[0].busLocalBlID, index);
                        }
                      }}
                    >
                      🔄
                    </Button>
                  </div>

                  {currentArrival && (
                    <>
                      <div>⏱ {currentArrival.predictTime1}분 후 도착</div>

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
                      loadArrival(
                        path.startLocalStationID,
                        path.startStationCityCode,
                        index,
                      );

                      loadBusLocation(path.lane[0].busLocalBlID, index);
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
                {openStops[index] && busLocationMap[index] && (
                  <div className="mt-3">
                    <h6>실시간 차량 위치</h6>

                    {[...busLocationMap[index]]
                      .sort((a, b) => b.stationSeq - a.stationSeq)
                      .slice(0, 5)
                      .map((vehicle) => {
                        return (
                          <div
                            key={vehicle.vehId}
                            className="border rounded p-2 mb-2"
                          >
                            <div className="fw-bold">🚍 {vehicle.plateNo}</div>

                            {/* 현재 정류장까지 남은 정거장 수 */}

                            {/* 좌석 정보 */}
                            {vehicle.remainSeatCnt > 0 && (
                              <div>🪑 빈자리 {vehicle.remainSeatCnt}석</div>
                            )}

                            <div>{getCrowdedBadge(vehicle.crowded)}</div>

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
              </div>
            );
          }

          return null;
        })}
      </Card.Body>
    </Card>
  );
}

export default RouteDetail;
