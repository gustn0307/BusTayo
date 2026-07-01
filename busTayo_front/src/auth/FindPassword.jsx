import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FindPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 메일 전송 중 버튼 비활성화 위한 로딩 추가
  const navigate = useNavigate();

  const handleFindPassword = async (e) => {
    e.preventDefault();

    // 버튼 입력 방지 및 로딩 시작
    setLoading(true);

    try {
      //  우리가 만든 스프링 부트 컨트롤러 주소로 실제 이메일 데이터 전송
      const response = await axios.post('http://localhost:8080/api/auth/find-password', {
        email: email
      });

      // 백엔드에서 리턴한 성공 메시지 ("임시 비밀번호가 메일로 발송되었습니다.") 팝업 띄우기
      alert(response.data);
      
      // 메일 발송 성공 후 자동으로 로그인 페이지로 이동
      navigate('/login');

    } catch (error) {
      console.error("메일 발송 실패 오류:", error);
      
      // 백엔드가 던진 에러 메시지가 있다면 그걸 보여주고, 없으면 기본 에러 문구 출력
      const errorMsg = error.response?.data || "메일 발송 중 오류가 발생했습니다. 이메일을 다시 확인해 주세요.";
      alert(errorMsg);
    } finally {
      // 🟢 성공하든 실패하든 로딩 상태 해제 (버튼 다시 활성화)
      setLoading(false); 
    }
  };
    
    
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '50px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>비밀번호 찾기</h2>
      <p style={{ textAlign: 'center', color: 'gray', marginBottom: '30px' }}>
        가입하신 이메일을 입력해 주시면,<br />
        해당 메일로 임시 비밀번호를 발송해 드립니다.
      </p>

      <form onSubmit={handleFindPassword}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="가입한 이메일 입력 (ex: user@bus.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#aaaaaa' : '#007bff', // 로딩 중에는 회색 버튼으로 변경
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "발송 중..." : "임시 비밀번호 발송"}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/login')} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          로그인 화면으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default FindPassword;