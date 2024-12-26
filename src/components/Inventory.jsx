import React, { useState, useEffect, useCallback } from 'react';
import Layout from './Layout';
import { FaPlus } from 'react-icons/fa';
import StockStatusButton from '../utils/StockStatusButton';
import Pagination from '../utils/Pagination';
import ActionStockButton from '../utils/ActionButtonStock';
import SuccessPopup from './SucessModal';
import CustomModal from './CustomModal';
import ImageDisplay from './imageDisplay';


import { invoke } from '@tauri-apps/api/core';
import { menuItems, navbarButtons } from './navbarItems';


const Inventory = () => {
    const [activeItem, setActiveItem] = useState('Stocks and Inventory');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null); // Track the open menu ID

    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages

    const [formData, setFormData] = useState({
        productName: '',
        company: '',
        measurement: '',
        price: '',
        quantity: '',
        status: '',
    });

    const showModal = () => {
        setIsModalVisible(true);
       
    };


    const handleOk = () => {
        setIsModalVisible(false);
        <SuccessPopup
        visible={isModalVisible}
        onClose={handleCancel} /> 
        loadStockData()


       
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        console.log("Modal Closed")
        console.log(isModalVisible)
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const loadStockData = useCallback(async () => {
        try {

            const data = await invoke("get_all_stocks_with_relations", );

            console.log("Stock Relations: ", data)

            if (!data || !Array.isArray(data.data)) {
                console.error("Invalid API response:", data);
                setStockData([]);
                setTotalPages(1);
                return;
            }
            
            setStockData(data.data);
            // // setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Failed to load companies:", error.message);
            setStockData([]);
            setTotalPages(1);
        }
    }, []);
    

    
    useEffect(() => {
        loadStockData();
        // console.log()
    }, [ loadStockData]);
    

    const handleDeleteStock = async (stockId) => {
        try {
            await invoke('delete_stock', { id: stockId });
            setStockData((prevStocks) => prevStocks.filter((stock) => stock.id !== stockId));
        } catch (error) {
            console.error('Failed to delete stock:', error);
        }
    };


    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'In Stock' ? 'No Stock' : 'In Stock';
        try {
            await invoke("update_stock", { id, update: { status: newStatus } });

            loadStockData();
        } catch (error) {
            console.error('Failed to update company status:', error);
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
                            <h3 style={titleStyle}>Inventory</h3>

                            {/* Search Bar */}
                            <div style={searchBarStyle}>
                                <span style={searchIconStyle}>
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5329 11.0713C13.5012 9.74996 13.9349 8.11176 13.7472 6.48442C13.5596 4.85708 12.7643 3.36061 11.5207 2.2944C10.2771 1.22819 8.67669 0.670877 7.03977 0.73395C5.40286 0.797023 3.85012 1.47584 2.6922 2.63458C1.53429 3.79333 0.856587 5.34655 0.794686 6.98351C0.732784 8.62046 1.29125 10.2204 2.35834 11.4633C3.42544 12.7062 4.92248 13.5003 6.54996 13.6869C8.17743 13.8734 9.81532 13.4385 11.1359 12.4693H11.1349C11.1649 12.5093 11.1969 12.5473 11.2329 12.5843L15.0829 16.4343C15.2704 16.6219 15.5248 16.7274 15.7901 16.7275C16.0554 16.7276 16.3098 16.6223 16.4974 16.4348C16.6851 16.2473 16.7905 15.9929 16.7906 15.7276C16.7907 15.4624 16.6854 15.2079 16.4979 15.0203L12.6479 11.1703C12.6122 11.1341 12.5737 11.1007 12.5329 11.0703V11.0713ZM12.7909 7.22727C12.7909 7.94954 12.6487 8.66474 12.3723 9.33203C12.0959 9.99932 11.6907 10.6056 11.18 11.1164C10.6693 11.6271 10.063 12.0322 9.3957 12.3086C8.7284 12.585 8.01321 12.7273 7.29094 12.7273C6.56867 12.7273 5.85347 12.585 5.18618 12.3086C4.51889 12.0322 3.91257 11.6271 3.40185 11.1164C2.89113 10.6056 2.486 9.99932 2.2096 9.33203C1.9332 8.66474 1.79094 7.94954 1.79094 7.22727C1.79094 5.76858 2.3704 4.36964 3.40185 3.33819C4.4333 2.30674 5.83225 1.72727 7.29094 1.72727C8.74963 1.72727 10.1486 2.30674 11.18 3.33819C12.2115 4.36964 12.7909 5.76858 12.7909 7.22727Z" fill="#212529"/>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    style={searchInputStyle}
                                />
                            </div>
                            

                            {/* Add New Product Button */}
                            <button style={addProductButtonStyle} onClick={showModal}>
                                <div style={plusIconStyle}>
                                    <FaPlus />
                                </div>
                                Add New Product
                            </button>
                        </div>

                        <CustomModal
                        isModalVisible={isModalVisible}
                        handleOk={handleOk}
                        onCancel={handleCancel}
                        handleInputChange={handleInputChange}
                        centered 
                        width={1600} 
                        bodyStyle={{ padding: '20px' }}
                        /> 
         

                        {/* Product List and Rectangle Button */}
                        <div style={productListWrapperStyle}>
                            <div style={productListTextStyle}>Product List</div>

                            <div style={trashButtonStyle}>
                                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#FF1E1E"/>
                                </svg>
                                <span style={trashButtonTextStyle}>
                                    Selected
                                </span>
                            </div>
                        </div>




                        <div style={{ marginTop: '0px', marginLeft: '250px', width:'78%', paddingLeft:'4px' }}>

    <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
    }}>
        <thead style={{
            backgroundColor: '#1E88E5',
        }}>
            <tr>
                <th style={{ color: 'white', padding: '8px', textAlign: 'left', width: '5%' }}>
                    <input type="checkbox" />
                </th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'left', width: '8%' }}>ID</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'left', width: '15%' }}>Company</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '20%' }}>Product Name</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '10%' }}>Measurement</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '8%' }}>Price</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '8%' }}>Quantity</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '10%' }}>Stock</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '8%' }}>Image</th>
                <th style={{ color: 'white', padding: '8px', textAlign: 'center', width: '8%' }}>Action</th>
            </tr>
        </thead>
        <tbody>
            {stockData.map((stock, index) => (
               
                <tr key={index} style={{
                    borderBottom: '1px solid #ccc',
                }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>
                        <input type='checkbox' />
                    </td>
                    <td style={{ padding: '0px', textAlign: 'left' }}>{stock.id}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{stock.company_name}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{stock.product_name}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{stock.measurement}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{stock.price}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{stock.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                    {<StockStatusButton status={stock.status} /> }
            
                    </td>

                    <td style={{ padding: '8px', textAlign: 'center' }}>
                    <ImageDisplay relativePath={stock.image} /></td>

                    <td style={{ padding: '8px', textAlign: 'center' }}>
                        <ActionStockButton
                        stock={stock}
                        onEdit={(updated) => (product.id, product.status)}
                        
                        onDelete={()=> handleDeleteStock(stock.id)}
                        onToggleStatus={(id, status) => toggleStatus(id=stock.id, status)}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        />

                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


  {/* Content and Pagination */}
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px' // Space above pagination
}}>
    <Pagination totalPages={totalPages} initialPage={1} onPageChange={(page) => setCurrentPage(page)} />
</div>          

    </Layout>

    );
};

// Styles
const headerBarStyle = {
    backgroundColor: '#F8F9FA',
    height: '80px',
    width: '76%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    justifyContent: 'flex-start',
    marginLeft: '250px',
    marginTop: '20px',
};

const titleStyle = {
    fontFamily: 'Nunito',
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

const addProductButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '20px',
};

const plusIconStyle = {
    marginRight: '10px',
};

const productListWrapperStyle = {
    marginTop: '0px',
    marginLeft: '250px',
    width: '76%',
    height: '7%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    backgroundColor: '#FFFFFF',
    borderBottom: '2px solid #E0E0E0',
    borderTop: '2px solid #E0E0E0',
};

const productListTextStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginTop: "10px"
    
};

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



export default Inventory;
