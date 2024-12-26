import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { invoke } from '@tauri-apps/api/core';
import { DatePicker, message } from 'antd';



const CaseBillEditModal = ({
    casebillId,
    currentCustomer,
    currentDate,
    currentMobileNumber,
    currentAddress,
    closeModal,
}) => {

    const [newCustomer, setNewCustomer] = useState(currentCustomer);
    const [newDate, setNewDate] = useState(moment(currentDate)); // Use moment for date handling
    const [newMobileNumber, setNewMobileNumber] = useState(currentMobileNumber);
    const [newAddress, setNewAddress] = useState(currentAddress);
    
    
            // Mobile number validation function
        const validateMobileNumber = (mobileNumber) => {
            const mobileRegex = /^[0-9]{10}$/; // Ensure 10 digits
            return mobileRegex.test(mobileNumber);
        };


    const handleSave = async () => {
        try {

            if (!validateMobileNumber(newMobileNumber)) {
                message.error('Please enter a valid 10-digit mobile number.');
                return;
              }
            // Prepare the updated data payload
            const updatedData = {
                id: casebillId,
                customer_name: newCustomer,
                customer_phone: newMobileNumber,
                date: newDate.format('YYYY-MM-DD'), 
                address: newAddress,
            };
    
           
            await invoke("update_case_bill", {
                id: casebillId,
                updateCaseBill: updatedData,
            });
            
    
            alert('Case Bill details updated successfully!');
            closeModal();
        } catch (error) {
            console.error('Error updating case Bill details:', error);
            alert('There was an error updating the case bill details.');
        }
    };
    
    return (
        <div style={modalBackdropStyle}>
            <div style={modalContentStyle}>
                <h2>Edit Case Bill Details</h2>

                 {/* Customer */}
                 <div style={formGroupStyle}>
                 <label style={labelStyle}>Customer</label>
                 <input
                     type="text"
                     value={newCustomer}
                     onChange={(e) => setNewCustomer(e.target.value)}
                     style={inputStyle}
                 />
             </div>

                {/* Date */}
                <div style={formGroupStyle}>
                <label style={labelStyle}>Date</label>
                <DatePicker
                value={newDate}
                onChange={(date) => setNewDate(date)} // Handle date selection
                format="YYYY-MM-DD" // Ensure consistent date format
                style={inputStyle}
                />
            </div>


             

           {/* Mobile Number */}
           <div style={formGroupStyle}>
           <label style={labelStyle}>Mobile Number</label>
           <input
               type="number"
               value={newMobileNumber}
               onChange={(e) => setNewMobileNumber(e.target.value)}
               style={inputStyle}
           />
       </div>

                    {/* Address */}
                    <div style={formGroupStyle}>
                    <label style={labelStyle}>Address</label>
                    <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        style={inputStyle}
                    />
                </div>

             

                {/* Buttons */}
                <div style={buttonContainerStyle}>
                    <button onClick={handleSave} style={buttonStyle}>
                        Save
                    </button>
                    <button onClick={closeModal} style={cancelButtonStyle}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};




// Styles for the modal
const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
};

const formGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
};

const cancelButtonStyle = {
    backgroundColor: '#FF1616',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
};


export default CaseBillEditModal;
