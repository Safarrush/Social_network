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
                id="svg8"
                version="1.1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs id="defs2" />
                <g id="g1854" transform="translate(0,-290.65039)">
                  <path
                    d="m 12,292.65039 c -5.511,0 -10,4.489 -10,10 0,5.511 4.489,10 10,10 5.511,0 10,-4.489 10,-10 0,-5.511 -4.489,-10 -10,-10 z m 0,2 c 4.43012,0 8,3.56988 8,8 0,4.43012 -3.56988,8 -8,8 -4.43012,0 -8,-3.56988 -8,-8 0,-4.43012 3.56988,-8 8,-8 z"
                    id="circle1840"
                  />
                  <path
                    d="m 15.70679,298.94321 a 1,1 0 0 0 -1.41422,0 L 12,301.23579 9.70743,298.94321 a 1,1 0 0 0 -1.41422,0 1,1 0 0 0 0,1.41422 l 2.29258,2.29257 -2.29258,2.29257 a 1,1 0 0 0 0,1.41422 1,1 0 0 0 1.41422,0 L 12,304.06421 l 2.29258,2.29258 a 1,1 0 0 0 1.41421,0 1,1 0 0 0 0,-1.41422 l -2.29258,-2.29257 2.29258,-2.29257 a 1,1 0 0 0 0,-1.41422 z"
                    id="path1842"
                  />
                </g>
              </svg>
            ) : application.some((app) => app.recepient === id) ? (
              //кнопка отмены

              <svg
                className={styles.cancel_icon}
                id="svg8"
                version="1.1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs id="defs2" />
                <g id="g1871" transform="translate(0,-290.65039)">
                  <path
                    d="m 12,292.65039 c -5.511,0 -10,4.489 -10,10 0,5.511 4.489,10 10,10 5.511,0 10,-4.489 10,-10 0,-5.511 -4.489,-10 -10,-10 z m 0,2 c 4.43012,0 8,3.56988 8,8 0,4.43012 -3.56988,8 -8,8 -4.43012,0 -8,-3.56988 -8,-8 0,-4.43012 3.56988,-8 8,-8 z"
                    id="circle1856"
                  />
                  <path
                    d="m 15.20508,299.04492 -3.87695,5.08789 -2.61915,-2.6289 c -0.3894,-0.39153 -1.02245,-0.39332 -1.41406,-0.004 -0.3915,0.38943 -0.39325,1.02247 -0.004,1.41406 l 3.42969,3.44141 c 0.42787,0.42948 1.13641,0.38256 1.50391,-0.0996 l 4.57031,-6 c 0.33395,-0.43914 0.24918,-1.06577 -0.18945,-1.40039 -0.43349,-0.3094 -1.0354,-0.26926 -1.40039,0.18953 z"
                    id="path1867"
                  />
                </g>
              </svg>
            ) : (
              //кнопка добавления
              <svg
                className={styles.add_icon}
                id="svg8"
                version="1.1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs id="defs2" />
                <g id="g1829" transform="translate(0,-290.65039)">
                  <path
                    d="m 12,292.65039 c -5.511,0 -10,4.489 -10,10 0,5.511 4.489,10 10,10 5.511,0 10,-4.489 10,-10 0,-5.511 -4.489,-10 -10,-10 z m 0,2 c 4.43012,0 8,3.56988 8,8 0,4.43012 -3.56988,8 -8,8 -4.43012,0 -8,-3.56988 -8,-8 0,-4.43012 3.56988,-8 8,-8 z"
                    id="path1820"
                  />
                  <path
                    d="m 12,297.65 a 1,1 0 0 0 -1,1 v 3 H 8 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 3 v 3 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -3 h 3 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 h -3 v -3 a 1,1 0 0 0 -1,-1 z"
                    id="path1822"
                  />
                </g>
              </svg>
            )}
          </div>
        )}
      </div>
      <div className={styles.bottom_line}></div>
    </div>
  );
};
