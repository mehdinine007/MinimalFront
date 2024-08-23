import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import persianToNumber from "../helpers/convertNumber/persianToNumber";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${token}`,
    ".aspnetcore.culture": "fa",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.data = persianToNumber(config.data);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (res) {
    if (res.status === 401) {
      localStorage.clear();
      const navigate = useNavigate();
      navigate("/login");
    }
    return res;
  },
  function (error) {
    if (error?.response?.data?.error?.message) {
      toast.error(error?.response?.data?.error?.message);
    }
    if (error?.response?.data?.error?.message?.includes("دقیقه گذشته")) {
      return true;
    }
  }
);

export default instance;
