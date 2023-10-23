import styles from "./profile.module.scss";
import black from "../../assets/icons/black.jpeg";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { Posts } from "../../components/Posts";
import { PostField } from "../../components/PostField";
import { Friends } from "../../components/Friends";
import { getMe } from "../../api";
import { useDispatch } from "react-redux";
import { setMe } from "../../redux/slices/me";

export const Profile = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getMyData", token],
    queryFn: async () => {
      const res = await getMe();
      if (res.ok) {
        const responce = await res.json();
        const myData = {
          email: responce.email,
          first_name: responce.first_name,
          last_name: responce.last_name,
          username: responce.username,
        };
        dispatch(setMe(myData));
        return responce;
      }
    },
  });

  if (isError)
    return (
      <p>
        {error}, {data}
      </p>
    );
  if (isLoading) return <Spinner />;

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
        <Friends loading={isLoading} />
        <PostField className={styles.field} loading={isLoading} />
        <Posts
          className={styles.wall}
          username={data.username}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
