import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/register', user);
      alert("Registration successful!");
      navigate('/login');
    } catch (error: any) {
      alert("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={user.name}
            required
          /><br />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={user.email}
            required
          /><br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={user.password}
            required
          /><br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
