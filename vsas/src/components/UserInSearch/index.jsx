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
import { Spinner } from "../Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  //clearApplication,
  deleteApplication,
  setApplication,
} from "../../redux/slices/friends";

export const UserInSearch = ({ name, id }) => {
  const dispatch = useDispatch();
  const application = useSelector((state) => state.friends.application);

  //получить список друзей
  const { data: friends } = useQuery({
    queryKey: ["getMyfriends"],
    queryFn: async () => {
      const res = await getMyFriendsFetch();
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

  //запрос на добавление в друзья
  const { mutateAsync, error, isError, isLoading } = useMutation({
    mutationFn: async (id) => {
      await addFriendFetch(id);
    },
  });
  if (isLoading) return <Spinner />;
  if (isError) return error;

  //отправить заявку
  const handleAddFriend = async () => {
    mutateAsync(id);
    const res = await applicationGoneFetch(id);
    if (res.ok) {
      dispatch(setApplication({ id: id, application: true }));
    }
    //dispatch(clearApplication()) //очистка запросов в случае ошибок;
  };

  //отменить заяку
  const handleCancelApplication = async () => {
    const res = await cancelApplicationFetch(id);
    if (res.ok) {
      dispatch(deleteApplication(id));
      //dispatch(clearApplication()) //очистка запросов в случае ошибок;
    }
  };

  //удалить друга
  const deleteFriend = async () => {
    const res = await deleteFriendFetch(id);
    if (res.ok) {
      console.log("Друг удален");
    }
  };

  return (
    <div className={styles.user_wrapper}>
      <div className={styles.user}>
        <div className={styles.left}>
          <img src={black} alt="" className={styles.avatar} />
          <p className={styles.name}>{name}</p>
        </div>
        <div className={styles.right}>
          {friends && friends.some((friend) => friend.id === id) ? (
            //кнопка удаления
            <button onClick={deleteFriend}>Удалить из друзей</button>
          ) : application.some((app) => app.id === id) ? (
            //кнопка отмены
            <button onClick={handleCancelApplication}>Отменить заявку</button>
          ) : (
            //кнопка добавления
            <button onClick={handleAddFriend}>Добавить в друзья</button>
          )}
        </div>
      </div>
      <div className={styles.bottom_line}></div>
    </div>
  );
};
