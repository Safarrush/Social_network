import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../Spinner";
import { getPostsFetch } from "../../api";
import { Post } from "./Post";
import { EmptyWall } from "./EmptyWall/index";

export const Posts = () => {
  //Получить все посты
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getPosts"],
    options: {
      keepPreviousData: true,
    },
    queryFn: async () => {
      const res = await getPostsFetch();
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

  if (isError) return <>{error}</>;

  return (
    <>
      {data ? (
        data.length ? (
          data.map((post) => (
            <Post
              key={post.id}
              content={post.content}
              likes={post.total_likes}
              id={post.id}
              isLike={post.is_fan}
              user={post.user}
              time={post.timestamp}
              firstname={post.user_first_name}
            />
          ))
        ) : (
          <EmptyWall />
        )
      ) : isLoading ? (
        //<Spinner />
        ""
      ) : (
        <EmptyWall />
      )}
    </>
  );
};
