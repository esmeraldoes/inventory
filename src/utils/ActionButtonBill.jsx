import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import BillEditModal from '../components/BillEditModal';
import BillActionMenu from './DropDownBill';



const ActionBillButton = ({
    bill,
    onEdit,
    onDelete,
    onPrintBill,
    onPrintChallan,
    openMenuId,
    setOpenMenuId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
        setOpenMenuId(openMenuId === bill.id ? null : bill.id); 
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setOpenMenuId(null); 
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Button to toggle menu */}
            <button
                onClick={toggleMenu}
                style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FFBF00',
                    borderRadius: '50%',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <FaEllipsisV style={{ color: '#000', fontSize: '14px' }} />
            </button>



            {/* Dropdown menu */}
            {openMenuId === bill.id && (
                <BillActionMenu

                bill={bill}
                onEdit={openEditModal}
                onDelete={onDelete}
                onPrintChallan={onPrintChallan}
                onPrintBill={onPrintBill}
                />

               
            )}

            {/* Modal for editing stock */}
            {isModalOpen && (
                <BillEditModal
               
                    billId={bill.id}
                    currentCustomer={bill.customer_name}
                    currentDate={bill.date}
                    currentMobileNumber={bill.customer_phone}
                    currentAddress={bill.address}
                   
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default ActionBillButton;
