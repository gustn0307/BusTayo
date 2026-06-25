import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email) {
      alert("이메일을 입력해 주세요!");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력해 주세요!");
      return;
    }

    axios
      .post("http://localhost:8080/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("로그인 성공 반응 전체 데이터: ", response);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole = payload.role; 

        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "");
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole = payload.role;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("role", userRole);

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
      <h2>BUS TAYO 로그인</h2>

      <div className="input-group" style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          이메일 주소
        </label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email} // email 상자와 연결
          onChange={(e) => setEmail(e.target.value)} // 키보드 칠 때마다 상자에 저장
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div className="input-group" style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          비밀번호
        </label>
        <input
          type="password" // 글자가 *로 가려지도록 password 타입 지정!
          placeholder="비밀번호를 입력하세요"
          value={password} // 상자와 연결
          onChange={(e) => setPassword(e.target.value)} // 키보드 칠 때마다 상자에 저장
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <Button
        variant="primary"
        style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
        onClick={handleLogin}
      >
        로그인 하기
      </Button>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
        }}
      >
        아직 회원이 아니신가요?{" "}
        <Link
          to="/join"
          style={{
            color: "#0d6efd",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          회원가입 하러가기
        </Link>
      </div>

      <p style={{ color: "gray" }}>입력 중인 이메일: {email}</p>
    </div>
  );
}

export default Login;
