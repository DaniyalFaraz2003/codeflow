import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Configure axios to include credentials
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'https://codeflow-backend-henna.vercel.app/api/';

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await axios.get('/auth/me');
                    setCurrentUser(res.data.user);
                }
            } catch (err) {
                console.error('Auth check error:', err);
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    // Register function
    const register = async (userData) => {
        try {
            setError('');
            const res = await axios.post('/auth/register', userData);

            setCurrentUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    // Login function
    const login = async (username, password) => {
        try {
            setError('');
            const res = await axios.post('/auth/login', { username, password });

            setCurrentUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setCurrentUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};