import { useState, useEffect } from "react";
import api from '../api';
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"; // 💡 useLocation 추가
import { useAuth } from "./AuthProvider"; // 💡 바로 로그인이 되도록 사용

function Join() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuth(); // 가입 성공 시 즉시 자동 로그인을 위한 툴

  // 💡 [구글 유저 확인 인지 장치] 콜백 페이지에서 state로 넘겨준 정보가 있는지 확인합니다.
  const googleEmail = location.state?.email || "";
  const googleTempToken = location.state?.tempToken || "";
  const isGoogleUser = !!googleEmail; // 구글 이메일이 존재하면 true가 됩니다.

  // State 상태 초기화
  const [email, setEmail] = useState(googleEmail); // 구글 유저라면 이메일이 자동 세팅됩니다.
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  
  // 💡 구글 유저라면 중복 확인 및 인증을 이미 완료한 것(true)으로 초기 상태를 지정합니다.
  const [isEmailChecked, setIsEmailChecked] = useState(isGoogleUser);
  const [isVerified, setIsVerified] = useState(isGoogleUser);

  const [authCode, setAuthCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 만약 뒤로가기 등으로 페이지 정보가 변경될 때 구글 이메일 동기화 보정
  useEffect(() => {
    if (googleEmail) {
      setEmail(googleEmail);
      setIsEmailChecked(true);
      setIsVerified(true);
    }
  }, [googleEmail]);

  // 이메일 인증번호 발송 (일반 유저용)
  const sendAuthCode = async () => {
    try {
      await api.post("/api/auth/email/send", { email });
      alert("인증번호가 발송되었습니다.");
      setIsEmailSent(true);
    } catch (e) {
      alert("인증번호 발송 실패");
    }
  };

  // 인증번호 검증 (일반 유저용)
  const verifyAuthCode = async () => {
    try {
      await api.post("/api/auth/email/verify", { email, authCode });
      alert("인증 완료!");
      setIsVerified(true);
    } catch (e) {
      alert("인증번호가 일치하지 않거나 만료되었습니다.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. 공통 필수 조건 검증: 약관 동의
    if (!isAgreed) {
      alert("이용약관 및 개인정보 처리방침에 동의하셔야 합니다!");
      return;
    }

    // 💡 [분기점] 구글 유저로 진행하는 경우
    if (isGoogleUser) {
      api
        .post("/api/join", {
          email: email,
          password: "GOOGLE_OAUTH_USER", // 백엔드 엔티티의 빈 값 방지용 임시 문자열 지정
        })
        .then((response) => {
          console.log("구글 가입 성공 응답: ", response.data);
          alert("구글 계정으로 회원가입 및 로그인이 완료되었습니다!");

          // 💡 [요구사항 3번 반영] 가입 완료 즉시 발급받았던 진짜 토큰을 넣어주어 바로 로그인 시킵니다.
          sessionStorage.setItem("accessToken", googleTempToken);
          sessionStorage.setItem("role", "ROLE_USER");
          setToken(googleTempToken);

          navigate("/home", { replace: true });
        })
        .catch((error) => {
          console.error("구글 회원가입 에러: ", error);
          alert("회원가입 처리 중 오류가 발생했습니다.");
        });

    } else {
      // 💡 일반 이메일 유저로 진행하는 경우 (기존 팀원님 코드 완벽 유지)
      if (!email) { alert("이메일을 입력해 주세요!"); return; }
      if (!isVerified) { alert("이메일 인증을 먼저 완료해 주세요!"); return; }
      if (!emailRegex.test(email)) { alert("올바른 이메일 형식을 입력해 주세요!"); return; }
      if (!isEmailChecked) { alert("이메일 중복 확인을 해주세요!"); return; }
      if (!password && !confirmPassword) { alert("비밀번호를 입력하세요!"); return; }
      if (password !== confirmPassword) { alert("비밀번호가 일치하지 않습니다!"); return; }

      api
        .post("/api/join", {
          email: email,
          password: password,
        })
        .then((response) => {
          alert("회원가입이 성공적으로 완료되었습니다!");
          navigate("/login");
        })
        .catch((error) => {
          alert("서버 통신 중 에러가 발생했습니다.");
        });
    }
  };

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      <h2> {isGoogleUser ? "구글 간단 회원가입" : "BUS TAYO 회원가입"} </h2>
      
      {isGoogleUser && (
        <div style={{ color: "blue", marginBottom: "15px", fontWeight: "bold" }}>
          💙 구글 인증이 완료되었습니다. 약관 동의 후 가입을 완료해 주세요!
        </div>
      )}

      <form onSubmit={handleRegister}>
        {/* 1. 이메일 입력창 구역 */}
        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>이메일 주소</label>
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              disabled={isGoogleUser} // 💡 구글 유저면 이메일 수정 불가 처리
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailChecked(false);
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: isGoogleUser ? "#eee" : "#fff", // 구글 유저면 잠긴 표시
              }}
            />
            {/* 일반 유저일 때만 중복확인 버튼 표시 */}
            {!isGoogleUser && (
              <Button
                type="button"
                variant="outline-primary"
                style={{ fontWeight: "bold" }}
                onClick={async () => {
                  if (!email) { alert("이메일을 입력해 주세요!"); return; }
                  try {
                    const response = await api.get(`/api/auth/check-email?email=${email}`);
                    if (response.data === true) {
                      alert("이미 사용중인 이메일 입니다.");
                      setIsEmailChecked(false);
                    } else {
                      alert("사용 가능한 이메일 입니다.");
                      setIsEmailChecked(true);
                    }
                  } catch (error) {
                    alert("서버 통신 중 오류가 발생했습니다.");
                  }
                }}
              >
                중복 확인
              </Button>
            )}
          </div>
        </div>

        {/* 일반 유저에게만 인증번호 발송 및 입력창 제어창 노출 */}
        {!isGoogleUser && isEmailChecked && !isVerified && (
          <div style={{ marginTop: "10px" }}>
            <Button type="button" variant="success" onClick={sendAuthCode}>
              인증번호 발송
            </Button>
          </div>
        )}

        {!isGoogleUser && isEmailSent && !isVerified && (
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="인증번호 6자리"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <Button type="button" onClick={verifyAuthCode}>
              인증 확인
            </Button>
          </div>
        )}

        {/* 💡 [핵심] 일반 가입 유저일 때만 비밀번호 창을 보여줍니다. (구글 유저는 숨김) */}
        {!isGoogleUser && (
          <>
            <div className="input-group" style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div className="password-match-status" style={{ marginTop: "5px", fontSize: "13px" }}>
              {password && confirmPassword && (
                password === confirmPassword ? (
                  <span style={{ color: "green" }}>🟢 비밀번호가 일치합니다</span>
                ) : (
                  <span style={{ color: "red" }}>🔴 비밀번호가 일치하지 않습니다</span>
                )
              )}
            </div>
          </>
        )}

        {/* 이용약관 영역 및 동의 체크박스는 공통이므로 그대로 유지 */}
        <div style={{ marginBottom: "10px", marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>이용약관</label>
          <textarea
            readOnly
            value="[버스타요 서비스 이용약관 및 개인정보 처리방침]

1. 개인정보 수집 및 이용 목적
본 서비스는 회원 관리, 즐겨찾기(노선/정류장) 설정 저장, 그리고 내 주변 편의시설 조회 등 원활한 버스 정보 서비스 제공을 위해서만 수집된 정보를 활용합니다.

2. 수집하는 개인정보 항목
- 필수 항목: 이메일 주소 (소셜 가입 시 구글 이메일)
          : 비밀 번호

3. 개인정보의 보유 및 이용 기간
사용자의 개인정보는 서비스 이용 기간 동안 안전하게 보관되며, 사용자가 회원 탈퇴를 요청할 경우 즉시 지체 없이 파기합니다."
            style={{ width: "100%", height: "120px", padding: "12px", fontSize: "14px", lineHeight: "1.5", color: "#333", backgroundColor: "#f9f9f9", border: "1px solid #ccc", borderRadius: "4px", resize: "none" }}
          />
        </div>

        <div className="input-group" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", marginTop: "15px", marginBottom: "20px" }}>
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label htmlFor="terms-checkbox" style={{ fontSize: "14px", cursor: "pointer", marginBottom: 0 }}>
            이용약관 및 개인정보 처리방침에 동의합니다 (필수)
          </label>
        </div>

        {/* 최종 회원가입 버튼 */}
        <Button
          type="submit"
          variant="primary"
          style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
        >
          {isGoogleUser ? "구글로 가입 완료하기" : "회원가입 하기"}
        </Button>

        {/* 일반 가입 상태일 때만 소셜 가입 링크 유도 버튼 노출 */}
        {/* {!isGoogleUser && (
          <>
            <div style={{ display: "flex", alignItems: "center", margin: "25px 0 15px 0" }}>
              <hr style={{ flex: 1, margin: "0 10px", border: "1px solid #eee" }} />
              <span style={{ color: "#999", fontSize: "14px" }}>또는 소셜 계정으로</span>
              <hr style={{ flex: 1, margin: "0 10px", border: "1px solid #eee" }} />
            </div>

            <Button
              type="button"
              variant="outline-danger"
              style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
              onClick={() => {
                window.location.href = "http://localhost:8080/api/oauth2/authorization/google";
              }}
            >
              Google 계정으로 가입하기
            </Button>
          </>
        )} */}
      </form>
    </div>
  );
}
export default Join;