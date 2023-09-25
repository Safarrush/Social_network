import black from "../../assets/icons/black.jpeg";
import chat from "../../assets/icons/chat.svg";
import styles from "./modalfrinds.module.scss";

export const ModalFriends = () => {
  return (
    <div className={styles.friends_wrapper}>
      <div className={styles.friend}>
        <div className={styles.friend_info}>
          <img src={black} alt="black" className={styles.black} />
          <p className={styles.friend_name}>Рушан Сафаргалеев</p>
        </div>
        <img
          src={chat}
          alt=""
          className={styles.chat}
          data-tooltip="Написать сообщение"
        />
      </div>
      <div className={styles.bottom_line}></div>

      <div className={styles.friend}>
        <div className={styles.friend_info}>
          <img src={black} alt="black" className={styles.black} />
          <p className={styles.friend_name}>Владислав Калугин</p>
        </div>
        <img src={chat} alt="" className={styles.chat} />
      </div>
      <div className={styles.bottom_line}></div>

      <div className={styles.friend}>
        <div className={styles.friend_info}>
          <img src={black} alt="black" className={styles.black} />
          <p className={styles.friend_name}>Артур Айбатов</p>
        </div>
        <img src={chat} alt="" className={styles.chat} />
      </div>
      <div className={styles.bottom_line}></div>

      <div className={styles.friend}>
        <div className={styles.friend_info}>
          <img src={black} alt="black" className={styles.black} />
          <p className={styles.friend_name}>Сид Вишес</p>
        </div>
        <img src={chat} alt="" className={styles.chat} />
      </div>
      <div className={styles.bottom_line}></div>
    </div>
  );
};
