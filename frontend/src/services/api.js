import axios from "axios";

const api=axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use(config=> {
    const token=localStorage.getItem("token"); // Check if token present in localStorage
    if(token) config.headers.Authorization=`Bearer ${token}`; //If yes it adds header Auth
    return config;
});

export default api;


