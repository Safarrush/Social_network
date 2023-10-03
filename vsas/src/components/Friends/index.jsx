import { useQuery } from "@tanstack/react-query";
import styles from "./friends.module.scss";
import { getMyFriendsFetch } from "../../api/friendsApi";
import { Friend } from "./Friend";
import { useState } from "react";
import classNames from "classnames";

//список друзей
export const Friends = () => {
  const [showAll, setShowAll] = useState(false);

  //получить всех друзей
  const { data: friends = [] } = useQuery({
    queryKey: ["getMyfriends"],
    queryFn: async () => {
      const res = await getMyFriendsFetch();
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

  const displayedFriends =
    showAll && Array.isArray(friends) ? friends : friends.slice(0, 4);
  console.log(displayedFriends);
  return (
    <div className={styles.friends}>
      <div className={styles.friends_top}>
        <p>Друзья</p>
        <span>{friends ? friends.length : 0}</span>
      </div>
      <div className={styles.friends_bottom_line}></div>

      <div
        className={classNames(styles.friends_list, {
          [styles["show_all"]]: showAll,
        })}
      >
        {friends &&
          displayedFriends.map((friend) => (
            <Friend key={friend.id} friend={friend} />
          ))}
      </div>

      {friends && friends.length > 4 ? (
        !showAll && friends ? (
          <svg
            onClick={() => setShowAll(true)}
            className="feather feather-chevron-down"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : (
          <svg
            onClick={() => setShowAll(false)}
            className="feather feather-chevron-up"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        )
      ) : (
        ""
      )}
    </div>
  );
};
