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
const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials:true,
    // 백엔드 서버 기본 주소
    // 개발 환경: Spring Boot localhost:8080
    //
    // 추후 배포 시 변경 필요:
    // 예)
    // https://api.bustayo.com
});

// 요청 인터셉터
// 역할:
// 모든 API 요청 전에 accessToken 자동 첨부
//
// 흐름:
// localStorage → accessToken 조회
// → 있으면 Authorization Header 추가
api.interceptors.request.use((config) => {
    // localStorage에 저장된 JWT access token 조회
    const token = localStorage.getItem("accessToken");

    // 토큰 존재 시 Authorization 헤더 추가
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401(인증 실패) 또는 403(권한 없음) 발생 시
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 현재 주소가 로그인 페이지가 아닐 때만 리다이렉트 (무한 루프 방지)
      if (window.location.pathname !== "/login") {
        alert("인증이 필요하거나 권한이 없습니다.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;