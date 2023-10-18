import styles from "./userinsearch.module.scss";
import black from "../../assets/icons/black.jpeg";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addFriendFetch,
  cancelApplicationFetch,
  deleteFriendFetch,
  getMyFriendsFetch,
} from "../../api/friendsApi/index";
import { applicationGoneFetch } from "../../api/friendsApi/index.js";

import { useDispatch, useSelector } from "react-redux";
import {
  clearApplication,
  deleteApplication,
  setApplication,
} from "../../redux/slices/friends";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const UserInSearch = ({ name, id, username }) => {
  const dispatch = useDispatch();
  const application = useSelector((state) => state.friends.application);

  //получить список друзей
  const { data: friends, refetch } = useQuery({
    queryKey: ["getMyfriends"],
    queryFn: async () => {
      const res = await getMyFriendsFetch();
      if (res.ok) {
        const responce = await res.json();

        return responce;
      }
    },
  });

  //Удаляю из редакса заявку, если она была принята или отклонена
  useEffect(() => {
    const checkTheApplication = async () => {
      const res = await applicationGoneFetch();
      if (res.ok) {
        const responce = await res.json();

        if (responce.length === 0) {
          dispatch(clearApplication());
        }
        responce.forEach((el) => {
          if (el.is_pending === false) {
            dispatch(deleteApplication(el.recipient));
          }
        });
      }
    };
    checkTheApplication();
  }, [dispatch]);

  //удалить друга
  const deleteFriend = async () => {
    const res = await deleteFriendFetch(id);
    if (res.ok) {
      //перевызваю friends для отображения отображения кнопки "добавить в друзья"
      await refetch();
    }
  };
  //запрос на добавление в друзья
  const { mutateAsync } = useMutation({
    mutationFn: async (id) => {
      await addFriendFetch(id);
    },
  });
  //отправить заявку
  const handleAddFriend = async () => {
    mutateAsync(id);
    setTimeout(async () => {
      const res = await applicationGoneFetch();
      if (res.ok) {
        const responce = await res.json();
        const app = responce.find((el) => el.recipient === id);
        dispatch(
          setApplication({
            recepient: id,
            id: app.id,
            application: app.is_pending,
          })
        );
      }
    }, 50);
    //dispatch(clearApplication()); //очистка запросов в случае ошибок;
  };

  //отменить заяку
  const handleCancelApplication = async () => {
    const res = await cancelApplicationFetch(id);
    if (res.ok) {
      dispatch(deleteApplication(id));
    }
  };

  //состояние размера экрана
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.user_wrapper}>
      <div className={styles.user}>
        <Link to={`/profile/${username}`}>
          <div className={styles.left}>
            <img src={black} alt="" className={styles.avatar} />
            <p className={styles.name}>{name}</p>
          </div>
        </Link>
        {windowWidth > 768 && (
          <div className={styles.right}>
            {friends &&
            friends.length &&
            friends.some((friend) => friend.id === id) ? (
              //кнопка удаления
              <button onClick={() => deleteFriend()} className={styles.delete}>
                Удалить из друзей
              </button>
            ) : application.some((app) => app.recepient === id) ? (
              //кнопка отмены
              <button onClick={() => handleCancelApplication()}>
                Отменить заявку
              </button>
            ) : (
              //кнопка добавления
              <button onClick={() => handleAddFriend()} className={styles.add}>
                Добавить в друзья
              </button>
            )}
          </div>
        )}
        {windowWidth <= 768 && (
          <div className={styles.right}>
            {friends &&
            friends.length &&
            friends.some((friend) => friend.id === id) ? (
              //кнопка удлаения
              <svg
                className={styles.delete_icon}
                onClick={() => deleteFriend()}
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            ) : application.some((app) => app.recepient === id) ? (
              //кнопка отмены

              <svg
                className={styles.cancel_icon}
                onClick={() => handleCancelApplication()}
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
              </svg>
            ) : (
              //кнопка добавления

              <svg
                onClick={() => handleAddFriend()}
                className={styles.add_icon}
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="heroicon-ui"
                  d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      <div className={styles.bottom_line}></div>
    </div>
  );
};
