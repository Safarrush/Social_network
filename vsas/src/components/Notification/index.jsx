import {
  acceptFriendshipFetch,
  rejectFriendshipFetch,
} from "../../api/friendsApi";
import styles from "./notification.module.scss";
import { useMutation } from "@tanstack/react-query";

export const Notification = ({ data, refetch }) => {
  //принять заявку в друзья
  const { mutateAsync, isError, error } = useMutation({
    mutationFn: async (sender) => {
      const res = await acceptFriendshipFetch(sender);
      if (res.ok) {
        console.log(res, "Друг добавлен");
      }
    },
  });
  if (isError) return error;

  //приняь заявку
  const handleAccept = async (sender) => {
    await mutateAsync(sender);
    await refetch();
  };

  // отклонить заявку в друзья
  const handleReject = async (sender) => {
    await rejectFriendshipFetch(sender);
    await refetch();
  };

  return (
    <div className={styles.notifications}>
      {data.is_pending === true && (
        <div className={styles.notification_wrapper}>
          <p className={styles.notification}>
            <span>
              {data.first_name} {data.last_name}
            </span>{" "}
            хочет добавить вас в друзья
          </p>
          <div className={styles.buttons}>
            <button
              className={styles.accept}
              onClick={() => handleAccept(data.sender)}
            >
              Принять
            </button>
            <button
              className={styles.reject}
              onClick={() => handleReject(data.sender)}
            >
              Отклонить
            </button>
          </div>
        </div>
      )}

      <div className={styles.bottom_line}></div>
    </div>
  );
};
