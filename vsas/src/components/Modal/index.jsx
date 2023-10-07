import classNames from "classnames";
import styles from "./modal.module.scss";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

export const Modal = ({
  active,
  setActive,
  children,
  openContent,
  setOpenContent,
  handleCloseModal,
}) => {
  handleCloseModal = () => {
    setActive(false);
    setOpenContent(false);
    document.body.classList.remove("bodyModalOpen");
  };
  const nodeRef = useRef(null);
  return (
    <CSSTransition
      in={active}
      timeout={400}
      nodeRef={nodeRef}
      classNames={{
        enter: styles["modal-enter"],
        enterActive: styles["modal-enter-active"],
        exit: styles["modal-exit"],
        exitActive: styles["modal-exit-active"],
      }}
      unmountOnExit
    >
      <div className={styles.modal} onClick={handleCloseModal} ref={nodeRef}>
        <div
          className={
            active && openContent
              ? classNames(styles.content_active, styles.content)
              : styles.content
          }
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};
