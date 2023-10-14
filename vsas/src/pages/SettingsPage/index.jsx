import { useNavigate } from "react-router-dom";
import styles from "./settingspage.module.scss";

import { editDataFetch, logOutFetch } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../components/Modal";

export const SettingsPage = () => {
  useAuth();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const [editCurrentField, setEditCurrentField] = useState(null);
  const [active, setActive] = useState(false);
  const [openContent, setOpenContent] = useState(false);

  const me = useSelector((state) => state.me.me);
  const navigate = useNavigate();

  const fields = [
    {
      value: me.first_name,
      label: "Имя :",
      modal_label: "имя",
      name: "first_name",
      defaultValue: me.first_name,
      rules: {
        pattern: {
          value: /^[а-яА-Яa-zA-Z]+$/,
          message: "* Некорректное имя.",
        },
      },
      type: "text",
    },
    {
      value: me.last_name,
      label: "Фамилия :",
      modal_label: "фамилию",
      name: "last_name",
      defaultValue: me.last_name,
      rules: {
        pattern: {
          value: /^[а-яА-Яa-zA-Z]+$/,
          message: "* Некорректная фамилия.",
        },
      },
      type: "text",
    },
    {
      value: "@" + me.username,
      label: "Юзернейм :",
      modal_label: "юзернейм",
      name: "username",
      defaultValue: me.username,
      rules: {
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
    {
      value: me.email,
      label: "E-mail :",
      modal_label: "e-mail",
      name: "email",
      defaultValue: me.email,
      rules: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: "* Неверный формат эл. почты!",
        },
      },
      type: "email",
    },
    { value: "*************", label: "Пароль :" },
  ];

  const { mutateAsync } = useMutation({
    mutationFn: async (values) => {
      const res = await editDataFetch(values);
      if (res.ok) {
        const responce = await res.json();
        return responce;
      }
    },
  });

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
    setActive(true);
    setTimeout(() => {
      setOpenContent(true);
    }, 100);
  };

  const handleSaveClick = async () => {
    const formValues = getValues();

    mutateAsync(formValues);
    setOpenContent(false);
    setActive(false);
    setEditCurrentField(null);
    document.body.classList.remove("bodyModalOpen");
  };

  const handleCloseModal = () => {
    setOpenContent(false);
    setActive(false);
    setEditCurrentField(null);

    document.body.classList.remove("bodyModalOpen");
  };
  const handleLogOutClick = async () => {
    await logOutFetch();
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.actions}>
          <div className={styles.bottom_line}></div>
          {fields.map((field) => (
            <div key={field.value}>
              <div className={styles.action}>
                <span>{field.label}</span>

                <p className={styles.info}>{field.value}</p>
                <p
                  className={styles.edit}
                  onClick={() => handleEditClick(field)}
                >
                  Изменить
                </p>
              </div>
              <div className={styles.bottom_line}></div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleLogOutClick}
            className={styles.button}
          >
            Выйти
          </button>
        </div>
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

              <Controller
                name="first_name"
                control={control}
                defaultValue={""}
                rules={{
                  required: {
                    value: true,
                    message: "* Обязательное поле",
                  },
                  minLength: {
                    value: 4,
                    message: "* Некорректное имя.",
                  },
                  pattern: {
                    value: /^[а-яА-Яa-zA-Z]+$/,
                    message: "* Некорректное имя.",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <input
                      name="first_name"
                      type="text"
                      placeholder={editCurrentField && editCurrentField.value}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {errors.first_name && <p>{errors.first_name.message}</p>}
                  </div>
                )}
              />
            </div>
            <button type="submit">Сохранить</button>
          </form>
        </div>
      </Modal>
    </>
  );
};
