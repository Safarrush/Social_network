import { useNavigate } from "react-router-dom";
import styles from "./settingspage.module.scss";

import { editDataFetch, getMe, logOutFetch, setPassword } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../components/Modal";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TooltipForSettings from "../../components/TooltipFotSettings";
import { queryClient } from "../..";
import { Spinner } from "../../components/Spinner";

export const SettingsPage = () => {
  const { token } = useAuth();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const [editCurrentField, setEditCurrentField] = useState();
  const [active, setActive] = useState(false);
  const [openContent, setOpenContent] = useState(false);
  const customStyles = {
    backgroundColor: "#000",
    borderRadius: "10px",
  };
  const notify = () =>
    toast("Данные обновлены!", {
      style: customStyles,
    });
  //const me = useSelector((state) => state.me.me);
  const navigate = useNavigate();

  //запрос для вывода информации
  const { data: me, isLoading } = useQuery({
    queryKey: ["getMyData", token],
    queryFn: async () => {
      const res = await getMe();
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

  //поля для изменения
  const fields = [
    //Имя
    {
      value: me && me.first_name,
      label: "Имя :",
      modal_label: "имя",
      name: "first_name",

      rules: {
        required: "* Обязательное поле.",

        pattern: {
          value: /^[а-яА-Яa-zA-Z]+$/,
          message: "* Некорректное имя.",
        },
      },
      type: "text",
    },
    //Фамилия
    {
      value: me && me.last_name,
      label: "Фамилия :",
      modal_label: "фамилию",
      name: "last_name",

      rules: {
        required: "* Обязательное поле.",

        pattern: {
          value: /^[а-яА-Яa-zA-Z]+$/,
          message: "* Некорректная фамилия.",
        },
      },
      type: "text",
    },

    //Юзернейм
    {
      value: me && "@" + me.username,
      label: "Юзернейм :",
      modal_label: "юзернейм",
      name: "username",

      rules: {
        required: "* Обязательное поле.",

        minLength: {
          value: 3,
          message: "* Некорректное имя пользователя.",
        },
        pattern: {
          value: /^[a-zA-Z0-9]+$/,
          message: "* Некорректное имя пользователя.",
        },
      },
      type: "text",
    },

    //E-mail
    {
      value: me && me.email,
      label: "E-mail :",
      modal_label: "e-mail",
      name: "email",

      rules: {
        required: "* Обязательное поле.",

        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: "* Неверный формат эл. почты!",
        },
      },
      type: "email",
    },

    //Пароль
    {
      value: "*********",
      label: "Пароль :",
      modal_label: "пароль",
      name: "password",
    },
  ];

  //Зпрос на изменение информации
  const { mutateAsync: mutateData } = useMutation({
    mutationFn: async (values) => {
      const res = await editDataFetch(values);
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

  //Зпрос на изменение пароля
  const { mutateAsync: mutatePassword } = useMutation({
    mutationFn: async (values) => {
      const res = await setPassword(values);
      if (res.ok) {
        console.log("res", res);
      }
    },
  });

  //открыть модалку для редактирвоания
  const handleEditClick = (field) => {
    document.body.classList.add("bodyModalOpen");
    const currentField = {
      value: field.value,
      label: field.label,
      modal_label: field.modal_label,
      name: field.name,
      rules: field.rules,
      type: field.type,
    };
    setEditCurrentField(currentField);
    //}
    setActive(true);
    setTimeout(() => {
      setOpenContent(true);
    }, 100);
  };

  //Сохранение инфы-отправка на сервер
  const handleSaveClick = async () => {
    const formValues = getValues();
    if (editCurrentField && editCurrentField.name === "password") {
      await mutatePassword(formValues);
    } else {
      await mutateData(formValues, {
        onSuccess: () => queryClient.invalidateQueries(["getMyData", token]),
      });
    }

    setOpenContent(false);
    setActive(false);
    setEditCurrentField("");
    document.body.classList.remove("bodyModalOpen");
    notify();
  };

  //закрытие модалки
  const handleCloseModal = () => {
    setOpenContent(false);
    setActive(false);
    setEditCurrentField("");

    document.body.classList.remove("bodyModalOpen");
  };

  //выход из приложения
  const handleLogOutClick = async () => {
    await logOutFetch();
    localStorage.clear();
    navigate("/");
  };

  //состояния для первого поля пароля
  const [passwordType1, setPasswordType1] = useState("password");
  const [passwordIcon1, setPasswordIcon1] = useState("show");
  //состояния для второго поля пароля
  const [passwordType2, setPasswordType2] = useState("password");
  const [passwordIcon2, setPasswordIcon2] = useState("show");

  //переключение для первого поля пароля
  const switchPasswordType1 = () => {
    if (passwordType1 === "password") {
      setPasswordType1("text");
      setPasswordIcon1("hide");
    }
    if (passwordType1 === "text") {
      setPasswordType1("password");
      setPasswordIcon1("show");
    }
  };

  //переключение для второго поля пароля
  const switchPasswordType2 = () => {
    if (passwordType2 === "password") {
      setPasswordType2("text");
      setPasswordIcon2("hide");
    }
    if (passwordType2 === "text") {
      setPasswordType2("password");
      setPasswordIcon2("show");
    }
  };
  if (isLoading) return <Spinner />;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.actions}>
          <div className={styles.bottom_line}></div>
          {fields.map((field) => (
            <div key={field.name}>
              <div className={styles.action}>
                <span>{field.label}</span>

                <p className={styles.info}>{field.value}</p>
                <div className={styles.edit}>
                  <TooltipForSettings text={"Изменить"}>
                    <svg
                      onClick={() => handleEditClick(field)}
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </TooltipForSettings>
                </div>
              </div>

              <div className={styles.bottom_line}></div>
            </div>
          ))}
          <div className={styles.button_wrapper}>
            <button
              type="button"
              onClick={handleLogOutClick}
              className={styles.button}
            >
              Выйти
            </button>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>

      <Modal
        active={active}
        setActive={setActive}
        openContent={openContent}
        setOpenContent={setOpenContent}
        handleCloseModal={handleCloseModal}
      >
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit(handleSaveClick)}>
            <div>
              <label className={styles.label}>
                Сменить {editCurrentField && editCurrentField.modal_label}
              </label>

              <div className={styles.password_fields}>
                {editCurrentField && editCurrentField.name !== "password" ? (
                  <Controller
                    name={editCurrentField && editCurrentField.name}
                    control={control}
                    defaultValue={""}
                    rules={editCurrentField && editCurrentField.rules}
                    render={({ field }) => (
                      <div className={styles.input_wrapper}>
                        <input
                          name={editCurrentField && editCurrentField.name}
                          type={editCurrentField && editCurrentField.type}
                          placeholder={
                            editCurrentField && editCurrentField.value
                          }
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {editCurrentField && errors[editCurrentField.name] && (
                          <p className={styles.error}>
                            {" "}
                            {editCurrentField &&
                              errors[editCurrentField.name].message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                ) : (
                  <div>
                    <Controller
                      name="current_password"
                      control={control}
                      defaultValue={""}
                      rules={{
                        required: "* Обязательное поле.",
                      }}
                      render={({ field }) => (
                        <div className={styles.input_wrapper}>
                          <input
                            type={passwordType1}
                            name="current_password"
                            placeholder="Текущий пароль"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          {field.value && field.value.length ? (
                            passwordIcon1 === "show" ? (
                              <svg
                                onClick={switchPasswordType1}
                                className={styles.show_hide_password}
                                enableBackground="new 0 0 32 32"
                                id="Editable-line"
                                version="1.1"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="  M16,7C9.934,7,4.798,10.776,3,16c1.798,5.224,6.934,9,13,9s11.202-3.776,13-9C27.202,10.776,22.066,7,16,7z"
                                  fill="none"
                                  id="XMLID_10_"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="16"
                                  cy="16"
                                  fill="none"
                                  id="XMLID_12_"
                                  r="5"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                onClick={switchPasswordType1}
                                className={styles.show_hide_password}
                                enableBackground="new 0 0 32 32"
                                id="Editable-line"
                                version="1.1"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="  M16,7C9.934,7,4.798,10.776,3,16c1.798,5.224,6.934,9,13,9s11.202-3.776,13-9C27.202,10.776,22.066,7,16,7z"
                                  fill="none"
                                  id="XMLID_13_"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="16"
                                  cy="16"
                                  fill="none"
                                  id="XMLID_14_"
                                  r="5"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                                <line
                                  fill="none"
                                  id="XMLID_15_"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                  x1="3"
                                  x2="29"
                                  y1="3"
                                  y2="29"
                                />
                              </svg>
                            )
                          ) : (
                            ""
                          )}
                          {errors.current_password && (
                            <p className={styles.error}>
                              {errors.current_password.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="new_password"
                      control={control}
                      defaultValue={""}
                      rules={{
                        required: "* Обязательное поле.",
                        minLength: {
                          value: 8,
                          message: "* Минимальная длина пароля - 8.",
                        },
                      }}
                      render={({ field }) => (
                        <div className={styles.input_wrapper}>
                          <input
                            type={passwordType2}
                            name="new_password"
                            placeholder="Новый пароль"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          {field.value ? (
                            passwordIcon2 === "show" ? (
                              <svg
                                onClick={switchPasswordType2}
                                className={styles.show_hide_password}
                                enableBackground="new 0 0 32 32"
                                id="Editable-line"
                                version="1.1"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="  M16,7C9.934,7,4.798,10.776,3,16c1.798,5.224,6.934,9,13,9s11.202-3.776,13-9C27.202,10.776,22.066,7,16,7z"
                                  fill="none"
                                  id="XMLID_10_"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="16"
                                  cy="16"
                                  fill="none"
                                  id="XMLID_12_"
                                  r="5"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                onClick={switchPasswordType2}
                                className={styles.show_hide_password}
                                enableBackground="new 0 0 32 32"
                                id="Editable-line"
                                version="1.1"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="  M16,7C9.934,7,4.798,10.776,3,16c1.798,5.224,6.934,9,13,9s11.202-3.776,13-9C27.202,10.776,22.066,7,16,7z"
                                  fill="none"
                                  id="XMLID_13_"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="16"
                                  cy="16"
                                  fill="none"
                                  id="XMLID_14_"
                                  r="5"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                />
                                <line
                                  fill="none"
                                  id="XMLID_15_"
                                  stroke="#000000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  strokeWidth="2"
                                  x1="3"
                                  x2="29"
                                  y1="3"
                                  y2="29"
                                />
                              </svg>
                            )
                          ) : (
                            ""
                          )}
                          {errors.new_password && (
                            <p className={styles.error}>
                              {errors.new_password.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
            <button type="submit">Сохранить</button>
          </form>
        </div>
      </Modal>
    </>
  );
};
