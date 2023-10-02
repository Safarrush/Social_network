import TextareaAutosize from "react-textarea-autosize";
import styles from "./commentfield.module.scss";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentFetch } from "../../api/commentsApi";

export const CommentField = ({ id }) => {
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");
  const { mutateAsync, error, isError, isSuccess } = useMutation({
    mutationFn: async (commentData) => {
      const res = await createCommentFetch(commentData);
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });
  if (isSuccess) {
    queryClient.invalidateQueries();
  }
  if (isError) return { error };

  //отправить комментарий
  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      id: id,
      body: comment,
    };
    mutateAsync(commentData);
    setComment("");
    queryClient.invalidateQueries(["getAllComments", id]);
  };

  return (
    <div className={styles.field}>
      <form type="submit" onSubmit={(e) => handleSubmit(e)}>
        <TextareaAutosize
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
      </form>
    </div>
  );
};
