import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useNoAuth = () => {
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) navigate("/profile");
  }, [navigate, token]);
};
