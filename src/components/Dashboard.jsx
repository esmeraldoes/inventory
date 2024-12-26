import React, { useState, useEffect } from 'react';
import Card from '../utils/Cards';
import LongCard from '../utils/LongCard';
import { Paper, People, BluePrinter } from '../utils/Icons';
import LeanCard from '../utils/LeanCard';
import { FaPlus } from 'react-icons/fa';
import Layout from './Layout';
import { 
    fetchTodayBillsStats, 
    fetchCaseBillsStats, 
    fetchBillsStats, 
    fetchTodayCaseBillsStats 
} from './BillStats';

import { 
    DashboardIcon, 
    CompanyIcon, 
    ProductIcon, 
    CashIcon, 
    InvoiceIcon, 
    StocksIcon, 
    NotificationIcon 
} from '../utils/Icons';

const Dashboard = () => {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [stats, setStats] = useState({
        totalBills: 1,
        billsToday: 2,
        totalCaseBills: 3,
        caseBillsToday: 4,
    });

    // Fetch statistics from Tauri commands
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [billsStats, todayBillsStats, caseBillsStats, todayCaseBillsStats] = await Promise.all([
                    fetchBillsStats(),
                    fetchTodayBillsStats(),
                    fetchCaseBillsStats(),
                    fetchTodayCaseBillsStats()
                ]);

                setStats({
                    totalBills: billsStats.total_bills,
                    billsToday: todayBillsStats.bills_today,
                    totalCaseBills: caseBillsStats.total_case_bills,
                    caseBillsToday: todayCaseBillsStats.case_bills_today,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

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
                        }}>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <Card
                                    heading={stats.totalBills}
                                    subtitle="Total number of Bills"
                                    icon={<People />}
                                />
                                <Card
                                    heading={stats.totalCaseBills}
                                    subtitle="Total Case Received Bill"
                                    icon={<Paper />}
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <LeanCard 
                                        icon={<BluePrinter />} 
                                        text="Print Today’s bill" 
                                        iconBgColor="#D4E6F1"
                                    />
                                    <LeanCard 
                                        icon={<Paper />} 
                                        text="Print Today’s case received" 
                                        iconBgColor="#FADBD8"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <LongCard 
                                    icon={<Paper />}
                                    text={`Bills received today: ${stats.billsToday}`}
                                    iconBgColor="#FADBD8"
                                />
                                <LongCard 
                                    icon={<Paper />} 
                                    text={`Case bills received today: ${stats.caseBillsToday}`}
                                    iconBgColor="#FADBD8"
                                />
                            </div>
                        </div>

        </Layout>


                  
    );
};

export default Dashboard;
