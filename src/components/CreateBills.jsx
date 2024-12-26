// src/pages/AddCompany.js

import React, { useState, useEffect } from 'react';

import { FaPlus } from 'react-icons/fa';
import CreateBillForm from './NewBill';
import Layout from './Layout';
import { DashboardIcon, CashIcon, InvoiceIcon, StocksIcon, NotificationIcon } from '../utils/Icons';

const NewBill = () => {
    const [activeItem, setActiveItem] = useState('Add Company');

    const menuItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { label: 'Cash Received', icon: <CashIcon />, path: '/cash-received' },
        { label: 'Invoice', icon: <InvoiceIcon />, path: '/invoice' },
        { label: 'Stocks and Inventory', icon: <StocksIcon />, path: '/inventory' },
        { label: 'Notifications', icon: <NotificationIcon />, path: '/notifications' },
    ];

    const navbarButtons = [
        { label: 'New Bill', icon: <FaPlus />, path: '/new-bill' },
    ];

    return (
        
        <Layout
        buttons={navbarButtons}
        menuItems={menuItems}
        activeItem={activeItem}
        onSelect={(label) => setActiveItem(label)}
      >
                


                        <div style={{
                            backgroundColor: 'white',
                            padding: '15px',
                            marginLeft: '300px',
                            marginRight: '32px',
                            overflowY: 'hidden',
                            marginBottom: '30px',
                        }}>
                        
                        <CreateBillForm />

                        </div>
                   
           
        </Layout>
    );
};

export default NewBill;










