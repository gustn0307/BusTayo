import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 💡 세션 스토리지 기반으로 토큰 상태 초기화
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));

  // 💡 JWT 토큰 만료 여부 체크 함수 (디버깅 로그 포함)
  const isTokenExpired = (targetToken) => {
    if (!targetToken) return true;
    try {
      const base64Payload = targetToken.split('.')[1];
      const jsonPayload = decodeURIComponent(atob(base64Payload).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      if (!payload.exp) return false;
      
      const currentTime = Math.floor(Date.now() / 1000);
      
      // console.log("==========================================");
      // console.log("⏰ 현재 브라우저 시간 (초):", currentTime);
      // console.log("⏳ 토큰에 기록된 만료 시간 (exp):", payload.exp);
      // console.log("📊 남은 수명 (초):", payload.exp - currentTime);
      // console.log("==========================================");
      
      return payload.exp < currentTime;
    } catch (e) {
      console.error("토큰 만료 시간 해독 실패:", e);
      return true;
    }
  };

  // 💡 [수정] 만료되어서 나가는 건지 인자값을 받도록 보강합니다.
  const logout = (isExpired = false) => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; subdomains=true;";
    
    setToken(null);

    // 💡 [핵심 UX 분기] 상황에 맞는 친절한 메시지 출력
    if (isExpired) {
      alert("로그인 세션이 만료되어 자동으로 로그아웃 되었습니다.");
    } else {
      alert("로그아웃이 성공적으로 완료되었습니다.");
    }

    window.location.href = "/login";
  };

  // 💡 [수정] 주기적 타이머 감시 장치 내부
  useEffect(() => {
    const timer = setInterval(() => {
      const currentToken = sessionStorage.getItem("token");
      
      if (currentToken) {
        if (isTokenExpired(currentToken)) {
          console.warn("🚨 실시간 타이머가 만료된 토큰 포착 -> 자동 로그아웃 처리");
          clearInterval(timer);
          logout(true); // 👈 여기에 true를 넣어서 세션 만료 팝업이 뜨게 만듭니다!
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 💡 백엔드가 구워준 쿠키 동기화 로직 (GUEST 필터링 보강)
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('Authorization='));
    
    if (authCookie && !token) {
      const newToken = authCookie.split('=')[1];
      try {
        const base64Payload = newToken.split('.')[1];
        const jsonPayload = decodeURIComponent(atob(base64Payload).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        if (payload.role === "ROLE_GUEST" || payload.role === "GUEST") return;

        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("role", payload.role);
        setToken(newToken);
      } catch (e) {
        console.error("쿠키 토큰 동기화 실패:", e);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);