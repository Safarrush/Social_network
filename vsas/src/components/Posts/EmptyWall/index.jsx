import styles from "./emptywall.module.scss";

export const EmptyWall = () => {
  return (
    <div className={styles.posts}>
      <div className={styles.empty_wrapper}>
        <p>У вас пока нет постов...</p>
      </div>
    </div>
  );
};
