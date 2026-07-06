import { useState, useEffect, useRef } from "react";
import styles from "./Lost.module.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

const PAGE_SIZE = 10;

function Lost() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const hasAlerted = useRef(false);

  const [historyList, setHistoryList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const [showBusModal, setShowBusModal] = useState(false);
  const [busList, setBusList] = useState([]);
  const [busLoading, setBusLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [companyPage, setCompanyPage] = useState(1);
  const [expandedBus, setExpandedBus] = useState(null);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      if (!hasAlerted.current) {
        alert("로그인이 필요한 페이지입니다!");
        hasAlerted.current = true;
        navigate("/login");
      }
      return;
    }
    api
      .get("/api/my-info", {
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
    api
      .get("/api/navigating/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data)
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setHistoryList(sorted);
        setFiltered(sorted);
      });
  };

  const handleSearch = () => {
    const keyword = searchInput.trim();
    const result = historyList.filter(
      (item) => item.start.includes(keyword) || item.end.includes(keyword)
    );
    setFiltered(result);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setFiltered(historyList);
    setPage(1);
  };

  const openBusModal = (item) => {
    setSelectedHistory(item);
    setBusList([]);
    setExpandedBus(null);
    setShowBusModal(true);
    setBusLoading(true);
    setCompanyPage(1);

    const token = sessionStorage.getItem("accessToken");
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

  const totalCompanyPages = Math.max(1, Math.ceil(busList.length / PAGE_SIZE));
  const pagedBusList = busList.slice(
    (companyPage - 1) * PAGE_SIZE,
    companyPage * PAGE_SIZE
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>분실물 찾기</h2>
      </div>

      {/* 검색 카드 */}
      <div className={styles.searchCard}>
        <div className={styles.searchRow}>
          <label>출발지 / 도착지</label>
          <input
            type="text"
            placeholder="출발지 또는 도착지 입력"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className={styles.searchBtnBox}>
          <button className={styles.resetBtn} onClick={handleReset}>
            초기화
          </button>
          <button className={styles.searchBtn} onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className={styles.tableCard}>
        <div className={styles.tableTop}>
          <span className={styles.tableTopTitle}>이용 내역</span>
          <span className={styles.totalPill}>총 {filtered.length}건</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>출발지 → 도착지</th>
              <th style={{ width: "150px" }}>조회</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan="2" className={styles.empty}>
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
                      className={styles.queryBtn}
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
        <div className={styles.pagination}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))}>{"<"}</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? styles.active : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>{">"}</button>
        </div>
      </div>

      {/* 버스 목록 모달 */}
      {showBusModal && (
        <div className={styles.modalBackdrop} onClick={closeBusModal}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>
                {selectedHistory?.start} → {selectedHistory?.end}
              </span>
              <button className={styles.modalClose} onClick={closeBusModal}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {busLoading ? (
                <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                  버스 정보를 불러오는 중...
                </p>
              ) : busList.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                  경기 버스 정보가 없습니다.
                </p>
              ) : (
                pagedBusList.map((bus, idx) => (
                  <div key={idx}>
                    <div
                      className={styles.busRow}
                      onClick={() =>
                        setExpandedBus(expandedBus === idx ? null : idx)
                      }
                    >
                      <span className={styles.busNo}>{bus.busNo}번</span>
                      <span className={styles.expandIcon}>
                        {expandedBus === idx ? "▲" : "▼"}
                      </span>
                    </div>
                    {expandedBus === idx && (
                      <div className={styles.busDetail}>
                        <div className={styles.busDetailRow}>
                          <span className={styles.busDetailLabel}>회사명</span>
                          <span className={styles.busDetailValue}>
                            {bus.busCompanyName ?? "정보 없음"}
                          </span>
                        </div>
                        <div className={styles.busDetailRow}>
                          <span className={styles.busDetailLabel}>전화번호</span>
                          <span className={styles.busDetailValue}>
                            {bus.phone ?? "정보 없음"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.resetBtn} onClick={closeBusModal}>
                닫기
              </button>
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCompanyPage((p) => Math.max(1, p - 1))}>{"<"}</button>
              {Array.from({ length: totalCompanyPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={companyPage === i + 1 ? styles.active : ""}
                  onClick={() => setCompanyPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCompanyPage((p) => Math.min(totalCompanyPages, p + 1))}>
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
