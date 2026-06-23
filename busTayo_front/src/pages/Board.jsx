import { useEffect, useState } from "react";
import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import api from "../api";

// ───────────────────────────────
// 목록
// ───────────────────────────────
function BoardList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const PAGE_SIZE = 10;

  const fetchPosts = async (page = 0) => {
    try {
      setLoading(true);
      const res = await api.get("/api/board", { params: { page, size: PAGE_SIZE } });
      const data = res.data;
      if (data.content !== undefined) {
        setList(data.content);
        setTotalPages(data.totalPages ?? 1);
        setTotalElements(data.totalElements ?? 0);
      } else if (Array.isArray(data)) {
        setList(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(currentPage); }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPosts(0);
  };

  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const getPageNumbers = () => {
    const maxButtons = 7;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(0, end - maxButtons + 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>자유게시판</h2>
      <p style={s.subtitle}>버스타요 이용과 관련한 자유로운 의견을 나눠세요.</p>

      <div style={s.toolbar}>
        <form onSubmit={handleSearch} style={s.searchForm}>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={s.select}>
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">작성자</option>
          </select>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="제목, 내용을 입력해주세요."
            style={s.searchInput}
          />
          <button type="submit" style={s.searchBtn}>🔍</button>
        </form>
        <button style={s.writeBtn} onClick={() => navigate("/board/write")}>✏️ 글쓰기</button>
      </div>

      <div style={s.tableWrapper}>
        <table style={s.table}>
          <thead>
            <tr style={s.theadRow}>
              <th style={{ ...s.th, width: "80px" }}>번호</th>
              <th style={{ ...s.th, textAlign: "left" }}>제목</th>
              <th style={{ ...s.th, width: "110px" }}>작성자</th>
              <th style={{ ...s.th, width: "110px" }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={s.empty}>불러오는 중...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={4} style={s.empty}>게시글이 없습니다.</td></tr>
            ) : (
              list.map((post, idx) => (
                <tr
                  key={post.id}
                  style={s.row}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  onClick={() => navigate(`/board/${post.id}`)}
                >
                  <td style={{ ...s.td, textAlign: "center", color: "#888" }}>
                    {totalElements - (currentPage * PAGE_SIZE + idx)}
                  </td>
                  <td style={s.td}><span style={s.postTitle}>{post.title}</span></td>
                  <td style={{ ...s.td, textAlign: "center", color: "#555" }}>
                    {post.author || post.username || post.nickname || "-"}
                  </td>
                  <td style={{ ...s.td, textAlign: "center", color: "#888" }}>
                    {formatDate(post.createdAt || post.createDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn} onClick={() => handlePageChange(0)} disabled={currentPage === 0}>«</button>
          <button style={s.pageBtn} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>‹</button>
          {getPageNumbers().map((p) => (
            <button key={p} style={p === currentPage ? s.pageBtnActive : s.pageBtn} onClick={() => handlePageChange(p)}>
              {p + 1}
            </button>
          ))}
          <button style={s.pageBtn} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>›</button>
          <button style={s.pageBtn} onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1}>»</button>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────
// 상세 조회
// ───────────────────────────────
function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const raw = token.startsWith("Bearer ") ? token.slice(7) : token;
      return JSON.parse(atob(raw.split(".")[1]));
    } catch { return null; }
  };
  const currentUser = getCurrentUser();

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [postRes, commentRes] = await Promise.all([
        api.get(`/api/board/${id}`),
        api.get(`/api/board/${id}/comments`),
      ]);
      console.log("게시글 데이터:", postRes.data);
      setPost(postRes.data);
      setComments(Array.isArray(commentRes.data) ? commentRes.data : commentRes.data.content ?? []);
    } catch (err) {
      console.log(err);
      alert("게시글을 불러오지 못했습니다.");
      navigate("/board");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/board/${id}`);
      alert("삭제되었습니다.");
      navigate("/board");
    } catch { alert("삭제에 실패했습니다."); }
  };

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    try {
      await api.post(`/api/board/${id}/comments`, { content: commentInput });
      setCommentInput("");
      fetchAll();
    } catch { alert("댓글 작성에 실패했습니다."); }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    try {
      await api.put(`/api/board/${id}/comments/${commentId}`, { content: editingCommentText });
      setEditingCommentId(null);
      fetchAll();
    } catch { alert("댓글 수정에 실패했습니다."); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/board/${id}/comments/${commentId}`);
      fetchAll();
    } catch { alert("댓글 삭제에 실패했습니다."); }
  };

  const isMine = (author) => {
    if (!currentUser) return false;
    return currentUser.sub === author || currentUser.username === author || currentUser.nickname === author;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  if (loading) return <div style={s.loading}>불러오는 중...</div>;
  if (!post) return null;

  const postAuthor = post.author || post.username || post.nickname || "";

  return (
    <div style={s.container}>
      <button style={s.backBtn} onClick={() => navigate("/board")}>← 목록으로</button>

      <div style={s.postCard}>
        <h2 style={s.postTitle}>{post.title}</h2>
        <div style={s.metaRow}>
          <div style={s.metaLeft}>
            <span style={s.metaText}>✍️ {postAuthor}</span>
            <span style={s.metaDivider}>|</span>
            <span style={s.metaText}>{formatDate(post.createdAt || post.createDate)}</span>
          </div>
          {isMine(postAuthor) && (
            <div style={s.actionBtns}>
              <button style={s.editBtn} onClick={() => navigate(`/board/${id}/edit`)}>수정</button>
              <button style={s.deleteBtn} onClick={handleDeletePost}>삭제</button>
            </div>
          )}
        </div>
        <hr style={s.divider} />
        <div style={s.postContent}>{post.content}</div>
      </div>

      <div style={s.commentSection}>
        <h3 style={s.commentTitle}>댓글 <span style={s.commentCount}>{comments.length}</span></h3>

        {comments.length === 0 ? (
          <div style={s.noComment}>첫 번째 댓글을 남겨보세요!</div>
        ) : (
          comments.map((comment) => {
            const commentAuthor = comment.author || comment.username || comment.nickname || "";
            return (
              <div key={comment.id} style={s.commentItem}>
                <div style={s.commentHeader}>
                  <span style={s.commentAuthor}>✍️ {commentAuthor}</span>
                  <span style={s.commentDate}>{formatDate(comment.createdAt || comment.createDate)}</span>
                </div>
                {editingCommentId === comment.id ? (
                  <div>
                    <textarea value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)} style={s.editTextarea} rows={3} />
                    <div style={s.editBtns}>
                      <button style={s.saveBtn} onClick={() => handleUpdateComment(comment.id)}>저장</button>
                      <button style={s.cancelBtn} onClick={() => setEditingCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div style={s.commentBody}>
                    <p style={s.commentText}>{comment.content}</p>
                    {isMine(commentAuthor) && (
                      <div style={s.commentActions}>
                        <button style={s.commentEditBtn} onClick={() => { setEditingCommentId(comment.id); setEditingCommentText(comment.content); }}>수정</button>
                        <button style={s.commentDeleteBtn} onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        <div style={s.commentInputBox}>
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요."
            style={s.commentTextarea}
            rows={3}
            onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleSubmitComment(); }}
          />
          <div style={s.commentInputFooter}>
            <span style={s.commentHint}>Ctrl + Enter로 등록</span>
            <button style={s.submitBtn} onClick={handleSubmitComment} disabled={!commentInput.trim()}>댓글 등록</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────
// 글쓰기 / 수정
// ───────────────────────────────
function BoardWrite() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/board/${id}`)
      .then((res) => { setTitle(res.data.title || ""); setContent(res.data.content || ""); })
      .catch(() => { alert("게시글을 불러오지 못했습니다."); navigate("/board"); });
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!content.trim()) { alert("내용을 입력해주세요."); return; }
    try {
      setSubmitting(true);
      if (isEdit) {
        await api.put(`/api/board/${id}`, { title, content });
        alert("수정되었습니다.");
        navigate(`/board/${id}`);
      } else {
        const res = await api.post("/api/board", { title, content });
        alert("등록되었습니다.");
        const newId = res.data.id || res.data.boardId;
        navigate(newId ? `/board/${newId}` : "/board");
      }
    } catch { alert(isEdit ? "수정에 실패했습니다." : "등록에 실패했습니다.");
    } finally { setSubmitting(false); }
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>{isEdit ? "게시글 수정" : "글쓰기"}</h2>
      <div style={s.form}>
        <div style={s.field}>
          <label style={s.label}>제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요." style={s.input} maxLength={100} />
          <span style={s.counter}>{title.length}/100</span>
        </div>
        <div style={s.field}>
          <label style={s.label}>내용</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요." style={s.textarea} rows={16} />
        </div>
        <div style={s.btnRow}>
          <button style={s.cancelBtn} onClick={() => navigate(isEdit ? `/board/${id}` : "/board")}>취소</button>
          <button style={s.submitBtn2} onClick={handleSubmit} disabled={submitting}>
            {submitting ? "처리 중..." : isEdit ? "수정 완료" : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────
// 라우팅 묶음 (Board.jsx 에서 내부 라우팅)
// ───────────────────────────────
function Board() {
  return (
    <Routes>
      <Route path="/"         element={<BoardList />} />
      <Route path="/write"    element={<BoardWrite />} />
      <Route path="/:id"      element={<BoardDetail />} />
      <Route path="/:id/edit" element={<BoardWrite />} />
    </Routes>
  );
}

export default Board;

// ───────────────────────────────
// 스타일
// ───────────────────────────────
const s = {
  // 공통
  container: { maxWidth: "960px", margin: "0 auto", padding: "32px 16px" },
  loading: { textAlign: "center", padding: "80px", color: "#aaa" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 6px 0" },
  subtitle: { fontSize: "14px", color: "#666", margin: "0 0 24px 0" },

  // 목록
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" },
  searchForm: { display: "flex", alignItems: "center", gap: "8px", flex: 1 },
  select: { padding: "8px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color: "#333", background: "white", cursor: "pointer" },
  searchInput: { flex: 1, padding: "8px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", outline: "none", minWidth: "200px" },
  searchBtn: { padding: "8px 12px", background: "#1d4ed8", color: "white", border: "none", borderRadius: "6px", fontSize: "15px", cursor: "pointer" },
  writeBtn: { padding: "8px 18px", background: "#1d4ed8", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  tableWrapper: { border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  theadRow: { backgroundColor: "#f8fafc", borderBottom: "2px solid #e5e7eb" },
  th: { padding: "12px 16px", fontWeight: "600", color: "#374151", textAlign: "center" },
  row: { borderBottom: "1px solid #f0f0f0", cursor: "pointer", backgroundColor: "white" },
  td: { padding: "13px 16px", color: "#1a1a1a" },
  postTitle: { color: "#111", fontWeight: "500" },
  empty: { textAlign: "center", padding: "60px", color: "#aaa", fontSize: "14px" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginTop: "24px" },
  pageBtn: { padding: "7px 12px", border: "1px solid #ddd", borderRadius: "6px", background: "white", color: "#555", fontSize: "14px", cursor: "pointer" },
  pageBtnActive: { padding: "7px 12px", border: "1px solid #1d4ed8", borderRadius: "6px", background: "#1d4ed8", color: "white", fontSize: "14px", cursor: "pointer", fontWeight: "600" },

  // 상세
  backBtn: { background: "none", border: "none", color: "#1d4ed8", fontSize: "14px", cursor: "pointer", padding: "0 0 20px 0", fontWeight: "500" },
  postCard: { background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "28px 32px", marginBottom: "24px" },
  metaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" },
  metaLeft: { display: "flex", alignItems: "center", gap: "8px" },
  metaText: { fontSize: "14px", color: "#6b7280" },
  metaDivider: { color: "#d1d5db" },
  actionBtns: { display: "flex", gap: "8px" },
  editBtn: { padding: "6px 16px", background: "white", border: "1px solid #1d4ed8", color: "#1d4ed8", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "500" },
  deleteBtn: { padding: "6px 16px", background: "white", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "500" },
  divider: { border: "none", borderTop: "1px solid #f0f0f0", margin: "0 0 24px 0" },
  postContent: { fontSize: "15px", lineHeight: "1.8", color: "#1a1a1a", whiteSpace: "pre-wrap", minHeight: "120px" },

  // 댓글
  commentSection: { background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "24px 32px" },
  commentTitle: { fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 20px 0" },
  commentCount: { color: "#1d4ed8" },
  noComment: { textAlign: "center", padding: "30px", color: "#aaa", fontSize: "14px" },
  commentItem: { borderBottom: "1px solid #f3f4f6", paddingBottom: "16px", marginBottom: "16px" },
  commentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  commentAuthor: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  commentDate: { fontSize: "12px", color: "#9ca3af" },
  commentBody: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  commentText: { fontSize: "14px", color: "#374151", margin: 0, lineHeight: "1.6", flex: 1, whiteSpace: "pre-wrap" },
  commentActions: { display: "flex", gap: "6px", flexShrink: 0 },
  commentEditBtn: { padding: "3px 10px", background: "none", border: "1px solid #d1d5db", color: "#555", borderRadius: "4px", fontSize: "12px", cursor: "pointer" },
  commentDeleteBtn: { padding: "3px 10px", background: "none", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: "4px", fontSize: "12px", cursor: "pointer" },
  editTextarea: { width: "100%", padding: "10px", border: "1px solid #1d4ed8", borderRadius: "6px", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box" },
  editBtns: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" },
  saveBtn: { padding: "6px 16px", background: "#1d4ed8", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  cancelBtn: { padding: "6px 16px", background: "white", border: "1px solid #d1d5db", color: "#555", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  commentInputBox: { marginTop: "20px", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" },
  commentTextarea: { width: "100%", padding: "14px", border: "none", fontSize: "14px", resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1a1a1a" },
  commentInputFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f9fafb", borderTop: "1px solid #f0f0f0" },
  commentHint: { fontSize: "12px", color: "#9ca3af" },
  submitBtn: { padding: "7px 18px", background: "#1d4ed8", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },

  // 글쓰기/수정
  form: { background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  input: { padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "7px", fontSize: "15px", outline: "none", color: "#111" },
  counter: { alignSelf: "flex-end", fontSize: "12px", color: "#9ca3af" },
  textarea: { padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "7px", fontSize: "15px", resize: "vertical", outline: "none", fontFamily: "inherit", color: "#111", lineHeight: "1.7", minHeight: "300px" },
  btnRow: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  submitBtn2: { padding: "10px 28px", background: "#1d4ed8", color: "white", border: "none", borderRadius: "7px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};