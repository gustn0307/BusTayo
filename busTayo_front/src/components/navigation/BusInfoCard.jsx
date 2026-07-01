import { Button } from "react-bootstrap";

// 버스 도착정보 카드 컴포넌트
// 역할:
// 1. 현재 버스 번호 표시
// 2. 도착 예정 정보 표시
// 3. 새로고침 버튼으로 도착정보/차량위치 재조회
// 4. 서울 / 경기 API 응답 형식 차이를 UI에서 처리
function BusInfoCard({
  // 현재 버스 구간 정보 (ODsay subPath)
  path,

  // 현재 노선의 도착정보 객체
  // RouteBusCard에서 arrivalMap[index] 중 busNo가 일치하는 것만 전달
  currentArrival,

  // 서울 여부
  // true = 서울 API 형식
  // false = 경기 API 형식
  isSeoul,

  // 정류장 순번
  // 도착정보 API 재호출 시 사용
  ord,

  // 현재 subPath index
  // RouteDetail의 arrivalMap / busLocationMap key
  index,

  // 도착정보 API 호출 함수
  loadArrival,

  // 차량위치 API 호출 함수
  loadBusLocation,

  // 경기 버스 기준:
  // 현재 조회된 차량은 있지만 모두 승차 정류장을 지난 상태인지 여부
  // RouteBusCard에서 계산해서 내려준다.
  allVehiclesPassed,
}) {
  return (
    <div
      className="border rounded p-3 my-2"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* 상단 영역: 버스번호 + 새로고침 버튼 */}
      <div className="d-flex align-items-center">
        {/* 현재 버스 번호 표시 */}
        <div className="fw-bold fs-5">🚌 {path.lane[0].busNo}번</div>

        {/* 도착정보 / 차량위치 수동 새로고침 버튼 */}
        <Button
          size="sm"
          className="ms-auto border-0 shadow-none"
          variant="light"
          onClick={() => {
            // 도착정보 재조회
            if (path.startLocalStationID) {
              loadArrival(
                path.startLocalStationID,
                path.startStationCityCode,
                path.lane[0].busLocalBlID,
                ord,
                index,
              );
            }

            // 차량위치 재조회
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

      {/* currentArrival이 존재할 때만 도착정보 영역 표시 */}
      {currentArrival && (
        <>
          {/* ========================= */}
          {/* 서울 API 응답 처리 */}
          {/* ========================= */}
          {isSeoul ? (
            <>
              {/* 서울 API는 arrmsg1 문자열로 도착메시지를 제공 */}
              <div>⏱ {currentArrival.arrmsg1}</div>

              {/* 몇 정류장 전인지 표시 */}
              {currentArrival.locationNo1 && (
                <div>📍 {currentArrival.locationNo1}정류장 전</div>
              )}

              {/* 좌석버스 계열이면 남은 좌석 수 표시 */}
              {Number(currentArrival.remainSeatCnt1) > 0 && (
                <div>🪑 빈자리 {currentArrival.remainSeatCnt1}석</div>
              )}
            </>
          ) : 
          
          /* ========================= */
          /* 경기 API 응답 처리 */
          /* ========================= */

          // 운행 종료
          currentArrival.flag === "STOP" ? (
            <div>🛑 오늘 운행이 종료되었습니다.</div>
          ) :

          // 회차지 대기
          currentArrival.flag === "WAIT" ? (
            <div>🔄 차량이 회차지에서 대기 중입니다.</div>
          ) :

          // 실제 도착예정 차량 존재
          currentArrival.predictTime1 ? (
            <>
              {/* 도착 예정 시간 */}
              <div>⏱ {currentArrival.predictTime1}분 후 도착</div>

              {/* 몇 정류장 전인지 */}
              <div>📍 {currentArrival.locationNo1}정류장 전</div>

              {/* 좌석 정보 */}
              {Number(currentArrival.remainSeatCnt1) > 0 && (
                <div>🪑 빈자리 {currentArrival.remainSeatCnt1}석</div>
              )}
            </>
          ) :

          // 차량은 존재하지만 승차 정류장을 모두 지나감
          allVehiclesPassed ? (
            <div>🌙 오늘 남은 도착 예정 차량이 없습니다.</div>
          ) :

          // 그 외 (아직 데이터 없음 / API 지연 등)
          (
            <div>🚌 현재 도착 예정 차량이 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
}

export default BusInfoCard;