import { useState, useEffect, useRef } from "react";
import "./BusHistory.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

const PAGE_SIZE = 10;

function BusHistory() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const hasAlerted = useRef(false);
  const [lostList, setLostList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [busNameInput, setBusNameInput] = useState("");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      if (!hasAlerted.current){
      alert("로그인이 필요한 페이지입니다!");
      hasAlerted.current = true;
      navigate("/login");
      }
      return;
    }

    axios.get("http://localhost:8080/api/my-info", {
      headers: {
        Authorization: `Bearer ${token}` // 백엔드 시큐리티가 검증할 JWT 토큰 규격
      }
    })
    .then((response) => {
      // console.log("백엔드 이메일 조회 응답 결과: ", response.data);
      
        let pureEmail = response.data.replace("로그인한 사용자의 이메일은: ", "").replace("입니다.", "").trim();
      
      setUserEmail(pureEmail);
    })
    .catch((error) => {
      // console.error("유저 정보 로드 실패: ", error);
      alert("인증이 만료되었거나 에러가 발생했습니다. 다시 로그인해 주세요.");

      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("role");
      navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
  const token = sessionStorage.getItem("accessToken");
  api.get("/lost/my", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.data)
    .then(data => {
      const sorted = [...data].sort((a, b) =>
        new Date(b.boardingTime) - new Date(a.boardingTime)
      );
      setLostList(sorted);
      setFiltered(sorted);
    });
  };

  const handleSearch = () => {
    const result = lostList.filter(n => n.busName.includes(busNameInput));
    setFiltered(result);
    setPage(1);
  };

  const handleReset = () => {
    setBusNameInput("");
    setFiltered(lostList);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-container">

      <div className="page-header">
        <h2>이용 내역</h2>
      </div>

      <div className="search-card">
        <div className="search-row">
          <label>버스 번호</label>
          <input
            type="text"
            placeholder="버스 번호 입력"
            value={busNameInput}
            onChange={e => setBusNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="search-btn-box">
          <button className="reset-btn" onClick={handleReset}>초기화</button>
          <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-top">
          <span>이용 내역</span>
          <span className="total-pill">총 {filtered.length}건</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>버스 번호</th>
              <th>이용 시간 (승하차)</th>
              <th>출발, 도착지</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty">등록된 이용내역이 없습니다.</td>
              </tr>
            ) : (
              paged.map(item => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ color: "#1d4ed8" }}>{item.busName}</td>
                  <td>{formatDateTime(item.boardingTime)} ~ {formatDateTime(item.alightingTime)}</td>
                  <td>{item.start} → {item.end}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))}>{"<"}</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{">"}</button>
        </div>
      </div>
    </div>
  );
}

export default BusHistory;