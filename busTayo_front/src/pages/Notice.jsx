import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styles from "./Notice.module.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(".", ".");
}

function isUpdated(createdAt, updatedAt) {
  return (
    updatedAt &&
    new Date(updatedAt).getTime() !== new Date(createdAt).getTime()
  );
}

const PAGE_SIZE = 10;

function Notice() {
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    api
      .get("/api/notice")
      .then((r) => r.data)
      .then((data) => {
        const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
        setNoticeList(sorted);
        setFiltered(sorted);
      });
  };

  const handleSearch = () => {
    const result = noticeList.filter((n) =>
      n.noticeTitle.includes(titleInput)
    );
    setFiltered(result);
    setPage(1);
  };

  const handleReset = () => {
    setTitleInput("");
    setFiltered(noticeList);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.container}>

      {/* 브레드크럼 */}
      <div className={styles.breadcrumb}>
        <i className="ti ti-home" aria-hidden="true"></i>
        <span className={styles.link} onClick={() => navigate("/home")}>홈</span>
        <span className={styles.sep}>›</span>
        <span className={styles.current}>공지사항</span>
      </div>

      {/* 검색 카드 */}
      <div className={styles.searchCard}>
        <div className={styles.searchRow}>
          <label>제목</label>
          <input
            type="text"
            placeholder="공지사항 제목 입력"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className={styles.searchBtnBox}>
          <button className={styles.resetBtn} onClick={handleReset}>
            <i className="ti ti-refresh" aria-hidden="true"></i>
            초기화
          </button>
          <button className={styles.searchBtn} onClick={handleSearch}>
            <i className="ti ti-search" aria-hidden="true"></i>
            검색
          </button>
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className={styles.tableCard}>
        <div className={styles.tableTop}>
          <span className={styles.tableTopTitle}>공지 목록</span>
          <span className={styles.totalPill}>총 {filtered.length}건</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td className={styles.empty} colSpan={2}>
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              paged.map((notice) => (
                <tr key={notice.noticeId}>
                  <td>
                    <div
                      className={styles.titleCell}
                      onClick={() => navigate(`/notice/${notice.noticeId}`)}
                    >
                      <span className={styles.noticeBadge}>공지</span>
                      <span className={styles.titleText}>
                        {notice.noticeTitle}
                      </span>
                      {isUpdated(notice.createdAt, notice.updatedAt) && (
                        <span className={styles.updatedTag}>(수정됨)</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(notice.createdAt)}</td>
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

    </div>
  );
}

export default Notice;
