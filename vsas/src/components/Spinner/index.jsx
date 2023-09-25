import styles from "./spinner.module.scss";

export const Spinner = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};
