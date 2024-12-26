import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { FaPlus } from 'react-icons/fa';
import Pagination from '../utils/Pagination';
import ActionCaseButton from '../utils/ActionButtonCase';
import SquareButton from '../utils/CleanButton';
import MyButton from '../utils/SingleButton';
import { invoke } from '@tauri-apps/api/core';
import { DashboardIcon, CompanyIcon, ProductIcon, CashIcon, InvoiceIcon, StocksIcon, NotificationIcon } from '../utils/Icons';

const RealCase = () => {
    const [activeItem, setActiveItem] = useState('Invoice');
    const [cases, setCases] = useState([]);
    const [selectedCases, setSelectedCases] = useState([]); 
    const [openMenuId, setOpenMenuId] = useState(null);


    
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
    ];


     // Fetch companies from API
    const loadCase = async () => {
        try {
            const data = await invoke("get_all_case_bills");
            console.log("D DATA: ", data.data)
            setCases(data.data);  
            // setCompanies(data);
        } catch (error) {
            console.error('Failed to load cases:', error);
        }
    };


    useEffect(() => {
        loadCase();
    }, []);


    const handleCheckboxChange = (caseId) => {
        // Toggle the selected bill ID in the selectedBills state
        setSelectedCases((prevSelected) =>
            prevSelected.includes(caseId)
                ? prevSelected.filter((id) => id !== caseId) // Deselect if already selected
                : [...prevSelected, caseId] // Select if not already selected
        );
    };


    const handlePrintBill = (billId) => {
        navigate(`/bill/${billId}`);
    };


    
    const handleDeleteCaseBill = async (casebillId) => {
        try {
            await invoke("delete_case_bill", {id: casebillId});
            setBills((prevCaseBills) => prevCaseBills.filter((casebill) => casebill.id !== casebillId));
        } catch (error) {
            console.error('Failed to delete bill:', error);
        }
    };

    return (

        <Layout
        buttons={navbarButtons}
        menuItems={menuItems}
        activeItem={activeItem}
        onSelect={(label) => setActiveItem(label)}
      >


                        <div style={headerBarStyle}>
                            <h3 style={titleStyle}>Case Billings</h3>

                            <div style={buttoncontainer}>
                                <SquareButton text={"Select"} />
                                <SquareButton text="Download Bill"  />
                                <MyButton 
                                icon={<FaPlus />} 
                                label="New Case" 
                                path="/new-case" 
                              />
                                
                            </div>
                            
                        </div>
         

                        {/* Product List and Rectangle Button */}
                        <div style={productListWrapperStyle}>
                        {/* Search Bar */}
                        <div style={searchBarStyle}>
                        <span style={searchIconStyle}>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5329 11.0713C13.5012 9.74996 13.9349 8.11176 13.7472 6.48442C13.5596 4.85708 12.7643 3.36061 11.5207 2.2944C10.2771 1.22819 8.67669 0.670877 7.03977 0.73395C5.40286 0.797023 3.85012 1.47584 2.6922 2.63458C1.53429 3.79333 0.856587 5.34655 0.794686 6.98351C0.732784 8.62046 1.29125 10.2204 2.35834 11.4633C3.42544 12.7062 4.92248 13.5003 6.54996 13.6869C8.17743 13.8734 9.81532 13.4385 11.1359 12.4693H11.1349C11.1649 12.5093 11.1969 12.5473 11.2329 12.5843L15.0829 16.4343C15.2704 16.6219 15.5248 16.7274 15.7901 16.7275C16.0554 16.7276 16.3098 16.6223 16.4974 16.4348C16.6851 16.2473 16.7905 15.9929 16.7906 15.7276C16.7907 15.4624 16.6854 15.2079 16.4979 15.0203L12.6479 11.1703C12.6122 11.1341 12.5737 11.1007 12.5329 11.0703V11.0713ZM12.7909 7.22727C12.7909 7.94954 12.6487 8.66474 12.3723 9.33203C12.0959 9.99932 11.6907 10.6056 11.18 11.1164C10.6693 11.6271 10.063 12.0322 9.3957 12.3086C8.7284 12.585 8.01321 12.7273 7.29094 12.7273C6.56867 12.7273 5.85347 12.585 5.18618 12.3086C4.51889 12.0322 3.91257 11.6271 3.40185 11.1164C2.89113 10.6056 2.486 9.99932 2.2096 9.33203C1.9332 8.66474 1.79094 7.94954 1.79094 7.22727C1.79094 5.76858 2.3704 4.36964 3.40185 3.33819C4.4333 2.30674 5.83225 1.72727 7.29094 1.72727C8.74963 1.72727 10.1486 2.30674 11.18 3.33819C12.2115 4.36964 12.7909 5.76858 12.7909 7.22727Z" fill="#212529"/>
                            </svg>
                        </span>
                        <input type="text" placeholder="Search..." style={searchInputStyle} />
                        </div>
                            

                            <div style={trashButtonStyle}>
                                <svg width="14" height="88" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#FF1E1E"/>
                                </svg>
                                <span style={trashButtonTextStyle}>
                                    Selected
                                </span>
                            </div>
                        </div>


                        <div style={{ marginTop: '0px', marginLeft: '250px', width:'77%', paddingLeft:'4px' }}>
                        
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed',
                        }}>
                            <thead style={{
                                backgroundColor: 'white',
                            }}>
                                <tr>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'left', width: '5%' }}>
                                        <input type="checkbox" />
                                    </th>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'left', width: '8%' }}>Bill ID</th>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'left', width: '15%' }}>Customer</th>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'center', width: '20%' }}>Date</th>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'center', width: '10%' }}>Mobile Number</th>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'center', width: '8%' }}>Address</th>
                                    <th style={{ color: 'black', padding: '8px', textAlign: 'center', width: '8%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {cases && cases.length > 0 ? (
                                cases.map((casebill) => (
                                    <tr key={casebill.id} style={{
                                        borderBottom: '1px solid #ccc',
                                    }}>
                                    
                                        <td style={{ padding: '8px', textAlign: 'left' }}>
                                        <input
                                        type="checkbox"
                                        checked={selectedCases.includes(casebill.id)} // Determine if the checkbox is selected
                                        onChange={() => handleCheckboxChange(casebill.id)} // Handle checkbox click
                                    />
                                        </td>
                                        <td style={{ padding: '0px', textAlign: 'left' }}>{casebill.id}</td>
                                        <td style={{ padding: '8px', textAlign: 'left' }}>{casebill.name}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{casebill.date}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{casebill.mobile_number}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{casebill.address}</td>

                                        <td style={{ padding: '8px', textAlign: 'center' }}>

                                            <ActionCaseButton
                                            casebill={casebill} 
                                            onEdit={()=>console.log("clicked")} 
                                            onDelete={() => handleDeleteCaseBill(casebill.id)} 
                                            onPrintBill={() => handlePrintBill(casebill.id)}
                                            openMenuId={openMenuId}
                                            setOpenMenuId={setOpenMenuId}
                                                
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3">No Case available</td></tr>
                            ) }
                            </tbody>
                        </table>
    <div>
    <p>Selected Bills: {selectedCases.join(', ')}</p> {/* Display selected bill IDs */}
</div>
</div>

  {/* Content and Pagination */}
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px' // Space above pagination
}}>
    <Pagination totalPages={11} initialPage={1} onPageChange={(page) => console.log('Current page:', page)} />
</div>

</Layout>

    );
};

// Styles
const headerBarStyle = {
    backgroundColor: '#F8F9FA',
    height: '80px',
    width: '75%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    justifyContent: 'flex-start',
    marginLeft: '250px',
};

const titleStyle = {
    fontFamily: 'Poppins',
    fontWeight: 700,
    color: '#121212',
    fontSize: '20px',
    margin: '0',
};

const searchBarStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CED4DA',
    borderRadius: '5px',
    padding: '5px 10px',
    width: '30%',
    position: 'relative',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginLeft: '80px',
};

const searchIconStyle = {
    position: 'absolute',
    left: '10px',
    display: 'flex',
    alignItems: 'center',
};

const searchInputStyle = {
    border: 'none',
    outline: 'none',
    backgroundColor: 'white',
    fontSize: '16px',
    width: '100%',
    paddingLeft: '35px',
};


const productListWrapperStyle = {
    marginTop: '0px',
    marginLeft: '250px',
    width: '75%',
    height: '7%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    backgroundColor: '#FFFFFF',
    borderBottom: '2px solid #E0E0E0',
    borderTop: '2px solid #E0E0E0',
};



const buttoncontainer = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '500px',
  }

const trashButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFCFC',
    color: '#FF1E1E',
    fontWeight: '600',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    border: '1px solid #FF1E1E',
};

const trashButtonTextStyle = {
    marginLeft: '10px',
};

export default RealCase;
