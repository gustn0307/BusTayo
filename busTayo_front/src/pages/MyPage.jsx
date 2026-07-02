import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyPage() {
  const [userEmail, setUserEmail] = useState(""); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState(""); // 💡 구글/일반 유저 구별을 위한 역할 저장소
  
  const navigate = useNavigate();
  const hasAlerted = useRef(false);

  useEffect(() => {
    // 🟢 [교정] 오직 sessionStorage만 바라보도록 수정합니다.
    const token = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");
    setUserRole(role); // 현재 유저의 권한 저장 (GUEST, USER 등)

    if (!token) {
      if (!hasAlerted.current){
        hasAlerted.current = true;
        navigate("/login");
      }
      return;
    }

    axios.get("http://localhost:8080/api/my-info", {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
    .then((response) => {
      let pureEmail = response.data.replace("로그인한 사용자의 이메일은: ", "").replace("입니다.", "").trim();
      setUserEmail(pureEmail);
    })
    .catch((error) => {
      if(hasAlerted.current) return;
      hasAlerted.current = true;
      alert("인증이 만료되었거나 에러가 발생했습니다. 다시 로그인해 주세요.");

      // 🟢 [교정] 청소할 때도 세션 스토리지를 지웁니다.
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("role");
      navigate("/login");
    });
  }, [navigate]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // 💡 [UX 보안 방어] 구글 로그인 등 비밀번호가 없는 소셜 계정 차단
    if (userEmail.includes("@gmail.com") || userRole === "ROLE_GUEST") {
      alert("소셜 로그인 회원은 비밀번호를 변경할 수 없습니다.");
      return;
    }

    // 🟢 [교정] sessionStorage 사용
    const token = sessionStorage.getItem("accessToken");

    if (!currentPassword) { alert("현재 비밀번호를 입력해 주세요!"); return; }
    if (!newPassword) { alert("새 비밀번호를 입력해 주세요!"); return; }
    if (newPassword !== confirmPassword) { alert("새 비밀번호 확인이 일치하지 않습니다!"); return; }

    axios.put("http://localhost:8080/api/update-password", {
      currentPassword: currentPassword,
      newPassword: newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      alert("비밀번호 변경이 완료되었습니다!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    })
    .catch((error) => {
      alert("현재 비밀번호가 틀렸거나 변경 중 오류가 발생했습니다.");
    });
  };

  const handleWithdraw = () => {
    const isConfirm = window.confirm("정말로 BUS TAYO 서비스를 탈퇴하시겠습니까? 데이터가 모두 삭제됩니다.");
    if (isConfirm) {
      // 🟢 [교정] sessionStorage 사용
      const token = sessionStorage.getItem("accessToken");

      axios.delete("http://localhost:8080/api/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        alert("회원 탈퇴가 정상적으로 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
        
        // 🟢 [교정] 탈퇴 시에도 세션 스토리지 청소
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("role");
        navigate("/login");
      })
      .catch((error) => {
        console.error("회원 탈퇴 실패: ", error);
        alert("회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      });
    }
  };

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      <h2>마이페이지</h2>
      
      {/* 회원 정보 (읽기 전용) */}
      <div className="input-group" style={{ marginBottom: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
        <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold", color: "#555" }}>
          현재 로그인 계정 (이메일)
        </label>
        
        <div style={{ fontSize: "16px", color: "#007bff", fontWeight: "bold", paddingLeft: "5px" }}>
          {userEmail ? userEmail : "유저 정보를 불러오는 중..."}
        </div>
      </div>

      {/* 비밀번호 변경 구역 */}
      <form onSubmit={handleChangePassword} style={{ marginBottom: "30px" }}>
        <h4 style={{ marginBottom: "15px" }}>비밀번호 변경</h4>

        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>현재 비밀번호</label>
          <input
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        
        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>새 비밀번호</label>
          <input
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div className="input-group" style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>새 비밀번호 확인</label>
          <input
            type="password"
            placeholder="새 비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <Button type="submit" variant="primary" style={{ fontWeight: "bold" }}>
          비밀번호 변경하기
        </Button>
      </form>

      {/* 회원 탈퇴 구역 */}
      <div style={{ marginTop: "40px", borderTop: "1px solid #dee2e6", paddingTop: "20px" }}>
        <h4 style={{ color: "#dc3545", marginBottom: "10px" }}>회원 탈퇴</h4>
        <p style={{ fontSize: "14px", color: "#666" }}>탈퇴 시 회원 정보와 설정한 버스 알림 조건이 완전히 안전하게 처리됩니다.</p>
        <Button variant="danger" style={{ fontWeight: "bold" }} onClick={handleWithdraw}>
          회원 탈퇴하기
        </Button>
      </div>
    </div>
  );
}

export default MyPage;