import React from 'react'
import { PieChart,Pie,Tooltip,Cell,ResponsiveContainer } from 'recharts'

const DonutChart = ({data}) => {

    const total= data.reduce((s,d)=> s+d.total,0);
    const COLORS = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6"];

  return (
    <div className='bg-zinc-800 rounded-2xl p-1'>
      <div className='text-center text-2xl font-semibold mb-3'>₹{total.toLocaleString()}</div>
      <div className='h-64'>
        <ResponsiveContainer>
            <PieChart>
                <Pie data={data} innerRadius={70} outerRadius={100} dataKey="total" nameKey="category">
                    {data.map((_,i)=> <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DonutChart
