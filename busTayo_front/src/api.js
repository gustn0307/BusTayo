import axios from "axios";

// Axios 인스턴스 생성
// 역할:
// 1. 프론트에서 백엔드 API 요청을 공통 처리
// 2. baseURL 통일
// 3. interceptor로 JWT 자동 첨부
//
// 사용 위치:
// - RouteSearchPanel.jsx
// - RouteDetail.jsx
// - 로그인 / 회원 관련 API (추후)
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (window.location.hostname === "hskang.dev" || window.location.hostname === "www.hskang.dev") {
    return "https://api.hskang.dev";
  }

  return "";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// 요청 인터셉터
// 역할:
// 모든 API 요청 전에 accessToken 자동 첨부
//
// 흐름:
// sessionStorage → accessToken 조회
// → 있으면 Authorization Header 추가
api.interceptors.request.use((config) => {
    // 🟢 [보안] localStorage → sessionStorage로 변경
    const token = sessionStorage.getItem("accessToken");

    // 🟢 [도배 방지] 토큰 존재 시 Authorization 헤더 추가
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // 🟢 [보안] 토큰이 없으면 헤더 제거하여 불필요한 요청 방지
        delete config.headers.Authorization;
    }

    return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // 401(인증 실패) 또는 403(권한 없음) 발생 시
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       // 현재 주소가 로그인 페이지가 아닐 때만 리다이렉트 (무한 루프 방지)
//       if (window.location.pathname !== "/login") {
//         alert("인증이 필요하거나 권한이 없습니다.");
//         // 🟢 [데이터 정리] 만료된 토큰 청소
//         sessionStorage.removeItem("accessToken");
//         sessionStorage.removeItem("role");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;