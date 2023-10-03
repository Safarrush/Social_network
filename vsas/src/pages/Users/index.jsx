import styles from "./users.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { getUsers } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../components/Spinner";
import { UserInSearch } from "../../components/UserInSearch";

export const Users = () => {
  const { token } = useAuth();

  //получить список всех пользователей
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getUsers", token],
    queryFn: async () => {
      const res = await getUsers();
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });
  if (isLoading) return <Spinner />;
  if (isError) return error;
  console.log(data);
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.users_count}>
          <p>Люди</p>
          <span>{data.length}</span>
        </div>
        <div className={styles.bottom_line}></div>
        <div className={styles.search_wrapper}>
          <input
            type="text"
            className={styles.search}
            placeholder="Введите запрос"
          />
          {/*<img src={search} alt="Найти" className={styles.search_icon} />*/}
        </div>
        {data.map((user) => (
          <UserInSearch
            key={user.username}
            name={user.first_name + " " + user.last_name}
            id={user.id}
            username={user.username}
            className={styles.user}
          />
        ))}
      </div>
    </div>
  );
};
