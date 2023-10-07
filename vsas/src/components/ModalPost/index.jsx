import classNames from "classnames";
import styles from "./modalpost.module.scss";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

export const ModalPost = ({
  active,
  setActive,
  children,
  openContent,
  setOpenContent,
}) => {
  const handleCloseModal = () => {
    setOpenContent(false);
    setActive(false);
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
      <div ref={nodeRef} className={styles.modal} onClick={handleCloseModal}>
        <div
          className={
            active && openContent
              ? classNames(styles.content_active, styles.content)
              : styles.content
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.children}>{children}</div>
        </div>
      </div>
    </CSSTransition>
  );
};
