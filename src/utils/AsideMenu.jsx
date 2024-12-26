// src/components/AsideMenu.js

import React from 'react';
import { Link } from 'react-router-dom';

const AsideMenu = ({ items, activeItem, onSelect }) => (
    <aside 

    style={{
        position: 'fixed', // Keeps the menu fixed
        top: '80px', // Adjusts position relative to the Navbar
        left: 40,
        width: '220px',
        backgroundColor: '#ffffff',
        padding: '20px',
        boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto', // Allows scrolling within the menu if content overflows
        zIndex: 999, // Slightly lower than Navbar to maintain proper layering
        height: 'calc(100vh - 60px)', // Fills the remaining viewport height
    }}
    >
        <h2 style={{
            fontFamily: 'Nunito',
            marginBottom: '20px',
            textAlign: 'center',
        }}>
            <span style={{
                color: 'transparent',
                background: 'linear-gradient(135deg, #14ADD6 0%, #384295 100%)',
                backgroundClip: 'text',
                fontSize: '22px',
                fontWeight: '700',
                lineHeight: '28px',
            }}>
                Billing
            </span>
            <br />
            <span style={{
                color: '#000',
                fontSize: '22px',
                fontWeight: '700',
                lineHeight: '28px',
            }}>
                Management System
            </span>
        </h2>

        <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => onSelect(item.label)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 0',
                            fontSize: '16px',
                            color: '#555',
                            cursor: 'pointer',
                            backgroundColor: item.label === activeItem ? '#F2F7FF' : 'transparent',
                        }}
                    >
                        <span style={{ marginRight: '10px' }}>{item.icon}</span>
                        
                        <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
);

export default AsideMenu;
