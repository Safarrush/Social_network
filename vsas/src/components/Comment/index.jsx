import styles from "./comment.module.scss";
import black from "../../assets/icons/black.jpeg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentFetch } from "../../api/commentsApi";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";

export const Comment = ({ comment, postId }) => {
  //запрос на удаление комментарияа
  const { mutateAsync, isSuccess } = useMutation({
    mutationFn: async (values) => {
      await deleteCommentFetch(values);
    },
  });
  const queryClient = useQueryClient();
  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ["getAllComments"] });
  }

  //Удаление комментария
  const handleDeleteComment = () => {
    const values = { commentId: comment.id, postId: postId };
    mutateAsync(values);
  };

  //форматирование вренмени публикации
  const formatTimeAgo = (time) => {
    const currentDate = new Date();
    const publishedDate = new Date(time);
    const minutesAgo = differenceInMinutes(currentDate, publishedDate);
    const hoursAgo = differenceInHours(currentDate, publishedDate);
    const daysAgo = differenceInDays(currentDate, publishedDate);

    if (minutesAgo < 60) {
      if (minutesAgo < 1) {
        return "только что";
      }
      return `${minutesAgo} м`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} ч `;
    } else if (daysAgo < 7) {
      return `${daysAgo} д`;
    } else {
      return format(publishedDate, "dd.MM.yy");
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.bottom_line}></div>
        <div className={styles.content}>
          <div className={styles.left}>
            <img src={black} alt="" className={styles.avatar} />
          </div>

          <div className={styles.right}>
            <div className={styles.top}>
              <div className={styles.top_left}>
                <p>{comment.author}</p>
                <span>@{comment.author}</span>
                <span>{formatTimeAgo(comment.created_at)}</span>
              </div>
              <svg
                className={styles.delete_comment}
                onClick={() => handleDeleteComment()}
                data-name="Layer 1"
                id="Layer_1"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title />
                <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
              </svg>
            </div>
            <p className={styles.comment}>{comment.body}</p>
          </div>
        </div>
      </div>
    </>
  );
};
