import { Card, Badge, Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import api from "../../api";
import RouteBusCard from "./RouteBusCard";
import RouteWalkCard from "./RouteWalkCard";

// 선택한 경로의 상세 정보를 보여주는 컴포넌트
// 버스 구간 / 도보 구간을 나눠 렌더링하며,
// 실시간 도착정보 + 차량 위치 정보도 함께 관리한다.
function RouteDetail({
  // SearchResultList에서 선택된 경로 객체
  // ODsay API result.path 중 하나
  route,

  // 상세 경로 화면 종료 후 경로 목록 화면으로 복귀하는 setter
  setSelectedRoute,

  // 지도 중심 이동 대상 설정 함수
  // 정류장 클릭 시 KakaoMap이 해당 좌표로 이동한다.
  setSelectedStation,

  // 현재 지도에 표시 중인 버스 마커 목록
  // (현재 RouteDetail 내부에서는 직접 사용하지 않음)
  busMarkers,

  // 버스 마커 상태 변경 함수
  // RouteBusCard에서 계산된 차량 위치를 KakaoMap으로 전달한다.
  setBusMarkers,
}) {
  // 정류장 펼침 상태 관리
  // key = path index
  // value = true / false
  const [openStops, setOpenStops] = useState({});

  // 도착 정보 저장
  // key = path index
  // value = 해당 버스 구간의 도착정보 배열
  const [arrivalMap, setArrivalMap] = useState({});

  // 차량 위치 저장
  // key = path index
  // value = 해당 버스 구간의 차량 위치 배열
  const [busLocationMap, setBusLocationMap] = useState({});

  const [isFavorite, setIsFavorite] = useState(false);


  // 특정 정류장의 도착 정보 조회
  const loadArrival = async (stationId, cityCode, routeId, ord, pathIndex) => {
    try {
      const res = await api.get("/api/bus/arrival", {
        params: {
          stationId,
          cityCode,
          routeId,
          ord,
        },
      });

      // 경기 API 응답 구조 기준
      const raw = res.data.response?.msgBody?.busArrivalList;

      // 응답이 단일 객체 or 배열일 수 있으므로 배열로 정규화
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      // pathIndex 기준으로 저장
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

  // 버스 차량 위치 정보 조회
  const loadBusLocation = async (cityCode, routeId, pathIndex) => {
    try {
      const res = await api.get("/api/bus/location", {
        params: {
          routeId,
          cityCode,
        },
      });

      let raw;

      // 서울 / 경기 API 응답 구조가 다르므로 분기 처리
      if (cityCode === 1000) {
        // 서울
        raw = res.data.busLocationList;
      } else {
        // 경기
        raw = res.data.response?.msgBody?.busLocationList;
      }

      // 단일 객체 or 배열 응답을 배열로 정규화
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      // pathIndex 기준으로 저장
      setBusLocationMap((prev) => ({
        ...prev,
        [pathIndex]: list,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // RouteDetail 최초 진입 시
  // 경로 내부의 모든 버스 구간에 대해 도착정보 + 차량위치 조회
  useEffect(() => {
    if (!route) return;

    route.subPath.forEach((path, index) => {
      // 버스 구간만 처리
      if (path.trafficType !== 2) return;

      // 현재 버스 구간의 승차 정류장 찾기
      const startStation = path.passStopList?.stations?.find(
        (station) =>
          String(station.localStationID) === String(path.startLocalStationID),
      );

      // 경기 도착 API용 정류장 순번 계산
      const ord = startStation ? startStation.index + 1 : 1;

      // 도착 정보 조회
      if (path.startLocalStationID) {
        loadArrival(
          path.startLocalStationID,
          path.startStationCityCode,
          path.lane[0].busLocalBlID,
          ord,
          index,
        );
      }

      // 차량 위치 조회
      if (path.lane?.[0]?.busLocalBlID) {
        loadBusLocation(
          path.startStationCityCode,
          path.lane[0].busLocalBlID,
          index,
        );
      }
    });
  }, [route]);

  // 30초마다 도착정보/차량위치 자동 새로고침
  // 단, 정류장 보기가 열린 버스 구간만 갱신
  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(openStops).forEach((index) => {
        // 정류장 접혀있으면 skip
        if (!openStops[index]) return;

        const path = route?.subPath?.[index];

        if (!path) return;

        // 버스 구간만 처리
        if (path.trafficType !== 2) return;

        // 승차 정류장 찾기
        const startStation = path.passStopList?.stations?.find(
          (station) =>
            String(station.localStationID) === String(path.startLocalStationID),
        );

        const ord = startStation ? startStation.index + 1 : 1;

        // 도착정보 새로고침
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
    }, 30000);

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
      {/* 경로 목록으로 복귀 */}
      <Button
        variant="light"
        className="mb-3"
        onClick={() => setSelectedRoute(null)}
      >
        ← 경로 목록
      </Button>

      <Card.Body>
        {/* 총 소요 시간 */}
        <h4>{route.info.totalTime}분</h4>
        <hr />

        {/* 상세 경로 렌더링 */}
        {route.subPath.map((path, index) => {
          // 도보 구간
          if (path.trafficType === 3) {
            return <RouteWalkCard key={index} path={path} />;
          }

          // 버스 구간
          return (
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
              setBusMarkers={setBusMarkers}
            />
          );
        })}
      </Card.Body>
    </Card>
  );
}

export default RouteDetail;