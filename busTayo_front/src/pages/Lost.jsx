import { useState, useEffect, useRef } from "react";
import "./Lost.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";

const PAGE_SIZE = 10;

function Lost() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const hasAlerted = useRef(false);

  const [historyList, setHistoryList] = useState([]); // navigating_history 전체
  const [filtered, setFiltered] = useState([]); // 검색 필터 결과
  const [searchInput, setSearchInput] = useState(""); // 출발지/도착지 검색어
  const [page, setPage] = useState(1);

  // 버스 목록 모달
  const [showBusModal, setShowBusModal] = useState(false);
  const [busList, setBusList] = useState([]);
  const [busLoading, setBusLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [companyPage, setCompanyPage] = useState(1);

  // 전화번호 모달
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  // 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      if (!hasAlerted.current) {
        alert("로그인이 필요한 페이지입니다!");
        hasAlerted.current = true;
        navigate("/login");
      }
      return;
    }

    axios
      .get("http://localhost:8080/my-info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let pureEmail = response.data
          .replace("로그인한 사용자의 이메일은: ", "")
          .replace("입니다.", "")
          .trim();
        setUserEmail(pureEmail);
      })
      .catch(() => {
        alert("인증이 만료되었거나 에러가 발생했습니다. 다시 로그인해 주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        navigate("/login");
      });
  }, [navigate]);

  // navigating_history 조회
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    const token = localStorage.getItem("accessToken");
    api
      .get("/api/navigating/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data)
      .then((data) => {
        // created_at 기준 최신순 정렬
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setHistoryList(sorted);
        setFiltered(sorted);
      });
  };

  // 출발지/도착지 검색
  const handleSearch = () => {
    const keyword = searchInput.trim();
    const result = historyList.filter(
      (item) => item.start.includes(keyword) || item.end.includes(keyword),
    );
    setFiltered(result);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setFiltered(historyList);
    setPage(1);
  };

  const [expandedBus, setExpandedBus] = useState(null);

  // 경로 클릭 → 버스 목록 조회
  const openBusModal = (item) => {
    setSelectedHistory(item);
    setBusList([]);
    setExpandedBus(null);
    setShowBusModal(true);
    setBusLoading(true);
    setCompanyPage(1);

    const token = localStorage.getItem("accessToken");
    api
      .get(`/api/lost/buses?historyId=${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data)
      .then((data) => {
        setBusList(data);
        setBusLoading(false);
      })
      .catch(() => {
        alert("버스 정보를 불러오지 못했습니다.");
        setBusLoading(false);
      });
  };

  const closeBusModal = () => {
    setShowBusModal(false);
    setSelectedHistory(null);
    setBusList([]);
  };

  // 버스 클릭 → 전화번호 모달
  const openPhoneModal = (bus) => {
    setSelectedBus(bus);
    setShowPhoneModal(true);
  };

  const closePhoneModal = () => {
    setShowPhoneModal(false);
    setSelectedBus(null);
  };
  
  const totalCompanyPages = Math.max(1, Math.ceil(busList.length / PAGE_SIZE))
  const pagedBusList = busList.slice((companyPage - 1) * PAGE_SIZE, companyPage * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>분실물 찾기</h2>
      </div>

      <div className="search-card">
        <div className="search-row">
          <label>출발지 / 도착지</label>
          <input
            type="text"
            placeholder="출발지 또는 도착지 입력"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="search-btn-box">
          <button className="reset-btn" onClick={handleReset}>
            초기화
          </button>
          <button className="search-btn" onClick={handleSearch}>
            검색
          </button>
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
              <th>출발지 → 도착지</th>
              <th>조회</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan="2" className="empty">
                  등록된 이용내역이 없습니다.
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.start} → {item.end}
                  </td>
                  <td>
                    <button
                      className="search-btn"
                      onClick={() => openBusModal(item)}
                    >
                      버스 회사 조회
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            {">"}
          </button>
        </div>
      </div>

      {/* 버스 목록 모달 */}
      {/* 버스 목록 모달 */}
      {showBusModal && (
        <div className="lost-modal-backdrop" onClick={closeBusModal}>
          <div className="lost-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="lost-modal-header">
              <span className="lost-modal-title">
                {selectedHistory?.start} → {selectedHistory?.end}
              </span>
              <button className="lost-modal-close" onClick={closeBusModal}>
                ✕
              </button>
            </div>
            <div className="lost-modal-body">
              {busLoading ? (
                <p>버스 정보를 불러오는 중...</p>
              ) : busList.length === 0 ? (
                <p>경기 버스 정보가 없습니다.</p>
              ) : (
                pagedBusList.map((bus, idx) => (
                  <div key={idx}>
                    {/* 버스 행 */}
                    <div
                      className="lost-modal-row"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setExpandedBus(expandedBus === idx ? null : idx)
                      }
                    >
                      <span>{bus.busNo}번</span>
                      <span style={{ color: "#3B5BDB" }}>
                        {expandedBus === idx ? "▲" : "▶"}
                      </span>
                    </div>

                    {/* 펼쳐지는 상세 정보 */}
                    {expandedBus === idx && (
                      <div
                        style={{
                          padding: "8px 16px",
                          background: "#f8f9fa",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          fontSize: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ color: "#868e96" }}>회사명</span>
                          <span>{bus.busCompanyName ?? "정보 없음"}</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ color: "#868e96" }}>전화번호</span>
                          <span>{bus.phone ?? "정보 없음"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="lost-modal-footer">
              <button className="reset-btn" onClick={closeBusModal}>
                닫기
              </button>
            </div>
            <div className="pagination">
              <button onClick={() => setCompanyPage((p) => Math.max(1, p - 1))}>
                {"<"}
              </button>
              {Array.from({ length: totalCompanyPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={companyPage === i + 1 ? "active" : ""}
                  onClick={() => setCompanyPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCompanyPage((p) => Math.min(totalCompanyPages, p + 1))}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lost;
