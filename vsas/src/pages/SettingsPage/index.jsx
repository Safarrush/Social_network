import { useNavigate } from "react-router-dom";
import styles from "./settingspage.module.scss";

import { logOutFetch } from "../../api";
import { useAuth } from "../../hooks/useAuth";

export const SettingsPage = () => {
  useAuth();
  const navigate = useNavigate();
  const handleClick = async () => {
    await logOutFetch();

    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleClick} className={styles.button}>
        Выйти
      </button>
    </div>
  );
};
