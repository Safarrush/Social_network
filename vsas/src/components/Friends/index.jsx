import { useQuery } from "@tanstack/react-query";
import styles from "./friends.module.scss";
import { getMyFriendsFetch } from "../../api/friendsApi";
import { Friend } from "./Friend";
import { useEffect, useRef, useState } from "react";
import FriendsSkeleton from "./FriendsSkeleton";

//список друзей
export const Friends = ({ loading }) => {
  const [showAll, setShowAll] = useState(false);
  const [contentHeight, setContentHeight] = useState(180);

  const friendsRef = useRef(null);

  //получить всех друзей
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["getMyfriends"],
    queryFn: async () => {
      const res = await getMyFriendsFetch();
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

  //отображаемы друзья в зависимости от разворачивания/сворачивания блока
  const displayedFriends =
    showAll && Array.isArray(friends) && friends.length > 4
      ? friends
      : friends.slice(0, 4);

  //получить высоту блока с друзьями
  useEffect(() => {
    if (friendsRef.current && showAll) {
      // Получаем высоту содержимого
      const newHeight = friendsRef.current.scrollHeight;
      // Устанавливаем новую высоту
      setContentHeight(newHeight - 30);
    } else {
      // Возвращаем начальную высоту
      setContentHeight(180);
    }
  }, [showAll]);

  return (
    <>
      <div
        className={styles.friends}
        ref={friendsRef}
        style={{
          height: showAll ? `${contentHeight}px` : "250px",
        }}
      >
        <div className={styles.friends_top}>
          <p>Друзья</p>
          <span>{friends ? friends.length : 0}</span>
        </div>
        <div className={styles.friends_bottom_line}></div>

        <div>
          {isLoading ? (
            <div className={styles.friends_list}>
              <FriendsSkeleton />
              <FriendsSkeleton />
              <FriendsSkeleton />
              <FriendsSkeleton />
            </div>
          ) : friends && friends.length ? (
            <div className={styles.friends_list}>
              {friends &&
                displayedFriends.map((friend) => (
                  <Friend key={friend.id} friend={friend} />
                ))}
            </div>
          ) : (
            <p className={styles.no_friends}>Список друзей пуст</p>
          )}
        </div>

        {friends && friends.length > 4 ? (
          !showAll && friends ? (
            <svg
              onClick={() => setShowAll(true)}
              className={styles.arrow}
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
              className={styles.arrow}
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
    </>
  );
};
