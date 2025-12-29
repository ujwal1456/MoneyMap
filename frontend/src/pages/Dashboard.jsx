import React, { useEffect, useMemo, useState } from 'react'
import dayjs from "dayjs";
import api from "../services/api.js"
import DonutChart from '../components/DonutChart.jsx';
import DateTabs from '../components/DateTabs.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import SetBalanceModal from '../components/SetBalanceModal.jsx';
import BalanceSettings from '../components/BalanceSettings.jsx';
import { Link } from 'react-router-dom';


const rangeFor = ({v,customRange}) => {
    const now = dayjs();
    if (v === "day") return { from: now.startOf("day"), to: now.endOf("day") };
    if (v === "week") return { from: now.startOf("week"), to: now.endOf("week") };
    if (v === "month") return { from: now.startOf("month"), to: now.endOf("month") };
    if (v === "year") return { from: now.startOf("year"), to: now.endOf("year") };
    if (v === "custom") {
    if (!customRange.from && !customRange.to) {
      // fallback only if both are empty
      return { from: now.startOf("month"), to: now };
    }

    const from = customRange.from
      ? dayjs(customRange.from).startOf("day")
      : dayjs(new Date(0)); // if no start, include everything
    const to = customRange.to
      ? dayjs(customRange.to).endOf("day")
      : now; // if no end, include today

    return { from, to };
  }
    return { from: now.startOf("month"), to: now.endOf("month") };
}

const Dashboard = () => {

    const [view,setView] = useState("month");
    const [type, setType] = useState("expense");
    const [txns,setTxns] = useState([]);
    const [catData,setCatData] = useState([]);
    const [summary,setSummary] = useState({expense:0, income: 0});
    const [balance, setBalance] = useState(0);
    const [customRange, setCustomRange] = useState({ from: "", to: "" });
    const [showBalanceModal, setShowBalanceModal] = useState(false);

    const load = async() => {
      try {
        const range = rangeFor({v: view, customRange});
        const params = {type, from: range.from.toISOString(), to: range.to.toISOString()};
        
        const t = await api.get("/transactions",{params});
        setTxns(t.data.items);    
        const cat = await api.get("/stats/by-category",{params});
        setCatData(cat.data);    
        const s = await api.get("/stats/summary",{params});
        setSummary(s.data);
        
        try {
          const b = await api.get("/stats/balance");
          const currentBalance = Number(b.data.balance) || 0;
          setBalance(currentBalance);
          
          // Show balance modal if no balance is set (on first load or initial balance is 0)
          if(!localStorage.getItem('balanceModalShown') && currentBalance === 0) {
            setShowBalanceModal(true);
          }
        } catch(balanceError) {
          console.error("Failed to fetch balance:", balanceError);
          setBalance(0);
        }
      } catch (error) {
          console.error("Failed to load data:", error);
      }
    };

    useEffect(()=> {
        load();
    },[view,type,customRange]);

    useEffect(() => {
      // Initial load
      api.get("/stats/balance")
        .then(res => {
          const currentBalance = Number(res.data.balance) || 0;
          if(currentBalance === 0 && !localStorage.getItem('balanceModalShown')) {
            setShowBalanceModal(true);
          }
        })
        .catch(err => {
          console.error("Failed to fetch balance on init:", err);
          setBalance(0);
        });
    }, []);

  return (
    <div className='grid gap-6'>
      {/* Top Section */}
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Add Transaction */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-zinc-700/40">
          <h2 className='text-xl text-white font-semibold mb-4'>Add Transaction</h2>
          <TransactionForm onSaved={load} />
        </div>

        {/* Summary */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-zinc-700/40">
          <h2 className='text-xl text-white font-semibold mb-4'>Summary</h2>
          
          {/** Balance Display */}
          <div className='text-center bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border border-emerald-600/30 rounded-xl p-4 mb-6'>
            <p className='text-zinc-400 text-sm mb-1'>Current Balance</p>
            <p className='text-3xl font-bold text-emerald-400'>₹{balance.toLocaleString()}</p>
          </div>

          {/** Balance Settings Button */}
          <div className='mb-4'>
            <BalanceSettings currentBalance={balance} onBalanceUpdated={load} />
          </div>

          {/** Type Toggle */}
          <div className='flex gap-4 mb-4'>
            <button onClick={() => setType("expense")} className={`px-4 py-2 rounded-lg ${type === "expense" ? "bg-red-500 text-white" : "bg-zinc-700 text-zinc-300"}`}>
                Expenses
            </button>

            <button onClick={() => setType("income")} className={`px-4 py-2 rounded-lg ${type === "income" ? "bg-green-500 text-white" : "bg-zinc-700 text-zinc-300"}`}>
                Income
            </button>
          </div>

          {/** Total Summary */}
          <div className='text-center text-zinc-200 mb-6 text-lg font-medium'>
              {type === "expense" ? (
                  <span className='text-red-400 font-bold'>
                      Total Expenses: ₹{(summary.expense || 0).toLocaleString()}
                  </span>
                ) : (
                  <span className='text-green-400 font-bold'>
                        Total Income: ₹{(summary.income || 0).toLocaleString()}
                  </span>
              )}
          </div>

          <DonutChart data={catData} />
        </div>
      </div>

      {/* Transactions */}
      <div  className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-zinc-700/40">
        <h2 className='text-xl text-white font-semibold mb-4'>Recent Transactions</h2>
        <DateTabs view={view} setView={setView} customRange={customRange} setCustomRange={setCustomRange}  />
        <div className='mt-5 grid gap-4'>
          {txns.map(t => (
              <Link key={t._id} to={`/tx/${t._id}`} className='bg-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:bg-zinc-700 transition-all shadow-md'>

                {/*Category icon / letter */}
                  <div className='flex items-center justify-center w-12 h-12 rounded-full bg-zinc-700 text-white text-lg font-bold'>{t.category[0]}</div>

                  {/** Details */}
                  <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                          <span className='font-semibold text-white'>{t.category}</span>
                          <span className='text-sm text-zinc-400'>{dayjs(t.date).format("MMM D, YYYY h:mm A")}</span>
                      </div>
                      {t.note && (
                        <div className='text-zinc-300 text-sm mt-1 italic'>{t.note}</div>
                      )}
                  </div>


                  {/**  Amount */}
                  <div className='font-semibold text-green-400 text-lg'>₹{t.amount.toLocaleString()}</div>
              </Link>
          ))}
        </div>
      </div>

      <SetBalanceModal 
        isOpen={showBalanceModal} 
        onClose={() => {
          setShowBalanceModal(false);
          localStorage.setItem('balanceModalShown', 'true');
        }}
        onBalanceSet={() => {
          load();
          localStorage.setItem('balanceModalShown', 'true');
        }}
      />
    </div>
  )
}

export default Dashboard