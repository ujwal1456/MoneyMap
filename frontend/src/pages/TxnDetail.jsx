import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
import {toast} from "react-hot-toast"
import dayjs from 'dayjs';

const TxnDetail = () => {
    const {id} = useParams();
    const nav = useNavigate();
    const [t,setT] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        const {data} = await api.get(`/transactions/${id}`);
        setT(data);
    };
    
    useEffect(() => {
        api.get(`/transactions/${id}`)
            .then(res => setT(res.data))
            .catch(error => {
                toast.error(error.response?.data?.message || "Failed to load transaction");
                nav("/");
            })
            .finally(() => setLoading(false));
    }, [id, nav]);

    const del = () => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        api.delete(`/transactions/${id}`)
            .then(() => {
                toast.success("Transaction deleted");
                nav("/");
            })
            .catch(error => toast.error(error.response?.data?.message || "Failed to delete"));
    };


    if (loading) {
        return <div className="flex items-center justify-center h-screen text-zinc-200">Loading...</div>;
    }

    if (!t) return null;

  return (
    <div className='bg-zinc-800 rounded-2xl p-6 grid gap-4 shadow-lg'>
            <div className='text-2xl font-semibold text-white'>{t.category}</div>
            <div className='grid gap-2 text-zinc-200'>
                <div><span className='text-zinc-400'>Amount:</span> <span className="font-medium text-green-400">₹{t.amount.toLocaleString()}</span></div>
                <div><span className='text-zinc-400'>Type:</span> <span className="capitalize">{t.type}</span></div>
                <div><span className='text-zinc-400'>Date:</span> {dayjs(t.date).format("MMM D, YYYY h:mm A")}</div>
                <div><span className='text-zinc-400'>Account:</span> {t.account}</div>
                {t.note && <div><span className='text-zinc-400'>Note:</span> {t.note}</div>}
                {t.receiptUrl && <div><span className='text-zinc-400'>Receipt:</span> <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer" className='text-blue-400 hover:text-blue-300 underline'>View</a></div>}
            </div>
            <div className='flex gap-2 pt-2'>
                <button onClick={() => nav("/")} className='px-4 py-2 bg-zinc-700 text-zinc-200 rounded-xl hover:bg-zinc-600 transition'>Back</button>
                <button onClick={del} className='px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition'>Delete</button>
            </div>
        </div>
  )
}

export default TxnDetail
