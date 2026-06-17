import { useState } from "react";

function Join() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  
  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword){
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    alert("비밀번호 일치 확인! 회원가입 데이터 전송 준비 완료.")
  }
  
  return (
    <div className="app-container">
      <h2> Bus Tayo 회원가입 </h2>

      <form>
        {/* email 입력창 감싸는 상자 */}
        <div className="input-group">
          <label>이메일 주소</label>

          <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>

          {/* 입력값이 잘 보관되는지 테스트하는 글자 */}
          <p style={{marginTop: '10px', color: 'gray'}}>
            현재 보관함에 저장중인 값: <strong>{email}</strong>
          </p>

          <div className="input-group">
            <label>비밀번호</label>
            <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>비밀번호 확인</label>
            <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="password-match-status" style={{ marginTop: '5px', fontSize: '13px' }}>
            {password && confirmPassword && (
              password === confirmPassword ? (
                <span style={{color: 'green'}}>🟢 비밀번호가 일치합니다</span>
              ) : (
                <span style={{color: 'red'}}>🔴 비밀번호가 일치하지 않습니다</span>
              )
            )}
          </div>

          <div className="input-group" style={{flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '15px'}}>

          </div>
        
        <button type="submit" className="register-submit-btn" style={{marginTop: '20px', width: '100%', padding: '10px'}}>
          회원가입 하기
        </button>
      </form>
    </div>
  )
}
export default Join;