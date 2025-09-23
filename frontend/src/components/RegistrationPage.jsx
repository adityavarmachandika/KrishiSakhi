import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../context/api';
import { UserContext } from '../context/UserContext';

function RegistrationPage() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create the data object that matches backend expectations
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      console.log('Attempting registration with:', { ...registrationData, password: '***' }); // Debug log
      const res = await API.post('/farmer/signup', registrationData);
      console.log('Registration response:', res.data); // Debug log
      
      // Handle the backend response structure: {"data inserted": farmerWithToken}
      const farmerData = res.data["data inserted"];
      
      if (farmerData) {
        toast.success('Registration successful! You can now login.');
        navigate('/login');
      } else {
        console.error('Invalid response structure:', res.data);
        toast.error('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Registration failed! Please try again.';
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          errorMessage = data?.error || 'Invalid registration data. Please check your information.';
        } else if (status === 409) {
          errorMessage = 'User already exists with this phone number or email.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.error || data?.message || 'Registration failed! Please try again.';
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

  const onLoginClick = () => navigate('/login');

  return (
    <section className="w-screen flex items-center justify-center min-h-screen pt-24 p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full p-3 bg-[#365949] text-white rounded-xl font-semibold text-base transition-all duration-300 hover:bg-[#2a4236] hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <p className="mt-4 text-center text-gray-600 text-sm">
            Have an account?{' '}
            <span 
              className="text-[#365949] font-semibold cursor-pointer underline hover:text-[#2a4236] transition-colors duration-300" 
              onClick={onLoginClick}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegistrationPage;
