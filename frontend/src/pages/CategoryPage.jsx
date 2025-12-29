import React, { useEffect, useState } from 'react'
import { Link,useParams } from "react-router-dom";
import api from "../services/api.js"
import dayjs from "dayjs"


const CategoryPage = () => {

    const {name } =useParams();
    const [txns,setTxns] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        api.get("/transactions", { params: { category: decodeURIComponent(name), type: "expense", from: dayjs().startOf("month").toISOString(), to: dayjs().endOf("month").toISOString() } })
            .then(t => setTxns(t.data.items || []))
            .catch(error => console.error("Failed to load transactions:", error))
            .finally(() => setLoading(false));
    },[name]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-zinc-200">Loading...</div>;
    }


  return (
    <div>
        <h2 className='text-2xl font-semibold mb-4'>{decodeURIComponent(name)}</h2>
            <div className='grid gap-3'>
                {txns.map(t => (
                    <Link key={t._id} to={`/tx/${t._id}`} className='bg-zinc-800 rounded-xl p-3 flex gap-3 hover:bg-zinc-700'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-2'>
                                <span className='font-semibold'>{t.category}</span>
                                <span className='text-sm text-zinc-400'>{dayjs(t.date).format("MMM D, YYYY h:mm A")}</span>
                            </div>
                            <div className='text-zinc-300'>{t.note}</div>
                        </div>
                        <div className='font-semibold'>₹{t.amount.toLocaleString()}</div>
                    </Link>
                ))}
            </div>
    </div>
  )
}

export default CategoryPage
