import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {toast} from 'react-hot-toast';
import api from '../services/api.js'

const Signup = () => {

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const nav=useNavigate();
    const {login} = useAuth();

    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm(f=> ({...f,[name]: value}));
    };

    const submit = async(e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", form);
            login(res.data.token, res.data.user);
            nav("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign up failed");
        }
    }

  return (
    <div className='max-w-md mx-auto mt-10'>
            <form onSubmit={submit} className='bg-zinc-800 rounded-2xl p-4 grid gap-3'>
                <h2 className='text-2xl text-white text-center font-semibold mb-4'>Sign Up</h2>
                <input className='bg-zinc-700 rounded-xl px-3 py-2' name="name" placeholder='Name' value={form.name} onChange={handleChange} />
                <input className='bg-zinc-700 rounded-xl px-3 py-2' name="email" placeholder='Email' value={form.email} onChange={handleChange} />
                <input className='bg-zinc-700 rounded-xl px-3 py-2' name="password" type="password" placeholder='Password' value={form.password} onChange={handleChange} />
                <button type="submit" className='bg-emerald-600 rounded-xl px-4 py-2'>Sign Up</button>
                <div className='text-center text-zinc-400'>
                    Already have an account? <Link to="/login" className='text-blue-400'>Login</Link>
                </div>
            </form>
        </div>
  )
}

export default Signup
