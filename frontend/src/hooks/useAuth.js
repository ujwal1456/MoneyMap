import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import {toast} from "react-hot-toast"

export const useAuth = () => {

    const [user,setUser] =useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    const loadMe = async() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load user");
            localStorage.removeItem("token");
        }
        setLoading(false);
    };

    useEffect(()=> {
        loadMe();
    },[]);

    const login =  (token,user) => {
        localStorage.setItem("token", token);
        setUser(user);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // const signup = async(name,email,password) => {
    //     const {data} = await api.post("/auth/register",{name,email,password});
    //     localStorage.setItem("token",data.token);
    //     setUser(data.user);
    //     toast.success("Accounted created successfully!");
    // }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
        nav("/login");
    };

    return {user,loading ,login,logout};
};

