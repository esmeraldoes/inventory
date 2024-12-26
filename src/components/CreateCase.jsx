// src/pages/AddCompany.js

import React, { useState } from 'react';
import AsideMenu from '../utils/AsideMenu';
import Navbar from '../utils/Navbar';
import { FaPlus } from 'react-icons/fa';
import CreateCaseForm from './NewCase';
import { DashboardIcon, CompanyIcon, ProductIcon, CashIcon, InvoiceIcon, StocksIcon, NotificationIcon } from '../utils/Icons';

const NewCase = () => {
    const [activeItem, setActiveItem] = useState('Cash Received');

    const menuItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { label: 'Add Company', icon: <CompanyIcon />, path: '/company' },
        { label: 'Add Product', icon: <ProductIcon />, path: '/addproduct' },
        { label: 'Cash Received', icon: <CashIcon />, path: '/cash-received' },
        { label: 'Invoice', icon: <InvoiceIcon />, path: '/invoice' },
        { label: 'Stocks and Inventory', icon: <StocksIcon />, path: '/inventory' },
        { label: 'Notifications', icon: <NotificationIcon />, path: '/notifications' },
    ];

    const navbarButtons = [
        { label: 'New Bill', icon: <FaPlus />, path: '/new-bill' },
        { label: 'Cash Bill', icon: <FaPlus />, path: '/cash-bill' },
    ];

    const companyData = [
        { name: 'ABC Corporation', status: 'Active', action: 'Edit/Delete' },
        { name: 'XYZ Inc.', status: 'Inactive', action: 'Edit/Delete' },
        { name: 'LMN Solutions', status: 'Active', action: 'Edit/Delete' },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
            {/* Main Content Wrapper */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Navbar */}
                <Navbar buttons={navbarButtons} />

                {/* Dashboard Content */}
                <div style={{ display: 'flex', marginTop: '0px' }}>
                    {/* Sidebar */}
                    <AsideMenu
                        items={menuItems}
                        activeItem={activeItem}
                        onSelect={(label) => setActiveItem(label)}
                    />

                    {/* Main Content */}
                    <div style={{ flex: 1, padding: '20px', marginLeft: '20px' }}>
                        {/* White Section */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '15px',
                            marginLeft: '300px',
                            marginRight: '32px',
                        }}>
                        <CreateCaseForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCase;





