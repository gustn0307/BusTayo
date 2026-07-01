import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./NoticeManagementDetail.module.css"; // CSS Module 임포트
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

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api.get(`/api/notice/${id}`)
      .then(r => r.data)
      .then(setNotice);
  }, [id]);

  if (!notice) return <div className={styles.container}>불러오는 중...</div>;

  return (
    <div className={styles.container}>
      
      {/* 브레드크럼 추가 */}
      <div className={styles.breadcrumb}>
        <span className={styles.link} onClick={() => navigate("/api/admin/notices")}>공지사항 관리</span>
        <span className={styles.sep}>&gt;</span>
        <span className={styles.current}>상세 보기</span>
      </div>

      {/* 아티클 카드 레이아웃 */}
      <article className={styles.article}>
        
        {/* 헤더 영역 */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>공지</span>
            <h2 className={styles.title}>{notice.noticeTitle}</h2>
          </div>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span>등록일: {formatDate(notice.createdAt)}</span>
            </div>
            {isUpdated(notice.createdAt, notice.updatedAt) && (
              <div className={`${styles.metaItem} ${styles.updated}`}>
                <span>(수정일: {formatDate(notice.updatedAt)})</span>
              </div>
            )}
          </div>
        </div>

        {/* 본문 영역 */}
        <div className={styles.body}>
          {notice.noticeContent.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* 푸터 영역 */}
        <div className={styles.footer}>
          <button className={styles.btnGhost} onClick={() => navigate("/admin/notices")}>
            이전
          </button>
          <button className={styles.btnTop} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            TOP
          </button>
        </div>

      </article>
    </div>
  );
}