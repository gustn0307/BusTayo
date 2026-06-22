import axios from "axios";

// 경기도 버스 도착정보 조회
export async function getGyeonggiBusArrival(
  stationId
) {
  const response =
    await axios.get(
      "/api/gyeonggi/busarrival",
      {
        params: {
          stationId,
        },
      }
    );

  return response.data;
}