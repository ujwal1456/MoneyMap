import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api.js'

const SetBalanceModal = ({ isOpen, onClose, onBalanceSet }) => {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!amount || isNaN(amount) || +amount < 0) {
            toast.error("Please enter a valid amount")
            return
        }

        setLoading(true)
        try {
            await api.post("/auth/set-balance", { balance: +amount })
            toast.success("Initial balance set successfully!")
            setAmount('')
            onBalanceSet?.()
            onClose()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to set balance")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-zinc-900 rounded-2xl p-8 max-w-sm w-full mx-4 border border-zinc-700'>
                <h2 className='text-2xl font-bold text-white mb-4'>Set Initial Balance</h2>
                <p className='text-zinc-300 mb-6'>Enter your starting balance to begin tracking your finances</p>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <input
                        type="number"
                        placeholder="Enter amount (₹)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className='w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-500 outline-none transition'
                    />
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl px-4 py-3 text-white font-semibold transition-all'
                    >
                        {loading ? 'Setting...' : 'Set Balance'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SetBalanceModal