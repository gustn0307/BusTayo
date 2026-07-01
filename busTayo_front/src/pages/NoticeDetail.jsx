import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NoticeDetail.css";
import api from "../api";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).replace(/\. /g, ".").replace(".", ".");
}

function isUpdated(createdAt, updatedAt) {
  return updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();
}

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api.get(`/notice/${id}`)
      .then(r => r.data)
      .then(setNotice);
  }, [id]);

  if (!notice) return <div>불러오는 중...</div>;

  return (
    <div className="detail-container">

      <h2 className="detail-page-title">공지사항</h2>
      <hr className="detail-divider" />

      <div className="detail-header">
        <div className="detail-title">{notice.noticeTitle}</div>
        <div className="detail-date">
          {formatDate(notice.createdAt)}
          {isUpdated(notice.createdAt, notice.updatedAt) && (
            <span className="detail-updated"> (수정: {formatDate(notice.updatedAt)})</span>
          )}
        </div>
      </div>

      <hr className="detail-divider" />

      <div className="detail-content">
        {notice.noticeContent.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <hr className="detail-divider" />

      <div className="detail-footer">
        <button className="footer-btn" onClick={() => navigate("/notice")}>이전</button>
        <button className="footer-btn top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>TOP</button>
      </div>

    </div>
  );
}