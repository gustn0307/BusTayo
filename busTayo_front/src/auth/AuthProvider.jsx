import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 💡 세션 스토리지 기반으로 토큰 상태 초기화
  const [token, setToken] = useState(() => sessionStorage.getItem("accessToken"));

  // 💡 JWT 토큰 만료 여부 체크 함수
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
      return payload.exp < currentTime;
    } catch (e) {
      console.error("토큰 만료 시간 해독 실패:", e);
      return true;
    }
  };

  const logout = (isExpired = false) => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("role");
    
    // 쿠키는 여기서 일괄 삭제
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; subdomains=true;";
    
    setToken(null);

    if (isExpired) {
      alert("로그아웃 되었습니다.");
    } else {
      alert("로그아웃이 성공적으로 완료되었습니다.");
    }

    window.location.href = "/login";
  };

  // 💡 주기적 타이머 감시 장치 (토큰 만료 체크)
  useEffect(() => {
    const timer = setInterval(() => {
      const currentToken = sessionStorage.getItem("accessToken");
      
      if (currentToken) {
        if (isTokenExpired(currentToken)) {
          console.warn("🚨 실시간 타이머가 만료된 토큰 포착 -> 자동 로그아웃 처리");
          clearInterval(timer);
          logout(true);
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);