import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../store/slices/userSlice";

export const Auth = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { username, password } = form;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Заполните все поля", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      const userData = {
        username,
        password,
      };
      dispatch(login(userData));
    }
  };

  return (
    <>
      <section className="reg">
        <form onSubmit={onSubmit} className="regForm">
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            placeholder="Имя пользователя"
            onChange={onChange}
          />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Пароль"
            onChange={onChange}
          />
          <button type="submit">Войти</button>
        </form>
      </section>
    </>
  );
};
