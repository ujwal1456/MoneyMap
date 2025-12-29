import React, { useEffect, useState } from 'react'
import { ToastBar,toast } from 'react-hot-toast';
import api from '../services/api.js';
import dayjs from 'dayjs'

const TransactionForm = ({onSaved}) => {

    const [form,setForm]=useState({
        type:"expense",
        amount:"",
        category:"Food",
        account:"Main",
        date:dayjs().format("YYYY-MM-DDTHH:mm"),
        note:"",
        receiptFile:null
    });

    const [cats,setCats]=useState([]);
    const [balance, setBalance] = useState(0);

    const fetchBalance = async () => {
        try {
            const res = await api.get("/stats/balance");
            setBalance(res.data.balance || 0);
        } catch(error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    useEffect(()=> {
        api.get("/categories").then(res=> setCats(res.data));
        fetchBalance();
    },[])

    const handleChange = (e) => {
        const {name,value,files} = e.target;
        setForm(f=> ({...f,[name]:files ? files[0] : value} ));
    }

    const submit = async(e) => {
        e.preventDefault();
        if (!form.amount || isNaN(form.amount) || +form.amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Check balance for expense
        if(form.type === "expense" && +form.amount > balance) {
            toast.error(`Insufficient balance. Current balance: ₹${balance.toLocaleString()}. Expense amount: ₹${(+form.amount).toLocaleString()}`);
            return;
        }

        try {

            let receiptUrl="";
            if(form.receiptFile) {
                const fd=new FormData();
                fd.append("file", form.receiptFile);
                const { data } = await api.post("/uploads", fd, { headers: { "Content-Type": "multipart/form-data" }});
                receiptUrl = data.url;
            }

            const payload = {
                type: form.type,
                amount: +form.amount,
                category: form.category,
                account: form.account,
                date: new Date(form.date),
                note: form.note,
                receiptUrl
            };
            await api.post("/transactions", payload);
            toast.success(`${form.type === "expense" ? "Expense" : "Income"} recorded`);
            setForm({
                type: "expense",
                amount: "",
                category: "Food",
                account: "Main",
                date: dayjs().format("YYYY-MM-DDTHH:mm"),
                note: "",
                receiptFile: null
            });
            // Refresh balance after transaction
            await fetchBalance();
            onSaved?.();

        } catch(error) {
            toast.error(error.response?.data?.message || "Failed to save");
        }
    }

  return (
    <form onSubmit={submit} className='bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 grid gap-4 shadow-lg border border-zinc-700/40'>
        <div className='flex gap-3'>
            {
                ["expense","income"].map(t => (
                    <button type="button" key={t} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${form.type===t ? "bg-emerald-600 text-white shadow-md": "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"} `}
                    onClick ={()=>setForm(f=> ({...f,type:t}))}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))
            }
        </div>

        <input className='bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2 text-zinc-200 placeholder-zinc-500 outline-none transition'  type="number" name='amount' placeholder='Amount' value={form.amount} onChange={handleChange} />
        <select className='bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' name="category" value={form.category} onChange={handleChange} >
            {cats.map(c => <option key={c.key} value={c.key}> {c.icon}{c.key} </option>)}
        </select> 
        <input className="bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2 text-zinc-200 placeholder-zinc-500 outline-none transition" name="account" placeholder="Account" value={form.account} onChange={handleChange} />
        <input className="bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2 text-zinc-200 outline-none transition" type="datetime-local" name="date" value={form.date} onChange={handleChange} />
        <input className="bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2 text-zinc-200 placeholder-zinc-500 outline-none transition"  name="note" placeholder="Note" value={form.note} onChange={handleChange} />
        <input className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-200 outline-none transition"  type="file" name="receiptFile" accept="image/*" onChange={handleChange} />
        <button className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl px-5 py-2 text-white font-semibold transition-all shadow-md">Save</button>
    </form>
  )
}

export default TransactionForm
