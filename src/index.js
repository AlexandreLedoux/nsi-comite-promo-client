import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/custom.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import authAPI from './services/authAPI';
import Create from './pages/idea/Create';
import Login from './pages/security/Login';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import { AuthProvider } from './contexts/AuthContext';
import Logout from './pages/security/Logout';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/security/Register';
import VerifyEmail from './pages/security/VerifyEmail';
import Index from './pages/admin/user/Index';
import Error from './pages/error/Error';
import Settings from './pages/security/Settings';

authAPI.setup();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <EnvironmentProvider>
    <AuthProvider>

      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<App />} role='ROLE_USER' />} />

          <Route path="/register" element={<Register />} />
          <Route path="/verify/:id" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/idea/new" element={<PrivateRoute element={<Create />} afterPath='/idea/new' role='ROLE_USER' />} />

          <Route path="/settings" element={<PrivateRoute element={<Settings />} afterPath='/settings' role='ROLE_USER' />} />

          <Route path="/admin/user" element={<PrivateRoute element={<Index />} afterPath='/admin/user' role='ROLE_ADMIN' />} />

          <Route path="*" element={<Error code={404} />} />
        </Routes>
      </Router>

    </AuthProvider>
  </EnvironmentProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
