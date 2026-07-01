import { useEffect, useState, useRef } from "react";
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
  // 대댓글 작성
  const [replyingTo, setReplyingTo] = useState(null); // 답글 다는 중인 댓글 id
  const [replyContent, setReplyContent] = useState(""); // 답글 내용
  // 댓글 수정
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  // 에디터
  const oEditors = useRef([]);

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

  // 에디터
  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        if (window.nhn) {
          window.nhn.husky.EZCreator.createInIFrame({
            oAppRef: oEditors.current,
            elPlaceHolder: "editContentTxt",
            sSkinURI: "/smarteditor2-2.8.2.3/SmartEditor2Skin.html",
            fCreator: "createSEditor2",
            fOnAppLoad: function () {
              oEditors.current[0].setIR(post.content); // 기존 내용 넣기
            },
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

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
    oEditors.current[0].exec("UPDATE_CONTENTS_FIELD", []);
    const editorContent = document.getElementById("editContentTxt").value;
    api
      .put(`/api/board/${id}`, {
        title: editTitle,
        content: editorContent,
        userId: post.userId,
      })
      .then(() => {
        alert("수정되었습니다.");
        closeEditor();
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
        fetchComments();
      })
      .catch((err) => console.log(err));
  };

  // 대댓글 작성
  const handleReplySubmit = (parentId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    api
      .post(`/api/board/${id}/comments`, {
        content: replyContent,
        parentId: parentId,
      })
      .then(() => {
        setReplyContent("");
        setReplyingTo(null);
        fetchComments();
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

  // 특정 댓글의 답글 개수 (대댓글의 대댓글까지 포함)
  const countReplies = (comment) => {
    if (!comment.replies || comment.replies.length === 0) return 0;
    return comment.replies.reduce(
      (total, reply) => total + 1 + countReplies(reply),
      0,
    );
  };

  // 댓글 + 대댓글 재귀 렌더링
  const renderComment = (comment, depth = 0) => (
    <div
      key={comment.id}
      className="comment"
      style={{ marginLeft: depth * 30 }} // depth(대댓글 단계)만큼 들여쓰기
    >
      <div className="comment-userId">
        {maskUserId(comment.userId)}
        {depth === 0 && countReplies(comment) > 0 && (
          <span className="comment-reply-count">
            {" "}
            · 답글 {countReplies(comment)}개
          </span>
        )}
      </div>

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
          <button className="btn-cancel" onClick={() => setEditCommentId(null)}>
            취소
          </button>
        </div>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}

      <div className="comment-createdAt">{comment.createdAt.slice(0, 10)}</div>

      <div className="comment-buttons">
        {comment.userId === currentUserId && (
          <>
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
          </>
        )}
        <button
          className="btn-comment-reply"
          onClick={() =>
            setReplyingTo(replyingTo === comment.id ? null : comment.id)
          }
        >
          답글
        </button>
      </div>

      {/* 답글 입력창 (답글 버튼 눌렀을 때만 표시) */}
      {replyingTo === comment.id && (
        <div className="reply-write">
          <textarea
            placeholder="답글을 입력하세요"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="btn-comment-submit"
            onClick={() => handleReplySubmit(comment.id)}
          >
            작성
          </button>
          <button
            className="btn-cancel"
            onClick={() => {
              setReplyingTo(null);
              setReplyContent("");
            }}
          >
            취소
          </button>
        </div>
      )}

      {/* 대댓글 재귀 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

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
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("본인 댓글만 수정할 수 있습니다.");
        } else {
          alert("수정에 실패했습니다.");
        }
        console.log(err);
      });
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
        .catch((err) => {
          if (err.response?.status === 403) {
            alert("본인 댓글만 수정할 수 있습니다.");
          } else {
            alert("수정에 실패했습니다.");
          }
          console.log(err);
        });
    }
  };

  const closeEditor = () => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => iframe.parentNode.removeChild(iframe));
    oEditors.current = [];
    setIsEditing(false);
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
            id="editContentTxt"
            name="editContentTxt"
            rows="15"
            style={{ width: "100%" }}
          />
          <div className="board-detail-buttons">
            <button onClick={handleEditSubmit} className="btn-save">
              저장
            </button>
            <button onClick={closeEditor} className="btn-cancel">
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
          <p
            className="board-detail-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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
          comments.map((comment) => renderComment(comment))
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
