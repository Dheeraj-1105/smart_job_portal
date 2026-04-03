import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); 
        const name = localStorage.getItem('name');

        if (token && role) {
            setUser({ token, role, name: name || '' });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log('[AUTH] Login payload:', { email, password: '***' });
        const data = await authService.login({ email, password });
        console.log('[AUTH] Login data:', data);
        const { token, role, name } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        setUser({ token, role, name });
        return role;
    };

    const register = async (name, email, password, role) => {
        console.log('[AUTH] Register payload:', { name, email, password: '***', role });
        const data = await authService.register({ name, email, password, role });
        console.log('[AUTH] Register data:', data);
        const { token, role: userRole, name: userName } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);
        localStorage.setItem('name', userName);
        setUser({ token, role: userRole, name: userName });
        return userRole;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
