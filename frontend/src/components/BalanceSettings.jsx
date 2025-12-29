import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api.js'

const BalanceSettings = ({ currentBalance, onBalanceUpdated }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [newBalance, setNewBalance] = useState(currentBalance)
    const [loading, setLoading] = useState(false)

    const handleReset = async () => {
        if(window.confirm('Are you sure you want to reset balance to 0? This cannot be undone!')) {
            setLoading(true)
            try {
                await api.post("/auth/set-balance", { balance: 0 })
                toast.success("Balance reset to 0")
                setNewBalance(0)
                onBalanceUpdated?.()
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to reset balance")
            } finally {
                setLoading(false)
            }
        }
    }

    const handleUpdateBalance = async () => {
        if (!newBalance && newBalance !== 0 || isNaN(newBalance) || newBalance < 0) {
            toast.error("Please enter a valid amount")
            return
        }

        setLoading(true)
        try {
            await api.post("/auth/set-balance", { balance: +newBalance })
            toast.success("Balance updated successfully")
            onBalanceUpdated?.()
            setIsOpen(false)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update balance")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all'
            >
                Balance Settings
            </button>

            {isOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-zinc-900 rounded-2xl p-8 max-w-sm w-full mx-4 border border-zinc-700'>
                        <h2 className='text-2xl font-bold text-white mb-6'>Balance Settings</h2>

                        {/* Current Balance Display */}
                        <div className='bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700'>
                            <p className='text-zinc-400 text-sm mb-2'>Current Balance</p>
                            <p className='text-2xl font-bold text-emerald-400'>₹{currentBalance.toLocaleString()}</p>
                        </div>

                        {/* Manual Change Section */}
                        <div className='mb-6'>
                            <label className='block text-zinc-300 text-sm font-medium mb-2'>
                                Manually Change Balance
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    type="number"
                                    value={newBalance}
                                    onChange={(e) => setNewBalance(e.target.value)}
                                    placeholder="Enter new balance"
                                    className='flex-1 bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 text-zinc-200 placeholder-zinc-500 outline-none transition'
                                />
                                <button
                                    onClick={handleUpdateBalance}
                                    disabled={loading}
                                    className='bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 rounded-xl px-4 py-2 text-white font-medium transition-all'
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className='border-t border-zinc-700 pt-6'>
                            <p className='text-zinc-400 text-sm mb-3'>
                                Reset balance to zero (useful if you deleted transactions from database)
                            </p>
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className='w-full bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 rounded-xl px-4 py-2 text-white font-medium transition-all'
                            >
                                Reset Balance to 0
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className='w-full mt-4 bg-zinc-700 hover:bg-zinc-600 rounded-xl px-4 py-2 text-white font-medium transition-all'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default BalanceSettings
