import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials:true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
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