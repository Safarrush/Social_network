export const getCommentsFetch = (id) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(`http://127.0.0.1:8000/api/vsas/posts/${id}/comment/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

export const createCommentFetch = (commentData) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(
    `http://127.0.0.1:8000/api/vsas/posts/${commentData.id}/comment/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(commentData),
    }
  );
};

export const editCommentFetch = (id, values) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(`http://127.0.0.1:8000/api/vsas/posts/${id}/comment/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(values),
  });
};

export const deleteCommentFetch = (values) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(
    `http://127.0.0.1:8000/api/vsas/posts/${values.postId}/comment/${values.commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );
};

//http://127.0.0.1:8000/api/vsas/posts/15/comment/43/
