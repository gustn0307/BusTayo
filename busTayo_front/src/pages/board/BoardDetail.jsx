import { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetail.css";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 게시물/댓글 목록
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  // 페이징 처리
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  // 게시글 수정
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  // 댓글 작성
  const [newComment, setNewComment] = useState("");
  // 댓글 수정
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  // 작성자 * 표시
  const maskUserId = (userId) => {
    const id = userId.split("@")[0];
    return id[0] + "*".repeat(id.length - 1);
  };

  // 게시글 상세 조회
  useEffect(() => {
    api
      .get(`/api/board/${id}`)
      .then((res) => {
        console.log("게시글 데이터:", res.data);
        setPost(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // 댓글 조회
  useEffect(() => {
    console.log("현재 페이지:", currentPage);
    api
      .get(`/api/board/${id}/comments?page=${currentPage}&size=5`)
      .then((res) => {
        console.log("댓글 데이터:", res.data);
        setComments(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [id, currentPage]);

  if (!post) return <div>로딩중...</div>;

  const token = localStorage.getItem("accessToken");
  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1])).email
    : null;

  // 게시글 수정
  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(post.title);
    setEditContent(post.content);
  };
  const handleEditSubmit = () => {
    api
      .put(`/api/board/${id}`, {
        title: editTitle,
        content: editContent,
        userId: post.userId,
      })
      .then(() => {
        alert("수정되었습니다.");
        setIsEditing(false);
        api.get(`/api/board/${id}`).then((res) => setPost(res.data));
      })
      .catch(() => alert("수정에 실패했습니다."));
  };

  // 게시글 삭제
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      api
        .delete(`/api/board/${id}`)
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/board");
        })
        .catch((err) => console.log(err));
    }
  };

  // 댓글 작성
  const handleCommentSummit = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    api
      .post(`/api/board/${id}/comments`, { content: newComment })
      .then(() => {
        alert("작성되었습니다.");
        setNewComment("");
        fetchComments(); // 댓글 목록 새로고침
      })
      .catch((err) => console.log(err));
  };

  const fetchComments = () => {
    api
      .get(`/api/board/${id}/comments?page=${currentPage}&size=5`)
      .then((res) => {
        setComments(res.data.content);
        setTotalPages(res.data.totalPages);
      });
  };

  // 댓글 수정

  const handleCommentEdit = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleCommentEditSubmit = (commentId) => {
    api
      .put(`/api/board/${id}/comments/${commentId}`, {
        content: editCommentContent,
      })
      .then(() => {
        alert("수정되었습니다.");
        setEditCommentId(null);
        setEditCommentContent("");
        fetchComments();
      })
      .catch((err) => console.log(err));
  };

  // 댓글 삭제

  const handleCommentDelete = (commentId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      api
        .delete(`/api/board/${id}/comments/${commentId}`)
        .then(() => {
          alert("삭제되었습니다.");
          fetchComments();
        })
        .catch((err) => console.log(err));
    }
  };

  // 게시글 상세 조회
  return (
    <div className="board-detail-container">
      {/* 1. 수정 모드일 때 보여줄 화면 (isEditing이 true일 때) */}
      {isEditing ? (
        <div className="edit-mode">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title-input"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-content-textarea"
          />
          <div className="board-detail-buttons">
            <button onClick={handleEditSubmit} className="btn-save">
              저장
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              취소
            </button>
          </div>
        </div>
      ) : (
        /* 2. 원래 보던 화면 (isEditing이 false일 때) */
        <div className="view-mode">
          <h2 className="board-detail-title">{post.title}</h2>
          <div className="board-detail-meta">
            <span>작성자: {maskUserId(post.userId)}</span>
            <span>작성일: {post.createdAt.slice(0, 10)}</span>
          </div>
          <p className="board-detail-content">{post.content}</p>

          <div className="board-detail-buttons">
            <button className="btn-list" onClick={() => navigate("/board")}>
              목록
            </button>
            {post.userId === currentUserId && (
              <button className="btn-edit" onClick={handleEdit}>
                수정
              </button>
            )}
            {post.userId === currentUserId && (
              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            )}
          </div>
        </div>
      )}

      <div className="board-detail-comments">
        <h3>댓글 {comments.length}개</h3>

        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-userId">{maskUserId(comment.userId)}</div>
              {editCommentId === comment.id ? (
                <div>
                  <textarea
                    className="edit-comment-textarea"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                  />
                  <button
                    className="btn-save"
                    onClick={() => handleCommentEditSubmit(comment.id)}
                  >
                    저장
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditCommentId(null)}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="comment-content">{comment.content}</div>
              )}
              <div className="comment-createdAt">
                {comment.createdAt.slice(0, 10)}
              </div>
              {comment.userId === currentUserId && (
                <div className="comment-buttons">
                  <button
                    className="btn-comment-edit"
                    onClick={() => handleCommentEdit(comment)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-comment-delete"
                    onClick={() => handleCommentDelete(comment.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="comment-empty">첫 댓글을 작성해보세요!</div>
        )}

        {/* 페이지 버튼 */}
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                이전
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                다음
              </button>
            </li>
          </ul>
        </nav>

        {/* 댓글 작성 */}

        <div className="comment-write">
          <textarea
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="comment-write-buttons">
            <button
              className="btn-comment-submit"
              onClick={handleCommentSummit}
            >
              작성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
