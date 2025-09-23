import React, { useState, useContext } from 'react';
import API from '../context/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const { login } = useContext(UserContext);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { phone, password: '***' }); // Debug log
      const res = await API.post('/farmer/login', { phone, password });
      console.log('Login response:', res.data); // Debug log
      
      // Handle the backend response structure: {"login successful": farmerWithToken}
      const farmerData = res.data["login successful"];
      
      if (farmerData && farmerData.token) {
        login(farmerData.token);
        toast.success('Login successful! Welcome back!');
        navigate('/'); 
      } else {
        console.error('Invalid response structure:', res.data);
        toast.error('Invalid response from server.');
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Login failed! Please try again.';
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          errorMessage = data?.error || 'Invalid credentials. Please check your phone number and password.';
        } else if (status === 404) {
          errorMessage = 'User not found. Please check your phone number or register.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.error || data?.message || 'Login failed! Please try again.';
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterClick = () => navigate('/register'); 

  return (
    <section className="w-screen flex items-center justify-center min-h-screen pt-24 p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            disabled={loading}
            className="mt-4 w-full p-3 bg-[#365949] text-white rounded-xl font-semibold text-base transition-all duration-300 hover:bg-[#2a4236] hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Logging in...' : 'Login'}
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
