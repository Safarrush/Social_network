export const signUpFetch = (values) => {
  return fetch("http://127.0.0.1:8000/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
};

export const signInFetch = (values) => {
  return fetch("http://127.0.0.1:8000/api/auth/token/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
};

export const logOutFetch = () => {
  const token = localStorage.getItem("TOKEN");
  return fetch("http://127.0.0.1:8000/api/auth/token/logout", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const createPostFetch = (values) => {
  const token = localStorage.getItem("TOKEN");
  return fetch("http://127.0.0.1:8000/api/vsas/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(values),
  });
};

export const getPostsFetch = () => {
  const token = localStorage.getItem("TOKEN");
  return fetch("http://127.0.0.1:8000/api/vsas/posts/my/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

export const deletePostFetch = (id) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(
    `http://127.0.0.1:8000/api/vsas/posts/${id}/delete/
  `,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
};
export const addLikeFetch = (id) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(`http://127.0.0.1:8000/api/vsas/posts/${id}/like/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const deleteLikeFetch = (id) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(`http://127.0.0.1:8000/api/vsas/posts/${id}/unlike/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const getMe = () => {
  const token = localStorage.getItem("TOKEN");

  return fetch("http://127.0.0.1:8000/api/profile/me/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const getUsers = () => {
  const token = localStorage.getItem("TOKEN");

  return fetch("http://127.0.0.1:8000/api/profile/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const getUserProfile = (username) => {
  const token = localStorage.getItem("TOKEN");
  return fetch(`http://127.0.0.1:8000/api/profile/${username}/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};
