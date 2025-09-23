import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import API from '../utils/api';
import { toast } from 'react-toastify';

function RegistrationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
    // e.preventDefault();
    // try {
    //   await API.post('/users/register', formData);
    //   toast.success('Registration successful! Please login.');
    //   navigate('/login');
    // } catch (err) {
    //   toast.error('Registration failed! Please try again.');
    // }
  };

  const onLoginClick = () => navigate('/login');

  return (
    <section className="w-screen flex items-center justify-center min-h-screen pt-24 p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-base transition-all duration-300 focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
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
            <label className="font-semibold mb-1 text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
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
            className="mt-4 w-full p-3 bg-[#365949] text-white rounded-xl font-semibold text-base transition-all duration-300 hover:bg-[#2a4236] hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
          >
            Register
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
