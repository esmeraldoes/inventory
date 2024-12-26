import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = Cookies.get('user'); // Retrieve user cookie
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username) => {
        setUser({ username });
        Cookies.set('user', JSON.stringify({ username }), { expires: 1 }); // 1-day expiry
        navigate('/dashboard'); // Redirect to the dashboard after login
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
