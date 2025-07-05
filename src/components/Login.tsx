import React from 'react';
import { useForm } from 'react-hook-form';
import './Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
  try {
    const res = await axios.post('http://localhost:8080/api/login', data);
    
    const { token, userId } = res.data;

    if (!userId) {
      alert("Login response is missing userId");
      return;
    }

    // ✅ Store token and userId
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);

    alert('Login successful!');
    navigate('/front', { replace: true });
  } catch (error: any) {
    alert('Login failed: ' + (error.response?.data?.message || error.message));
  }
};

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Login</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
