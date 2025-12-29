import React from 'react'
import dayjs from "dayjs";


const DateTabs = ({view,setView,customRange, setCustomRange}) => {

    const tabs=["day","week","month","year","custom"];

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        {
          tabs.map((t)=> (
              <button key={t} onClick={()=>setView(t)} className={`px-3 py-1 rounded-full text-sm ${view===t ? "bg-emerald-600" : "bg-zinc-700 hover:bg-zinc-500" }`}>{t[0].toUpperCase()+t.slice(1)}</button>
          ))
        }
      </div>

      {/** Custom range Picker */}
      {
        view==="custom" && (
          <div className="flex gap-3 mt-3">
            <input
              type="date"
              value={customRange.from ? dayjs(customRange.from).format("YYYY-MM-DD") : ""}
              onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
              className="bg-zinc-800 text-white px-3 py-1 rounded-lg border border-zinc-600"
            />
            <input
              type="date"
              value={customRange.to ? dayjs(customRange.to).format("YYYY-MM-DD") : ""}
              onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
              className="bg-zinc-800 text-white px-3 py-1 rounded-lg border border-zinc-600"
            />
        </div>
        )
      }
    </div>
  )
}

export default DateTabs
