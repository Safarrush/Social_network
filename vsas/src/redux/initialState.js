export const initialData = {
  token: "",
  friends: {
    list: [],
    application: [],
  },
};

export const getInitialData = () => {
  const data = localStorage.getItem("reduxStore");
  return data ? JSON.parse(data) : initialData;
};
//забираем данные из ls, если они есть. Если их нет, то забираем данны из initialData
