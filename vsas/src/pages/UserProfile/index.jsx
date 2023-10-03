import styles from "./userprofile.module.scss";
import black from "../../assets/icons/black.jpeg";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { getUserProfile } from "../../api";
import { Spinner } from "../../components/Spinner";
import { Friends } from "../../components/Friends";
import { Posts } from "../../components/Posts";
import { useParams } from "react-router-dom";

export const UserProfile = () => {
  const { token } = useAuth();
  const { username } = useParams();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getUserData", token],
    queryFn: async () => {
      const res = await getUserProfile(username);
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });
  if (isLoading) return <Spinner />;
  if (isError) return error;

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <img src={black} alt="" className={styles.avatar} />

        <div className={styles.info}>
          <p className={styles.username}>@{data.username}</p>
          <p className={styles.name}>
            {data.first_name} {data.last_name}
          </p>
        </div>
        <Friends />
        <Posts className={styles.wall} username={data.username} />
      </div>
    </div>
  );
};
