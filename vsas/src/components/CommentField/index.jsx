import ReactTextareaAutosize from "react-textarea-autosize";
import styles from "./commentfield.module.scss";
import { useState } from "react";

export const CommentField = () => {
  const [comment, setComment] = useState("");

  return (
    <div className={styles.field}>
      <ReactTextareaAutosize
        className={styles.textarea}
        minRows={1} // Минимальное количество строк
        maxRows={20} // Максимальное количество строк
        placeholder="Ответить"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className={styles.bottom_line}></div>
      <div className={styles.field_bottom}>
        <button type="submit" className={styles.post_btn}>
          Пиииу
        </button>
      </div>
    </div>
  );
};
