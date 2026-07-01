import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NoticeManagement.module.css"; // CSS Module 임포트
import api from "../../../api";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).replace(/\. /g, ".").replace(".", ".");
}

function isUpdated(createdAt, updatedAt) {
  return updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();
}

const PAGE_SIZE = 10;

function NoticeManagement() {
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ noticeTitle: "", noticeContent: "" });

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    api.get("/api/notice")
      .then(r => r.data)
      .then(data => {
        const sorted = [...data].reverse();
        setNoticeList(sorted);
        setFiltered(sorted);
      });
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ noticeTitle: "", noticeContent: "" });
    setShowModal(true);
  };

  const openEdit = (notice) => {
    setEditTarget(notice);
    setForm({ noticeTitle: notice.noticeTitle, noticeContent: notice.noticeContent });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm({ noticeTitle: "", noticeContent: "" });
  };

  const handleSave = async () => {
    if (!form.noticeTitle.trim() || !form.noticeContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (editTarget) {
      await api.put(`/api/admin/notice/${editTarget.noticeId}`, form);
    } else {
      await api.post(`/api/admin/notice`, form);
    }
    closeModal();
    fetchList();
  };

  const handleSearch = () => {
    const result = noticeList.filter(n => n.noticeTitle.includes(titleInput));
    setFiltered(result);
    setPage(1);
  };

  const handleReset = () => {
    setTitleInput("");
    setFiltered(noticeList);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/api/admin/notice/${id}`);
    const updated = noticeList.filter(n => n.noticeId !== id);
    setNoticeList(updated);
    setFiltered(updated.filter(n => n.noticeTitle.includes(titleInput)));
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.pageContainer}>

      <div className={styles.pageHeader}>
        <h2>공지사항 관리</h2>
        <button className={styles.addBtn} onClick={openAdd}>+ 공지 작성</button>
      </div>

      {/* 검색 카드 */}
      <div className={styles.searchCard}>
        <div className={styles.searchRow}>
          <label>제목</label>
          <input
            type="text"
            placeholder="공지사항 제목 입력"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className={styles.searchBtnBox}>
          <button className={styles.resetBtn} onClick={handleReset}>초기화</button>
          <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className={styles.tableCard}>
        <div className={styles.tableTop}>
          <span>공지 목록</span>
          <span className={styles.totalPill}>총 {filtered.length}건</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.empty}>등록된 공지사항이 없습니다.</td>
              </tr>
            ) : (
              paged.map(notice => (
                <tr key={notice.noticeId}>
                  <td>{notice.noticeId}</td>
                  <td
                    className={styles.titleLink}
                    onClick={() => navigate(`/admin/notices/${notice.noticeId}`)}
                  >
                    {notice.noticeTitle}
                    {isUpdated(notice.createdAt, notice.updatedAt) && (
                      <span className={styles.updatedBadge}>
                        (수정됨)
                      </span>
                    )}
                  </td>
                  <td>{formatDate(notice.createdAt)}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => openEdit(notice)}>수정</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(notice.noticeId)}>삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))}>{"<"}</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? styles.active : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{">"}</button>
        </div>
      </div>

      {/* 모달 영역 */}
      {showModal && (
        <div className={styles.noticeModalBackdrop} onClick={closeModal}>
          <div className={styles.noticeModalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.noticeModalHeader}>
              <span className={styles.noticeModalTitle}>{editTarget ? "공지 수정" : "공지 작성"}</span>
              <button className={styles.noticeModalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.noticeModalBody}>
              <div className={styles.noticeModalRow}>
                <label>제목</label>
                <input
                  type="text"
                  placeholder="공지 제목 입력"
                  value={form.noticeTitle}
                  onChange={e => setForm(p => ({ ...p, noticeTitle: e.target.value }))}
                />
              </div>
              <div className={`${styles.noticeModalRow} ${styles.noticeAlignTop}`}>
                <label>내용</label>
                <textarea
                  rows={6}
                  placeholder="공지 내용 입력"
                  value={form.noticeContent}
                  onChange={e => setForm(p => ({ ...p, noticeContent: e.target.value }))}
                />
              </div>
            </div>
            <div className={styles.noticeModalFooter}>
              <button className={styles.resetBtn} onClick={closeModal}>취소</button>
              <button className={styles.addBtn} onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default NoticeManagement;