import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function AuthCallback() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const isProcessed = useRef(false); // 💡 중복 실행 방지 플래그

  useEffect(() => {
    if (isProcessed.current) return; // 이미 실행되었다면 패스
    isProcessed.current = true;

    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('Authorization='));

    if (authCookie) {
      const token = authCookie.split('=')[1];

      try {
        const base64Payload = token.split('.')[1];
        const jsonPayload = decodeURIComponent(atob(base64Payload).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        const role = payload.role; 

        // 1. 쿠키 삭제 (가장 먼저 실행)
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // 2. 상태 저장 및 이동
        if (role === "ROLE_GUEST" || role === "GUEST") {
          console.log("신규 구글 유저 감지 -> 회원가입 페이지 이동");
          navigate("/join", { state: { tempToken: token, email: payload.email }, replace: true });
        } else {
          console.log("기존 유저 확인 -> 메인 홈 이동");
          sessionStorage.setItem("accessToken", token);
          sessionStorage.setItem("role", role);
          setToken(token);
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error("토큰 검증 중 오류:", error);
        navigate("/login", { replace: true });
      }
    } else {
      // 쿠키가 없다면 이미 처리되었거나 실패한 상황이므로 로그인 페이지로 보냄
      console.warn("인증 쿠키 없음 -> 로그인 페이지로 이동");
      navigate("/login", { replace: true });
    }
  }, [navigate, setToken]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>구글 인증 완료! 페이지를 전환하고 있습니다...</h2>
    </div>
  );
}

export default AuthCallback;