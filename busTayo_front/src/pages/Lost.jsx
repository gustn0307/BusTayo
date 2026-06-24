import { useState, useEffect } from "react";
import "./Lost.css";
import api from "../api";

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

const PAGE_SIZE = 10;

function Lost() {
  const [lostList, setLostList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [busNameInput, setBusNameInput] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    api.get("/lost")
      .then(r => r.data)
      .then(data => {
        const sorted = [...data].reverse();
        setLostList(sorted);
        setFiltered(sorted);
      });
  };

  const openDetail = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
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
        <h2>분실물 찾기</h2>
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
              <th>차량 번호</th>
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
                  onClick={() => openDetail(item)}
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

      {showModal && selected && (
        <div className="lost-modal-backdrop" onClick={closeModal}>
          <div className="lost-modal-box" onClick={e => e.stopPropagation()}>
            <div className="lost-modal-header">
              <span className="lost-modal-title">버스 회사 연락처</span>
              <button className="lost-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="lost-modal-body">
              <div className="lost-modal-row">
                <label>회사명</label>
                <span>{selected.companyName}</span>
              </div>
              <div className="lost-modal-row">
                <label>전화번호</label>
                <span>{selected.companyPhone}</span>
              </div>
            </div>
            <div className="lost-modal-footer">
              <button className="reset-btn" onClick={closeModal}>닫기</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Lost;