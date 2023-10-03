import styles from "./friend.module.scss";
import black from "../../../assets/icons/black.jpeg";
import { Link } from "react-router-dom";

export const Friend = ({ friend }) => {
  return (
    <Link to={`/profile/${friend.username}`}>
      <div className={styles.friend}>
        <img src={black} alt="" />
        <p>{friend.first_name}</p>
      </div>
    </Link>
  );
};
