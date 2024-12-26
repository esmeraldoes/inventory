import { DashboardIcon, CompanyIcon, ProductIcon, CashIcon, InvoiceIcon, StocksIcon, NotificationIcon } from '../utils/Icons';
import { FaPlus } from 'react-icons/fa';

export const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Add Company', icon: <CompanyIcon />, path: '/company' },
    { label: 'Add Product', icon: <ProductIcon />, path: '/addproduct' },
    { label: 'Cash Received', icon: <CashIcon />, path: '/cash-received' },
    { label: 'Invoice', icon: <InvoiceIcon />, path: '/invoice' },
    { label: 'Stocks and Inventory', icon: <StocksIcon />, path: '/inventory' },
    { label: 'Notifications', icon: <NotificationIcon />, path: '/notifications' },
];

export const navbarButtons = [
    { label: 'New Bill', icon: <FaPlus />, path: '/new-bill' },
    { label: 'Cash Bill', icon: <FaPlus />, path: '/cash-bill' },
];
