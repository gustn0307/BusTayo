import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./NoticeDetail.module.css";
import api from "../api";

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

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api.get(`/api/notice/${id}`).then((r) => r.data).then(setNotice);
  }, [id]);

  if (!notice) return <div>불러오는 중...</div>;

  return (
    <div className={styles.container}>

      <div className={styles.breadcrumb}>
        <span className={styles.link} onClick={() => navigate("/home")}>홈</span>
        <span className={styles.sep}>›</span>
        <span className={styles.link} onClick={() => navigate("/notice")}>공지사항</span>
        <span className={styles.sep}>›</span>
        <span className={styles.current}>{notice.noticeTitle}</span>
      </div>

      <div className={styles.article}>

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>공지</span>
          </div>
          <div className={styles.title}>{notice.noticeTitle}</div>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              {formatDate(notice.createdAt)}
            </span>
            {isUpdated(notice.createdAt, notice.updatedAt) && (
              <span className={styles.updated}>
                수정: {formatDate(notice.updatedAt)}
              </span>
            )}
          </div>
        </div>

        <div className={styles.body}>
          {notice.noticeContent.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/notice")}
          >
            ← 이전 글
          </button>
          <button
            className={styles.btnTop}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            TOP ↑
          </button>
        </div>
      </div>
    </div>
  );
}
