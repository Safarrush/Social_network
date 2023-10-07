import styles from "./post.module.scss";
import black from "../../../assets/icons/black.jpeg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLikeFetch, deleteLikeFetch, deletePostFetch } from "../../../api";
import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
//import { Spinner } from "../../Spinner";
import classNames from "classnames";
import { useState } from "react";
import { Comment } from "../../Comment";
import { CommentField } from "../../CommentField";
import { ModalPost } from "../../ModalPost";
import { getCommentsFetch } from "../../../api/commentsApi";

export const Post = ({ content, likes, id, isLike, user, time, firstname }) => {
  const [active, setActive] = useState(false);
  const [openContent, setOpenContent] = useState(false);

  //Получить все комментарии поста
  const { data: comments } = useQuery({
    queryKey: ["getAllComments", id],
    options: {
      keepPreviousData: true,
    },
    queryFn: async () => {
      const res = await getCommentsFetch(id);
      if (res.ok) {
        const responce = await res.json();

        return responce;
      }
    },
  });

  //удаление поста
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess } = useMutation({
    mutationFn: async (id) => {
      await deletePostFetch(id);
    },
  });
  if (isError) return { error };
  if (isSuccess) {
    queryClient.invalidateQueries();
  }

  //удалить пост
  const deleteClick = (e) => {
    e.stopPropagation();
    mutateAsync(id);
  };

  //открыть модальное окно
  const handleOpenModal = () => {
    document.body.classList.add("bodyModalOpen");
    setTimeout(() => {
      setOpenContent(true);
    }, 100);
    setActive(true);
  };

  //Поставить/убрать лайк
  const handleAddLike = async (e) => {
    e.stopPropagation();
    if (isLike) {
      await deleteLikeFetch(id);
      queryClient.invalidateQueries();
    } else {
      await addLikeFetch(id);
      queryClient.invalidateQueries();
    }
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
      <div className={styles.wrapper} onClick={handleOpenModal}>
        <div className={styles.content}>
          <div className={styles.left}>
            <img src={black} alt="" className={styles.avatar} />
          </div>
          <div className={styles.right}>
            <div className={styles.top}>
              <div className={styles.top_left}>
                <p>{firstname}</p>
                <span>@{user}</span>
                <span>{formatTimeAgo(time)}</span>
              </div>
              <div className={styles.top_right}>
                <svg
                  onClick={(e) => deleteClick(e)}
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#cac6c2"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </div>
            </div>

            <p className={styles.post}>{content}</p>
            <div className={styles.bottom_line}></div>

            <div className={styles.bottom}>
              {/* Иконка лайка */}
              <div
                className={classNames(styles.icon_wrapper, {
                  [styles.icon_wrapper_like]: isLike,
                })}
                onClick={(e) => handleAddLike(e)}
              >
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <title />
                  <g data-name="1" id="_1">
                    <path d="M348.45,432.7H261.8a141.5,141.5,0,0,1-49.52-8.9l-67.5-25.07a15,15,0,0,1,10.45-28.12l67.49,25.07a111.79,111.79,0,0,0,39.08,7h86.65a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30H368.9a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30h20.44a14.21,14.21,0,0,0,10.05-24.26,14.08,14.08,0,0,0-10.05-4.16,15,15,0,0,1,0-30h20.45a14.21,14.21,0,0,0,10-24.26,14.09,14.09,0,0,0-10-4.17H268.15A15,15,0,0,1,255,176.74a100.2,100.2,0,0,0,9.2-29.33c3.39-21.87-.79-41.64-12.42-58.76a12.28,12.28,0,0,0-22.33,7c.49,51.38-23.25,88.72-68.65,108a15,15,0,1,1-11.72-27.61c18.72-8,32.36-19.75,40.55-35.08,6.68-12.51,10-27.65,9.83-45C199.31,77,211,61,229.18,55.34s36.81.78,47.45,16.46c24.71,36.36,20.25,74.1,13.48,97.21H409.79a44.21,44.21,0,0,1,19.59,83.84,44.27,44.27,0,0,1-20.44,58.42,44.27,44.27,0,0,1-20.45,58.43,44.23,44.23,0,0,1-40,63Z" />
                    <path d="M155,410.49H69.13a15,15,0,0,1-15-15V189.86a15,15,0,0,1,15-15H155a15,15,0,0,1,15,15V395.49A15,15,0,0,1,155,410.49Zm-70.84-30H140V204.86H84.13Z" />
                  </g>
                </svg>
                <span>{likes}</span>
              </div>

              {/* Иконка комментариев */}
              <div className={styles.icon_wrapper}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <title />
                  <g data-name="1" id="_1">
                    <path d="M364,450a15,15,0,0,1-11.29-5.12L273.5,354.34H118.64a64.58,64.58,0,0,1-64.5-64.51V112.51A64.58,64.58,0,0,1,118.64,48h273a64.58,64.58,0,0,1,64.5,64.51V289.83a64.58,64.58,0,0,1-64.5,64.51H379V435a15,15,0,0,1-15,15ZM118.64,78a34.55,34.55,0,0,0-34.5,34.51V289.83a34.55,34.55,0,0,0,34.5,34.51H280.3a15,15,0,0,1,11.29,5.12L349,395.09V339.34a15,15,0,0,1,15-15h27.59a34.55,34.55,0,0,0,34.5-34.51V112.51A34.55,34.55,0,0,0,391.63,78Z" />
                    <path d="M199.63,264A15.13,15.13,0,0,1,189,259.61c-.34-.35-.67-.72-1-1.1a14.34,14.34,0,0,1-.87-1.18q-.41-.61-.75-1.26c-.23-.43-.44-.88-.63-1.33s-.35-.92-.5-1.38-.26-1-.36-1.43-.17-1-.22-1.45a14.66,14.66,0,0,1-.07-1.48,14.33,14.33,0,0,1,.07-1.47c.05-.49.13-1,.22-1.46s.22-1,.36-1.42.31-.94.5-1.39.4-.89.63-1.32a14.6,14.6,0,0,1,.75-1.27c.27-.4.56-.8.87-1.18s.65-.75,1-1.1a15.15,15.15,0,0,1,12.08-4.32c.49.05,1,.13,1.46.22s1,.22,1.42.36.94.31,1.39.5.89.4,1.32.63.86.48,1.27.75.8.56,1.18.87.75.65,1.09,1,.68.72,1,1.1.6.78.87,1.18a14.6,14.6,0,0,1,.75,1.27q.35.65.63,1.32c.19.45.35.92.5,1.39s.26.94.36,1.42.17,1,.22,1.46.07,1,.07,1.47,0,1-.07,1.48-.13,1-.22,1.45-.22,1-.36,1.43-.31.93-.5,1.38-.4.9-.63,1.33-.48.85-.75,1.26-.57.8-.87,1.18-.65.75-1,1.1-.71.68-1.09,1-.78.6-1.18.87-.84.52-1.27.75-.87.44-1.32.63-.92.35-1.39.5-.94.26-1.42.36-1,.17-1.46.22S200.12,264,199.63,264Z" />
                    <path d="M310.64,264c-.49,0-1,0-1.47-.07s-1-.13-1.46-.22-1-.22-1.43-.36-.93-.31-1.38-.5-.89-.4-1.32-.63a14.6,14.6,0,0,1-1.27-.75c-.4-.27-.8-.56-1.18-.87s-.75-.65-1.1-1-.68-.72-1-1.1-.6-.78-.87-1.18a14.6,14.6,0,0,1-.75-1.27q-.35-.65-.63-1.32c-.19-.45-.35-.92-.5-1.38s-.26-1-.36-1.43-.17-1-.22-1.45-.07-1-.07-1.48,0-1,.07-1.48.13-1,.22-1.45.22-1,.36-1.43.31-.93.5-1.38.4-.9.63-1.33.48-.85.75-1.26a14.34,14.34,0,0,1,.87-1.18c.31-.38.65-.75,1-1.1s.72-.68,1.1-1,.78-.6,1.18-.87a14.6,14.6,0,0,1,1.27-.75q.65-.34,1.32-.63c.45-.19.92-.35,1.38-.5s1-.26,1.43-.36,1-.17,1.46-.22a16.15,16.15,0,0,1,2.95,0c.48.05,1,.13,1.45.22s1,.22,1.43.36.93.31,1.38.5.89.4,1.32.63a14.6,14.6,0,0,1,1.27.75c.4.27.8.56,1.18.87s.75.65,1.1,1,.68.72,1,1.1a14.34,14.34,0,0,1,.87,1.18q.4.62.75,1.26c.23.43.44.88.63,1.33s.35.92.5,1.38.26,1,.36,1.43.17,1,.22,1.45a15.68,15.68,0,0,1,0,3c-.05.48-.13,1-.22,1.45s-.22,1-.36,1.43-.31.93-.5,1.38-.4.89-.63,1.32a14.6,14.6,0,0,1-.75,1.27c-.27.4-.56.8-.87,1.18s-.65.75-1,1.1-.72.68-1.1,1-.78.6-1.18.87a14.6,14.6,0,0,1-1.27.75q-.65.34-1.32.63c-.45.19-.92.35-1.38.5s-.95.26-1.43.36-1,.17-1.45.22S311.13,264,310.64,264Z" />
                    <path d="M255.13,264a14.6,14.6,0,0,1-1.47-.07c-.49-.05-1-.13-1.46-.22s-.95-.22-1.42-.36-.93-.31-1.38-.5-.9-.4-1.33-.63a15.58,15.58,0,0,1-2.45-1.62c-.38-.31-.75-.65-1.09-1a14.67,14.67,0,0,1-1-1.1c-.31-.38-.61-.78-.88-1.18a14.6,14.6,0,0,1-.75-1.27q-.34-.65-.63-1.32c-.18-.45-.35-.92-.49-1.39a13.41,13.41,0,0,1-.36-1.42,14.46,14.46,0,0,1-.29-2.93,14.66,14.66,0,0,1,.07-1.48,14.51,14.51,0,0,1,.22-1.45,14.24,14.24,0,0,1,.36-1.43c.14-.46.31-.93.49-1.38s.4-.89.63-1.32a14.6,14.6,0,0,1,.75-1.27c.27-.4.57-.8.88-1.18a14.67,14.67,0,0,1,1-1.1c.34-.34.71-.68,1.09-1a15.58,15.58,0,0,1,2.45-1.62c.43-.23.88-.44,1.33-.63s.91-.35,1.38-.5.95-.26,1.42-.36,1-.17,1.46-.22a16.15,16.15,0,0,1,3,0c.49.05,1,.13,1.45.22s1,.22,1.43.36.93.31,1.38.5.9.4,1.33.63.85.48,1.26.75a14.5,14.5,0,0,1,1.19.87c.38.31.75.65,1.09,1a14.67,14.67,0,0,1,1,1.1c.31.38.6.78.88,1.18a14.6,14.6,0,0,1,.75,1.27,13.2,13.2,0,0,1,.62,1.32,14.25,14.25,0,0,1,.5,1.38c.14.47.26,1,.36,1.43a14.51,14.51,0,0,1,.22,1.45,14.66,14.66,0,0,1,.07,1.48,14.46,14.46,0,0,1-.29,2.93c-.1.48-.22,1-.36,1.42a13.53,13.53,0,0,1-.5,1.39,13.2,13.2,0,0,1-.62,1.32c-.23.43-.48.86-.75,1.27s-.57.8-.88,1.18a14.67,14.67,0,0,1-1,1.1c-.34.34-.71.68-1.09,1a14.5,14.5,0,0,1-1.19.87q-.61.4-1.26.75c-.43.23-.88.44-1.33.63s-.91.35-1.38.5-.95.26-1.43.36-1,.17-1.45.22A14.66,14.66,0,0,1,255.13,264Z" />
                  </g>
                </svg>
                <span>{comments && comments.length}</span>
              </div>
              {/* Иконка репоста */}
              <div className={styles.icon_wrapper}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <title />
                  <g data-name="1" id="_1">
                    <path d="M72.86,407.49H69.13a15,15,0,0,1-15-15V282.25C54.13,201.62,119.74,136,200.37,136h50.21V70.75a15,15,0,0,1,25-11.14L451.18,217.88a15,15,0,0,1,0,22.28L275.63,398.44a15,15,0,0,1-25-11.15V322H183.65a99.52,99.52,0,0,0-96.28,74.25A15,15,0,0,1,72.86,407.49ZM183.65,292h81.93a15,15,0,0,1,15,15v46.54L418.73,229,280.58,104.47V151a15,15,0,0,1-15,15H200.37A116.37,116.37,0,0,0,84.13,282.25v56.36A129.6,129.6,0,0,1,183.65,292Z" />
                  </g>
                </svg>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalPost
        active={active}
        setActive={setActive}
        openContent={openContent}
        setOpenContent={setOpenContent}
      >
        <div className={classNames(styles.wrapper, styles.wrapper_modal)}>
          <div className={styles.content_modal}>
            {/*<div className={styles.conten}>*/}
            <div className={styles.top_modal}>
              <div className={styles.top_left_modal}>
                <img src={black} alt="" className={styles.avatar} />
                <div className={styles.top_info_modal}>
                  <div className={styles.names_modal}>
                    <p>{firstname}</p>
                    <span>@{user}</span>
                  </div>
                  <span>{formatTimeAgo(time)}</span>
                </div>
              </div>
              <div className={styles.top_right}>
                <svg
                  onClick={deleteClick}
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#cac6c2"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </div>
            </div>

            <p className={styles.post_modal}>{content}</p>
            {/*<div className={styles.bottom_line}></div>*/}

            <div className={styles.bottom}>
              {/* Иконка лайка */}
              <div
                className={classNames(styles.icon_wrapper, {
                  [styles.icon_wrapper_like]: isLike,
                })}
                onClick={(e) => handleAddLike(e)}
              >
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <title />
                  <g data-name="1" id="_1">
                    <path d="M348.45,432.7H261.8a141.5,141.5,0,0,1-49.52-8.9l-67.5-25.07a15,15,0,0,1,10.45-28.12l67.49,25.07a111.79,111.79,0,0,0,39.08,7h86.65a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30H368.9a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30h20.44a14.21,14.21,0,0,0,10.05-24.26,14.08,14.08,0,0,0-10.05-4.16,15,15,0,0,1,0-30h20.45a14.21,14.21,0,0,0,10-24.26,14.09,14.09,0,0,0-10-4.17H268.15A15,15,0,0,1,255,176.74a100.2,100.2,0,0,0,9.2-29.33c3.39-21.87-.79-41.64-12.42-58.76a12.28,12.28,0,0,0-22.33,7c.49,51.38-23.25,88.72-68.65,108a15,15,0,1,1-11.72-27.61c18.72-8,32.36-19.75,40.55-35.08,6.68-12.51,10-27.65,9.83-45C199.31,77,211,61,229.18,55.34s36.81.78,47.45,16.46c24.71,36.36,20.25,74.1,13.48,97.21H409.79a44.21,44.21,0,0,1,19.59,83.84,44.27,44.27,0,0,1-20.44,58.42,44.27,44.27,0,0,1-20.45,58.43,44.23,44.23,0,0,1-40,63Z" />
                    <path d="M155,410.49H69.13a15,15,0,0,1-15-15V189.86a15,15,0,0,1,15-15H155a15,15,0,0,1,15,15V395.49A15,15,0,0,1,155,410.49Zm-70.84-30H140V204.86H84.13Z" />
                  </g>
                </svg>
                <span>{likes}</span>
              </div>

              {/* Иконка репоста */}
              <div className={styles.icon_wrapper}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <title />
                  <g data-name="1" id="_1">
                    <path d="M72.86,407.49H69.13a15,15,0,0,1-15-15V282.25C54.13,201.62,119.74,136,200.37,136h50.21V70.75a15,15,0,0,1,25-11.14L451.18,217.88a15,15,0,0,1,0,22.28L275.63,398.44a15,15,0,0,1-25-11.15V322H183.65a99.52,99.52,0,0,0-96.28,74.25A15,15,0,0,1,72.86,407.49ZM183.65,292h81.93a15,15,0,0,1,15,15v46.54L418.73,229,280.58,104.47V151a15,15,0,0,1-15,15H200.37A116.37,116.37,0,0,0,84.13,282.25v56.36A129.6,129.6,0,0,1,183.65,292Z" />
                  </g>
                </svg>
                <span>0</span>
              </div>
            </div>
            {/*</div>*/}
            {/*Комментарии*/}
            <div className={styles.comments}>
              {comments &&
                comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} postId={id} />
                ))}
            </div>
            {/*Поле ввода комментариев*/}
            <div className={styles.comment_field}>
              <CommentField id={id} />
            </div>
          </div>
        </div>
      </ModalPost>
    </>
  );
};
