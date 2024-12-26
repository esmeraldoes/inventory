import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await invoke('login', { username, password });
            console.log(response)

            if (response.success) {
                login(response.username);
                alert('Login successful!');
                navigate('/dashboard');
            } else {
                setError(response.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            padding: '10px',
        }}>
            <div style={{
                display: 'flex',
                width: '99%',
                height: '87vh',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                {/* Left Column - Login Form */}
                <div style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '40px',
                    backgroundColor: '#ffffff',
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#94FCF6',
                        marginBottom: '10px',
                    }}></div>
                    <h2 style={{
                        marginBottom: '10px',
                        color: '#333',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '24px',
                        fontWeight: '500',
                        lineHeight: '36px',
                        textAlign: 'left',
                    }}>Login</h2>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <p style={{
                        marginBottom: '20px',
                        color: '#555',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        textAlign: 'left',
                    }}>
                        See your growth and get support!
                    </p>
                    
                    <form onSubmit={handleLogin} style={{
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        padding: '30px',
                        borderRadius: '8px',
                        height: '450px', // Extended form height
                    }}>
                        <label style={{
                            marginBottom: '8px',
                            fontSize: '15px',
                            color: '#555',
                        }}>Email</label>
                        
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                padding: '12px',
                                marginBottom: '20px',
                                fontSize: '16px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            }}
                            placeholder='Enter your email'
                        />
                        <label style={{
                            marginBottom: '8px',
                            fontSize: '15px',
                            color: '#555',
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                padding: '12px',
                                marginBottom: '20px',
                                fontSize: '16px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            }}
                            placeholder='minimum 8 characters'
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '14px',
                                color: '#333',
                            }}>
                                <input type="checkbox" style={{ marginRight: '5px' }} />
                                Remember me
                            </label>
                            <a href="/" style={{
                                fontSize: '14px',
                                color: '#101540',
                                textDecoration: 'none',
                            }}>Forgot password?</a>
                        </div>
                        <button type="submit" style={{
                            padding: '12px',
                            fontSize: '16px',
                            color: '#fff',
                            backgroundColor: '#101540',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }} onMouseOver={(e) => e.target.style.backgroundColor = '#0d1338'}
                           onMouseOut={(e) => e.target.style.backgroundColor = '#101540'}>
                            Login
                        </button>
                    </form>
                  
                </div>

                {/* Right Column - Image */}
                <div style={{
                    width: '100%',
                    marginLeft: '2%',
                    backgroundImage: 'url(./login.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}></div>
            </div>
        </div>
    );
};

export default Login;