import classNames from "classnames";
import styles from "./modalpost.module.scss";

export const ModalPost = ({ active, setActive, children }) => {
  const handleCloseModal = () => {
    setActive(false);
    document.body.classList.remove("bodyModalOpen");
  };
  return (
    <div
      className={
        active ? classNames(styles.modal, styles.modal_active) : styles.modal
      }
      onClick={handleCloseModal}
    >
      <div
        className={
          active
            ? classNames(styles.content_active, styles.content)
            : styles.content
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
};
