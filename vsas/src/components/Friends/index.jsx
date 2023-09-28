import { useQuery } from "@tanstack/react-query";
import styles from "./friends.module.scss";
import { getMyFriendsFetch } from "../../api/friendsApi";
import { Friend } from "./Friend";

//список друзей
export const Friends = () => {
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

  return (
    <div className={styles.friends}>
      <div className={styles.friends_top}>
        <p>Друзья</p>
        <span>{friends ? friends.length : 0}</span>
      </div>
      <div className={styles.friends_bottom_line}></div>
      {friends &&
        friends.map((friend) => <Friend key={friend.id} friend={friend} />)}
    </div>
  );
};
