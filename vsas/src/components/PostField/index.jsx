import React, { useRef, useState } from "react";
import styles from "./postfield.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostFetch } from "../../api";
import { Spinner } from "../Spinner";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useClickOutSide } from "../../hooks/useClickOutside";

export const PostField = () => {
  const [post, setPost] = useState("");
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const emojiRef = useRef(null);
  const queryClient = useQueryClient();

  //закрывать эмодзи при кликке не на них
  useClickOutSide(emojiRef, () => {
    if (visibleEmoji) setTimeout(() => setVisibleEmoji(false), 50);
  });

  //создать пост
  const { mutateAsync, error, isError, isLoading, isSuccess } = useMutation({
    mutationFn: async (values) => {
      const res = await createPostFetch(values);
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
  if (isLoading) return <Spinner />;

  //Опубликовать пост
  const handleSubmit = (e) => {
    e.preventDefault();
    mutateAsync({ content: post });
    setPost("");
  };

  //Показать окно с эмодзи
  const showEmoji = () => {
    setTimeout(() => {
      setVisibleEmoji(true);
    }, 200);
  };
  //Скрыть окно с эмодзи
  const hideEmoji = () => {
    setTimeout(() => {
      setVisibleEmoji(false);
    }, 500);
  };

  //добавление эмо в строку
  const addEmoji = (e) => {
    setPost((prev) => prev + e.native);
  };

  return (
    <>
      <div className={styles.field}>
        <form type="submit" onSubmit={(e) => handleSubmit(e)}>
          <TextareaAutosize
            className={styles.textarea}
            minRows={1} // Минимальное количество строк
            maxRows={20} // Максимальное количество строк
            placeholder="Что нового?"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
          <div className={styles.bottom_line}></div>
          <div className={styles.field_bottom}>
            <button type="submit" className={styles.post_btn}>
              Опубликовать пост
            </button>

            <svg
              onClick={showEmoji}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
            <svg
              fill="none"
              height="28"
              viewBox="0 0 28 28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4797 4.15793C14.6095 0.833113 19.0267 -0.132589 22.3457 2.00098C25.6648 4.13454 26.6288 8.55944 24.4989 11.8843L22.6498 10.6956C24.1243 8.39379 23.4569 5.3304 21.1591 3.85332C18.8614 2.37624 15.8033 3.0448 14.3288 5.3466L12.4797 4.15793Z"
                fill="#cac6c2"
              />
              <path
                d="M14.3278 5.34752L5.1311 19.7042C4.14959 21.2384 4.5946 23.2789 6.12591 24.263C7.65789 25.2475 9.69685 24.8018 10.68 23.2674L13.0534 19.5629L13.0519 19.5619L18.9849 10.3002L18.9863 10.3012C19.4777 9.53391 19.2553 8.51284 18.4894 8.0205C17.7234 7.52814 16.7041 7.751 16.2126 8.51826L16.2111 8.51733L11.5 16.001C11.2118 16.4509 10.6138 16.5814 10.1643 16.2925L9.94284 16.1501C9.49339 15.8612 9.36268 15.2622 9.65088 14.8123L14.3621 7.32857L14.3635 7.3295C15.5104 5.53929 17.8888 5.01934 19.676 6.16816C21.4631 7.317 21.9822 9.69964 20.8354 11.4899L20.8339 11.489L18.4613 15.1927L18.4632 15.1939L12.5297 24.4564C10.891 27.0135 7.49232 27.756 4.93909 26.1152C2.38578 24.4743 1.64432 21.071 3.28299 18.5136L12.4787 4.15885L14.3278 5.34752Z"
                fill="#cac6c2"
              />
              <path
                d="M15.4516 23.7222C15.0022 23.4333 14.8715 22.8343 15.1597 22.3844L22.6473 10.6957L24.4965 11.8844L17.0088 23.5731C16.7206 24.023 16.1226 24.1535 15.6731 23.8646L15.4516 23.7222Z"
                fill="#cac6c2"
              />
            </svg>
          </div>
        </form>

        <div className={styles.emoji} onMouseLeave={hideEmoji} ref={emojiRef}>
          {visibleEmoji && (
            <Picker
              data={data}
              onEmojiSelect={(e) => addEmoji(e)}
              locale="ru"
              previewPosition={"none"}
              perLine={8}
              theme={"light"}
            />
          )}
        </div>
      </div>
    </>
  );
};
