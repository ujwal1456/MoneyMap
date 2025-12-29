import React from 'react'
import {Routes,Route,useNavigate,Navigate,Link} from "react-router-dom"
import Dashboard from "./pages/Dashboard.jsx"
import { Toaster,toast } from 'react-hot-toast'
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import CategoryPage from './pages/CategoryPage.jsx'
import TxnDetail from './pages/TxnDetail.jsx'
import {useAuth} from "./hooks/useAuth.js"
import Logo from "../src/assets/favicon.png"


const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-200">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


const App = () => {

  const {user,logout} = useAuth();
  return (
    <>
      <header className='sticky top-0 z-10 bg-zinc-800/70 backdrop-blur border-b border-zinc-700'>
        <div className='w-full px-6 py-3 flex items-center gap-3'>
          <Link to="/" className='flex items-center gap-2 font-semibold text-lg text-gray-200'><img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span>MoneyMap</span>
          </Link>

          <div className='ml-auto flex items-center gap-3'>
            {user ? (
              <>
                <span className='text-sm text-zinc-300'>{user.name}</span>
                <button onClick={logout} className='px-3 py-1 rounded-xl bg-zinc-700 hover:bg-zinc-600'>Logout</button>
              </>
            ) : (
              <div className='flex gap-2'>
                <Link className='px-3 py-1 rounded-xl bg-zinc-700 text-slate-400 hover:bg-zinc-600' to="/login">Login</Link>
                <Link className='px-3 py-1 rounded-xl bg-zinc-700 text-slate-400 hover:bg-zinc-600' to="/signup">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className='max-w-5xl mx-auto px-4 py-6'>
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/category/:name" element={<Protected><CategoryPage /></Protected>} />
          <Route path="/tx/:id" element={<Protected><TxnDetail /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Toaster position="top-right" />
    </>
  )
}

export default App
