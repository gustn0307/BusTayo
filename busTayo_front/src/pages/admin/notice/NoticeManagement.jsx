import { useState, useEffect } from "react";
import "./NoticeManagement.css";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).replace(/\. /g, ".").replace(".", ".");
}

function isUpdated(createdAt, updatedAt) {
  return updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();
}

const PAGE_SIZE = 10;  // 추가

function NoticeManagement({ onDetail }) {
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
    api.get("/notice")
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
      await api.put(`/admin/notice/${editTarget.noticeId}`, form);
    } else {
      await api.post(`/admin/notice`, form);
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
    await api.delete(`/admin/notice/${id}`);
    const updated = noticeList.filter(n => n.noticeId !== id);
    setNoticeList(updated);
    setFiltered(updated.filter(n => n.noticeTitle.includes(titleInput)));
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-container">

      <div className="page-header">
        <h2>공지사항 관리</h2>
        <button className="add-btn" onClick={openAdd}>+ 공지 작성</button>
      </div>

      <div className="search-card">
        <div className="search-row">
          <label>제목</label>
          <input
            type="text"
            placeholder="공지사항 제목 입력"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
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
          <span>공지 목록</span>
          <span className="total-pill">총 {filtered.length}건</span>
        </div>
        <table>
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
                <td colSpan="4" className="empty">등록된 공지사항이 없습니다.</td>
              </tr>
            ) : (
              paged.map(notice => (
                <tr key={notice.noticeId}>
                  <td>{notice.noticeId}</td>
                  <td
                    style={{ textAlign: "left", cursor: "pointer", color: "#1d4ed8" }}
                    onClick={() => navigate(`/admin/notices/${notice.noticeId}`)}
                  >
                    {notice.noticeTitle}
                    {isUpdated(notice.createdAt, notice.updatedAt) && (
                      <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "6px" }}>
                        (수정됨)
                      </span>
                    )}
                  </td>
                  <td>{formatDate(notice.createdAt)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEdit(notice)}>수정</button>
                    <button className="delete-btn" onClick={() => handleDelete(notice.noticeId)}>삭제</button>
                  </td>
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

      {showModal && (
        <div className="notice-modal-backdrop" onClick={closeModal}>
          <div className="notice-modal-box" onClick={e => e.stopPropagation()}>
            <div className="notice-modal-header">
              <span className="notice-modal-title">{editTarget ? "공지 수정" : "공지 작성"}</span>
              <button className="notice-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="notice-modal-body">
              <div className="notice-modal-row">
                <label>제목</label>
                <input
                  type="text"
                  placeholder="공지 제목 입력"
                  value={form.noticeTitle}
                  onChange={e => setForm(p => ({ ...p, noticeTitle: e.target.value }))}
                />
              </div>
              <div className="notice-modal-row align-top">
                <label>내용</label>
                <textarea
                  rows={6}
                  placeholder="공지 내용 입력"
                  value={form.noticeContent}
                  onChange={e => setForm(p => ({ ...p, noticeContent: e.target.value }))}
                />
              </div>
            </div>
            <div className="notice-modal-footer">
              <button className="reset-btn" onClick={closeModal}>취소</button>
              <button className="add-btn" onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default NoticeManagement;