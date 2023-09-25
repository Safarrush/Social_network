import styles from "./signup.module.scss";
import { useMutation } from "@tanstack/react-query";
import { signUpFetch } from "../../api";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../../components/Spinner";

import { useState } from "react";
import { useNoAuth } from "../../hooks/useNoAuth";

export const SignUp = () => {
  useNoAuth();
  const navigate = useNavigate();
  const { mutateAsync, error, isError, isLoading } = useMutation({
    mutationFn: async (values) => {
      const res = await signUpFetch(values);
      if (res.status === 400) {
        setError("password", {
          type: "manual",
          message: "* Не надежный пароль или логин уже занят.",
        });
      }
      if (res.ok) {
        //const responce = await res.json();

        //localStorage.setItem("TOKEN", responce.auth_token);
        return navigate("/");
      }
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    mode: "onBlur",
  });

  const [passwordType, setPasswordType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState("show");

  const switchPasswordType = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setPasswordIcon("hide");
    }
    if (passwordType === "text") {
      setPasswordType("password");
      setPasswordIcon("show");
    }
  };
  const passwordValue = watch("password" || "text");
  if (isError) return error;
  if (isLoading) return <Spinner />;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Регистрация в VSAS</h1>
        <form onSubmit={handleSubmit(mutateAsync)}>
          <div className={styles.field_wrapper}>
            <input
              type="email"
              className={styles.field}
              placeholder="Электронный адрес"
              {...register("email", {
                required: "* Обязательное поле.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "* Неверный адрес электронной почты!",
                },
              })}
            />

            <div className={styles.error}>
              {errors?.email && <p>{errors?.email?.message || "Ошибка"}</p>}
            </div>
          </div>

          <div className={styles.field_wrapper}>
            <input
              type="text"
              className={styles.field}
              placeholder="Имя пользователя"
              {...register("username", {
                required: "* Обязательное поле.",
                minLength: {
                  value: 3,
                  message: "* Минимальная длина имени пользователя - 3.",
                },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "* Некорректное имя пользователя.",
                },
              })}
            />
            <div className={styles.error}>
              {errors?.username && (
                <p>{errors?.username?.message || "Ошибка."}</p>
              )}
            </div>
          </div>

          <div className={styles.field_wrapper}>
            <input
              type="text"
              className={styles.field}
              placeholder="Имя"
              {...register("first_name", {
                required: "* Обязательное поле.",
                pattern: {
                  value: /^[а-яА-Яa-zA-Z]+$/,
                  message: "* Некорректное имя.",
                },
              })}
            />
            <div className={styles.error}>
              {errors?.first_name && (
                <p>{errors?.first_name?.message || "Ошибка."}</p>
              )}
            </div>
          </div>

          <div className={styles.field_wrapper}>
            <input
              type="text"
              className={styles.field}
              placeholder="Фамилия"
              {...register("last_name", {
                required: "* Обязательное поле.",
                pattern: {
                  value: /^[а-яА-Яa-zA-Z]+$/,
                  message: "* Некорректная фамилия.",
                },
              })}
            />
            <div className={styles.error}>
              {errors?.last_name && (
                <p>{errors?.last_name?.message || "Ошибка."}</p>
              )}
            </div>
          </div>

          <div className={styles.field_wrapper}>
            <input
              type={passwordType}
              className={styles.field}
              placeholder="Пароль"
              {...register("password", {
                required: "* Обязательное поле.",
                minLength: {
                  value: 8,
                  message: "* Минимальная длина пароля - 8.",
                },
              })}
            />
            {passwordValue ? (
              passwordIcon === "show" ? (
                <svg
                  onClick={switchPasswordType}
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
                  onClick={switchPasswordType}
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
            <div className={styles.error}>
              {errors?.password && (
                <p>{errors?.password?.message || "Ошибка."}</p>
              )}
            </div>
          </div>

          <button className={styles.button}>Зарегистрироваться</button>
        </form>
        <p className={styles.sub_text}>
          Уже есть аккаунт? <Link to={"/"}>Войти.</Link>
        </p>
      </div>
    </div>
  );
};
