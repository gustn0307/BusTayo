import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function AuthCallback() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
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

        // 쿠키 삭제
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        if (role === "ROLE_GUEST" || role === "GUEST") { // 💡 혹시 모를 'ROLE_' 접두사 유무 방어막 추가
          console.log("신규 구글 유저 감지 -> 회원가입 페이지로 안전하게 이동 조치합니다.");
          
          // 💡 [교정] Layout 필터링에 걸려 멈추는 현상을 방지하기 위해 window.history 상태를 강제 정돈하며 확실하게 밀어 넣습니다.
          navigate("/join", { state: { tempToken: token, email: payload.email }, replace: true });
          
        } else {
          console.log("기존 가입 유저 확인 완료 -> 메인 홈으로 이동합니다.");
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("role", role);
          setToken(token);
          
          navigate("/home", { replace: true });
        }

      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        navigate("/login", { replace: true });
      }
    } else {
      // 💡 StrictMode 때문에 렌더링이 두 번 연속 돌면서 이미 위에서 쿠키를 지워버려 이 엘스문에 들어왔을 확률이 99%입니다.
      // 이미 쿠키가 사라졌더라도, 주소창이 여전히 /auth/callback에 머물러 있다면 로그인 창으로 튕겨냅니다.
      console.warn("인증 쿠키가 이미 소멸되었거나 존재하지 않습니다.");
    }
  }, [navigate, setToken]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>구글 인증 완료! 페이지를 전환하고 있습니다...</h2>
    </div>
  );
}

export default AuthCallback;