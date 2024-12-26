// src/components/Layout.js

import React from 'react';
import Navbar from '../utils/Navbar';
import AsideMenu from '../utils/AsideMenu';


const Layout = ({ children, buttons, menuItems, activeItem, onSelect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#f0f2f5", minHeight: '100vh' }}>
        <div style={{width:'100%', backgroundColor: "#f0f2f5",height:'40px',position: 'fixed', // Ensures the navbar remains fixed
                        top: '0px',
                        left: 0,}}></div>
        
        <Navbar buttons={buttons} />
            <div style={{ display: 'flex', flex: 1, marginTop: '50px', gap: '250px' }}>
                <AsideMenu items={menuItems} activeItem={activeItem} onSelect={onSelect} />
                <div style={{ flex: 1, padding: '20px', marginLeft: '20px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
