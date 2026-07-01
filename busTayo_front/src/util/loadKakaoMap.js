// Kakao Map SDK 로더 유틸 함수
// 역할:
// 1. 카카오맵 SDK script를 동적으로 로드
// 2. 이미 로드된 경우 재사용
// 3. Promise 기반으로 컴포넌트에서 async/await처럼 사용 가능
//
// 사용 위치:
// - PlaceSearchInput.jsx
// - KakaoMap.jsx
//
// 이유:
// index.html에 미리 script를 넣지 않고,
// 실제 필요한 시점에 SDK를 로드하기 위함
export const loadKakaoMap = () => {
  return new Promise((resolve, reject) => {
    // 이미 Kakao SDK가 로드된 경우
    // script 재삽입 없이 바로 반환
    if (
      window.kakao &&
      window.kakao.maps
    ) {
      resolve(window.kakao);
      return;
    }

    // Kakao SDK script 태그 생성
    const script = document.createElement("script");

    // services 라이브러리 포함
    // - 장소 검색 (Places)
    // - geocoder 등
    //
    // autoload=false:
    // script 로드 후 직접 kakao.maps.load() 호출
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_API_KEY
      }&libraries=services&autoload=false`;

    // 비동기 로딩
    script.async = true;

    // script 로딩 성공
    script.onload = () => {
      // Kakao SDK 초기화 완료 후 resolve
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };

    // script 로딩 실패
    script.onerror = reject;

    // head에 script 삽입 → SDK 로드 시작
    document.head.appendChild(script);
  });
};