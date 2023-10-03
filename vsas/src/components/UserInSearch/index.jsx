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
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const UserInSearch = ({ name, id, username }) => {
  const dispatch = useDispatch();
  const application = useSelector((state) => state.friends.application);
  //console.log("applicationInRedux", application);

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
  //console.log("friends", friends);

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
        //console.log("Заявки ушли", responce);
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

  return (
    <div className={styles.user_wrapper}>
      <div className={styles.user}>
        <Link to={`/profile/${username}`}>
          <div className={styles.left}>
            <img src={black} alt="" className={styles.avatar} />
            <p className={styles.name}>{name}</p>
          </div>
        </Link>
        <div className={styles.right}>
          {friends &&
          friends.length &&
          friends.some((friend) => friend.id === id) ? (
            //кнопка удаления
            <button onClick={() => deleteFriend()}>Удалить из друзей</button>
          ) : application.some((app) => app.recepient === id) ? (
            //кнопка отмены
            <button onClick={() => handleCancelApplication()}>
              Отменить заявку
            </button>
          ) : (
            //кнопка добавления
            <button onClick={() => handleAddFriend()}>Добавить в друзья</button>
          )}
        </div>
      </div>
      <div className={styles.bottom_line}></div>
    </div>
  );
};
