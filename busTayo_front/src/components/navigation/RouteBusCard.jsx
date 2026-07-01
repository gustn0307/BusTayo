import { Button } from "react-bootstrap";
import { useEffect } from "react";
import BusStopList from "./BusStopList";
import BusInfoCard from "./BusInfoCard";

// 상세 경로 안에서 "버스 구간" 하나를 렌더링하는 컴포넌트
// 역할:
// 1. 해당 버스 구간의 도착정보 표시
// 2. 승차/하차 정류장 표시
// 3. 정류장 목록 펼치기/접기
// 4. 차량 위치 데이터를 지도 마커용 데이터로 변환
function RouteBusCard({
  // ODsay subPath 중 trafficType === 2인 버스 구간 데이터
  path,

  // 현재 subPath의 index
  // arrivalMap, busLocationMap, openStops에서 key로 사용된다.
  index,

  // 버스 도착정보 저장 객체
  // key = path index
  // value = 해당 버스 구간의 도착정보 배열
  arrivalMap,

  // 버스 차량위치 저장 객체
  // key = path index
  // value = 해당 버스 구간의 차량위치 배열
  busLocationMap,

  // 정류장 목록 펼침 상태
  // key = path index
  // value = true / false
  openStops,

  // 정류장 목록 펼침 상태 변경 함수
  setOpenStops,

  // 도착정보 API 호출 함수
  // RouteDetail에서 내려받는다.
  loadArrival,

  // 차량위치 API 호출 함수
  // RouteDetail에서 내려받는다.
  loadBusLocation,

  // 지도 중심 이동 대상 설정 함수
  // 승차/하차 정류장 클릭 시 KakaoMap을 해당 위치로 이동시킨다.
  setSelectedStation,

  // 지도에 표시할 버스 마커 목록 변경 함수
  // 이 컴포넌트에서 차량위치 데이터를 가공한 뒤 KakaoMap으로 전달한다.
  setBusMarkers,
}) {
  // 버스 구간이 아니면 렌더링하지 않는다.
  if (path.trafficType !== 2) {
    return null;
  }

  // 현재 버스 구간에 해당하는 도착정보 하나를 찾는다.
  // arrivalMap[index]에는 해당 정류장의 여러 노선 도착정보가 들어올 수 있으므로
  // ODsay의 버스 번호(path.lane[0].busNo)와 일치하는 노선만 선택한다.
  const currentArrival = arrivalMap[index]?.find(
    (bus) => String(bus.routeName) === String(path.lane[0].busNo),
  );

  // 서울/경기 API 응답 형식이 다르므로 cityCode로 구분한다.
  // ODsay 기준 서울 cityCode는 1000
  const isSeoul = path.startStationCityCode === 1000;

  // 현재 버스 구간의 승차 정류장을 passStopList에서 찾는다.
  // 도착정보 API 호출 시 정류장 순번 계산에 사용된다.
  const startStation = path.passStopList?.stations?.find(
    (station) =>
      String(station.localStationID) === String(path.startLocalStationID),
  );

  // 도착정보 API 호출에 필요한 정류장 순번
  // ODsay index는 0부터 시작하므로 API 요청용으로 +1 처리한다.
  const ord = startStation ? startStation.index + 1 : 1;

  // 승차 정류장의 index
  // 차량이 승차 정류장을 이미 지났는지 판단할 때 보조 기준으로 사용한다.
  const startIndex = startStation ? startStation.index : 0;

  // 경기 도착정보 응답에 staOrder가 있으면 그것을 우선 사용한다.
  // staOrder는 전체 노선 기준의 정류장 순번이라 stationSeq와 비교하기 더 적합하다.
  const startOrder = currentArrival?.staOrder ?? startIndex + 1;

  // 현재 버스 구간의 차량 위치 목록
  // RouteDetail의 loadBusLocation 결과가 busLocationMap[index]에 저장된다.
  const routeVehicles = busLocationMap[index] ?? [];

  // 승차 정류장을 아직 지나지 않은 차량이 있는지 확인한다.
  // 경기 차량위치 API의 stationSeq는 전체 노선 기준 1부터 시작하는 순번이다.
  const hasUpcomingVehicle = routeVehicles.some((vehicle) => {
    if (vehicle.stationSeq == null) return false;

    return Number(vehicle.stationSeq) <= Number(startOrder);
  });

  // 현재 조회된 차량은 있지만 모두 승차 정류장을 지나간 상태인지 판단한다.
  // BusInfoCard에서 "오늘 남은 도착 예정 차량이 없습니다" 같은 안내에 사용된다.
  const allVehiclesPassed = routeVehicles.length > 0 && !hasUpcomingVehicle;

  // 차량위치 API 응답을 KakaoMap에서 사용할 수 있는 마커 배열로 변환한다.
  // busLocationMap[index]가 갱신될 때마다 실행된다.
  useEffect(() => {
    if (!busLocationMap[index]) return;

    const markers = busLocationMap[index]
      .map((vehicle) => {
        // 서울 차량위치 API는 gpsX/gpsY 좌표를 직접 제공한다.
        if (isSeoul) {
          // 현재 버스 위치와 가장 가까운 ODsay 정류장을 찾는다.
          // 서울은 전체 노선 차량이 내려올 수 있으므로,
          // 사용자가 실제로 타는 구간과 관련 있는지 판단하기 위한 보조 정보다.
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

          // 가장 가까운 정류장이 현재 이용 구간 안에 있는지 확인한다.
          const nearestIndex = path.passStopList.stations.findIndex(
            (station) =>
              String(station.localStationID) ===
              String(nearestStation.localStationID),
          );

          // 현재 이용 구간과 관련 없는 차량은 지도에 표시하지 않는다.
          if (nearestIndex < 0) {
            return null;
          }

          // KakaoMap에서 사용할 서울 버스 마커 데이터
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

        // 경기 차량위치 API는 좌표를 직접 주지 않고 stationSeq를 제공한다.
        // 현재는 stationSeq를 기준으로 ODsay passStopList의 정류장 좌표를 사용한다.
        const station =
          path.passStopList?.stations?.[Number(vehicle.stationSeq) - 1];

        // stationSeq가 현재 이용 구간 밖이면 매칭되는 정류장이 없을 수 있다.
        if (!station) {
          console.log("정류장 못찾음", vehicle.stationSeq);
          return null;
        }

        // KakaoMap에서 사용할 경기 버스 마커 데이터
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

    // 가공된 버스 마커 목록을 부모 상태에 저장
    // RouteSearch → KakaoMap으로 전달되어 지도에 표시된다.
    setBusMarkers(markers);
  }, [busLocationMap, index, isSeoul, setBusMarkers]);

  return (
    <div>
      {/* 버스 번호, 도착정보, 새로고침 버튼 표시 */}
      <BusInfoCard
        path={path}
        currentArrival={currentArrival}
        isSeoul={isSeoul}
        ord={ord}
        index={index}
        loadArrival={loadArrival}
        loadBusLocation={loadBusLocation}
        allVehiclesPassed={allVehiclesPassed}
      />

      {/* 승차 정류장 */}
      <div
        className="fw-bold text-success"
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          // 승차 정류장을 클릭하면 지도 중심을 해당 정류장으로 이동
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

      {/* 정류장 목록 펼치기/접기 버튼 */}
      <Button
        variant="link"
        className="p-0 text-decoration-none"
        onClick={() => {
          const open = !openStops[index];

          // 현재 버스 구간의 정류장 목록 펼침 상태 변경
          setOpenStops((prev) => ({
            ...prev,
            [index]: open,
          }));

          // 정류장 목록을 펼칠 때 도착정보와 차량위치를 다시 조회한다.
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

      {/* 정류장 목록 */}
      {openStops[index] && (
        <BusStopList
          stations={path.passStopList?.stations}
          setSelectedStation={setSelectedStation}
        />
      )}

      <div className="text-center my-2">↓</div>

      {/* 하차 정류장 */}
      <div
        className="fw-bold text-danger"
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          // 하차 정류장을 클릭하면 지도 중심을 해당 정류장으로 이동
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