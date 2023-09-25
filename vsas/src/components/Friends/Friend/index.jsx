import styles from "./friend.module.scss";
import black from "../../../assets/icons/black.jpeg";

export const Friend = ({ friend }) => {
  return (
    <div className={styles.friends_list}>
      <div className={styles.friend}>
        <img src={black} alt="" />
        <p>{friend.first_name}</p>
      </div>
    </div>
  );
};
