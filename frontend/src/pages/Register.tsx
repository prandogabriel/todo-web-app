import React, { useState } from 'react';
import api from '../services/api';
import Input from '../components/Input';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      alert('User registered successfully');
    } catch (error) {
      console.log(error);
      alert('Error registering user');
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 max-w-sm w-full">
        <h2 className="text-primary text-xl mb-4">Register</h2>
        <Input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-secondary">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
