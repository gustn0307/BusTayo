import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (location.state?.needLogin) {
  //     alert("로그인이 필요한 페이지입니다.");

  //     // state를 비워 새로고침하거나 다시 렌더링되어도 alert가 또 뜨지 않도록 처리
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, [location, navigate]);

  const handleLogin = () => {
    if(!email){
      alert("이메일을 입력해 주세요!");
      return;
    }
    if(!password){
      alert("비밀번호를 입력해 주세요!")
      return;
    }

    axios.post("http://localhost:8080/api/login", {
      email: email,
      password: password
    })
    .then((response) => {
      console.log("로그인 성공 반응 전체 데이터: ", response);

      const authHeader = response.headers['authorization'];
      let token = authHeader;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole = payload.role;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", userRole);

      alert("로그인이 성공적으로 완료되었습니다!");

      navigate("/home");
      window.location.reload();
    })
    .catch((error) => {
      console.error("로그인 에러: ", error);
      alert("이메일 또는 비밀번호를 확인해 주세요");
    });
  };

  return (
    <div className="app-container" style={{ padding: "20px" }}>

       {location.state?.needLogin && (
    <div
      style={{
        backgroundColor: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      ⚠ 로그인이 필요한 페이지입니다.
    </div>
  )}

      <h2>BUS TAYO 로그인</h2>

      <div className="input-group" style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>이메일 주소</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email} // email 상자와 연결
          onChange={(e) => setEmail(e.target.value)} // 키보드 칠 때마다 상자에 저장
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <div className="input-group" style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>비밀번호</label>
        <input
          type="password" // 글자가 *로 가려지도록 password 타입 지정!
          placeholder="비밀번호를 입력하세요"
          value={password} // 상자와 연결
          onChange={(e) => setPassword(e.target.value)} // 키보드 칠 때마다 상자에 저장
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <Button
        variant="primary"
        style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
        onClick={handleLogin}
      >
        로그인 하기
      </Button>

      {/* 구글 로그인 버튼 구역 */}
      {/* <div style={{ display: "flex", alignItems: "center", margin: "25px 0 15px 0" }}>
        <hr style={{ flex: 1, margin: "0 10px", border: "1px solid #eee" }} />
        <span style={{ color: "#999", fontSize: "14px" }}>또는 소셜 계정으로</span>
        <hr style={{ flex: 1, margin: "0 10px", border: "1px solid #eee" }} />
      </div>

      <Button
        variant="outline-danger"
        style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
        onClick={() => {
          // axios가 아니라, 아예 브라우저를 구글 로그인 창으로 이동
          window.location.href = "http://localhost:8080/api/oauth2/authorization/google";
        }}
      >
        Google로 시작하기
      </Button> */}

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" }}>
        아직 회원이 아니신가요?{" "}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px', fontSize: '14px' }}>
          <Link to="/join" style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "bold" }}>
            회원가입
          </Link>
          <span style={{ color: '#ccc' }}>|</span>
          <Link to="/find-password" style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "bold" }}>
            비밀번호 찾기
          </Link>
        </div>
      </div>

      {/* <p style={{ color: "gray" }}>입력 중인 이메일: {email}</p> */}
    </div>
  );
}

export default Login;