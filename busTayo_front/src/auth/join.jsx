import { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Join() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = (e) => {
    e.preventDefault();
    if(!email){
      alert("이메일을 입력해 주세요!");
      return;
    }

    if(!isEmailChecked){
      alert("이메일 중복 확인을 해주세요!")
      return;
    }

    if(!password && !confirmPassword){
      alert("비밀번호를 입력하세요!");
      return;
    }

    if(password && !confirmPassword){
      alert("비밀번호 확인 칸에 비밀번호를 입력해 주세요")
      return;
    }

    if(!password && confirmPassword){
      alert("비밀번호 칸에 비밀번호를 입력해 주세요")
      return;
    }
    
    if (password !== confirmPassword){
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    
    if (!isAgreed) { // isAgreed가 false(체크 안 됨)이라면
      alert("이용약관 및 개인정보 처리방침에 동의하셔야 합니다!");
      return;
    }

    axios.post("http://localhost:8080/join", {
      email: email,
      password: password
    })
    .then((response) => {
      console.log("서버 응답 결과: ", response.data);
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/login");
      
    })
    .catch((error) => {
      console.error("회원가입 에러 발생: ", error);
      alert("서버 통신 중 에러가 발생했습니다.");
    });
  }
  
  return (
    <div className="app-container" style={{ padding: "20px" }}> {/* 패딩 살짝 부여 */}
      <h2> BUS TAYO 회원가입 </h2>

      <form onSubmit={handleRegister}>
        {/* 1. 이메일 입력창 구역 */}
        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>이메일 주소</label>
          <div style={{ display: "flex", gap: "10px", width: "100%" }}> {/* 이메일창과 중복확인 버튼 가로 정렬 */}
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailChecked(false);
              }}
              style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} // 로그인창과 스타일 매칭
            />
<Button 
              type="button" 
              variant="outline-primary" 
              style={{ fontWeight: "bold" }}
              onClick={() => {
                if (!email) {
                  alert("이메일을 입력해 주세요!");
                  return;
                }
                if (email === "test@test.com") {
                  alert("이미 사용중인 이메일 입니다");
                } else {
                  alert("사용 가능한 이메일 입니다");
                  setIsEmailChecked(true);
                }
              }}
            >
              중복 확인
            </Button>
          </div>
        </div>

        {/* 2. 비밀번호 입력창 구역 */}
        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} // 로그인창과 스타일 매칭
          />
        </div>

        {/* 3. 비밀번호 확인 입력창 구역 */}
        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} // 로그인창과 스타일 매칭
          />
        </div>

        {/* 일치/불일치 메시지와 이용약관 텍스트 영역은 그대로 유지 */}
        <div className="password-match-status" style={{ marginTop: '5px', fontSize: '13px' }}>
          {password && confirmPassword && (
            password === confirmPassword ? (
              <span style={{ color: 'green' }}>🟢 비밀번호가 일치합니다</span>
            ) : (
              <span style={{ color: 'red' }}>🔴 비밀번호가 일치하지 않습니다</span>
            )
          )}
        </div>

        <div style={{ marginBottom: '10px', marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>이용약관</label>
          <textarea
            readOnly
            value="[버스타조 서비스 이용약관 및 개인정보 처리방침]

1. 개인정보 수집 및 목적
본 서비스는 사용자의 상업적 이용을 절대 금하며, 오직 아래의 목적을 위해서만 수집된 정보를 활용합니다.
- 서비스 이용에 따른 본인 식별 및 회원 관리
- 자유게시판 서비스 내 게시글 작성 및 작성자 식별

2. 수집하는 개인정보 항목
- 필수 항목: 이메일 주소, 비밀번호

3. 개인정보의 보유 및 이용 기간
수집된 사용자 이메일 및 활동 정보는 본 서비스가 운영되는 기간 동안 안전하게 보관되며, 사용자가 회원 탈퇴를 요청하거나 서비스를 종료할 경우 즉시 지체 없이 파기합니다."
            style={{ 
              width: '100%', 
              height: '120px',       // 글씨가 커지므로 스크롤이 덜 생기도록 높이도 80px에서 120px로 확장
              padding: '12px', 
              fontSize: '14px',      // 기존 12px에서 14px로 글씨 크기 Up
              lineHeight: '1.5',     // 줄간격을 줘서 가독성 Up
              color: '#333',         // 흐릿한 회색 대신 살끔 더 선명한 진회색으로 변경
              backgroundColor: '#f9f9f9', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              resize: 'none' 
            }}
          />
        </div>

        <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '15px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label htmlFor="terms-checkbox" style={{ fontSize: '14px', cursor: 'pointer', marginBottom: 0 }}>
            이용약관 및 개인정보 처리방침에 동의합니다 (필수)
          </label>
        </div>
        
        {/* 4. 최하단 최종 회원가입 버튼 */}
                <Button type="submit" variant="primary" style={{ width: "100%", padding: "10px", fontWeight: "bold" }}>
          회원가입 하기
        </Button>
      </form>
    </div>
  );
}
export default Join;