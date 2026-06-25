import { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetail.css";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  // 페이징 처리
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

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
      .get(`/api/board/${id}/comments?page=${currentPage}&size=10`)
      .then((res) => {
        console.log("댓글 데이터:", res.data);
        setComments(res.data.content);
        
      })
      .catch((err) => console.log(err));
  }, [id, currentPage]);

  if (!post) return <div>로딩중...</div>;

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      api.delete(`/api/board/${id}`)
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/board");
        })
        .catch((err) => console.log(err));
    }
  };

  // 작성자 * 표시
  const maskUserId = (userId) => {
    const id = userId.split("@")[0];
    return id[0] + "*".repeat(id.length - 1);
  };

  return (
    <div className="board-detail-container">
      <h2 className="board-detail-title">{post.title}</h2>

      <div className="board-detail-meta">
        <span>작성자: {maskUserId(post.userId)}</span> {/* 작성자 *표시 */}
        <span>작성일: {post.createdAt.slice(0, 10)}</span> {/* 작성일 축소 */}
      </div>

      <p className="board-detail-content">{post.content}</p>

      {/* 버튼 */}
      <div className="board-detail-buttons">
        <button className="btn-list" onClick={() => navigate("/board")}>목록</button>
        <button className="btn-edit" onClick={() => navigate(`/board/${id}/edit`)}>수정</button>
        <button className="btn-delete" onClick={handleDelete}>삭제</button>
      </div>

      <div className="board-detail-comments">
        <h3>댓글 {comments.length}개</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-userId">{maskUserId(comment.userId)}</div> {/* 작성자 *표시 */}
              <div className="comment-content">{comment.content}</div>
              <div className="comment-createdAt">{comment.createdAt.slice(0, 10)}</div> {/* 작성일 축소 */}
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

        <div className="comment-write">
          <textarea placeholder="댓글을 입력하세요" />
          <div className="comment-write-buttons">
            <button className="btn-comment-submit">작성</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
