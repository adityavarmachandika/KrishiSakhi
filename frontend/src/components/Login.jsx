import React, { useState } from 'react';
// import API from '../utils/api';
//import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    // e.preventDefault();
    // try {
    //   const res = await API.post('/users/login', { email, password });
    //   setToken(res.data.token);
    //   toast.success('Login successful!');
    //   navigate('/home'); 
    // } catch (err) {
    //   toast.error('Login failed! Please check your credentials.');
    // }
  };

  const onRegisterClick = () => navigate('/register'); 

  return (
    <section className="w-screen flex items-center justify-center min-h-screen pt-24 p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <button 
            type="submit" 
            className="mt-4 w-full p-3 bg-[#365949] text-white rounded-xl font-semibold text-base transition-all duration-300 hover:bg-[#2a4236] hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
          >
            Login
          </button>

          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <span 
              className="text-[#365949] font-semibold cursor-pointer underline hover:text-[#2a4236] transition-colors duration-300" 
              onClick={onRegisterClick}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
