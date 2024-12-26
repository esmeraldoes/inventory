import React, { useState, useContext } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import CaseActionMenu from './DropDownCase';
import CaseBillEditModal from '../components/CaseEditModal';

const ActionCaseButton = ({
    casebill,
    onEdit,
    onDelete,
    onPrintBill,
    openMenuId,
    setOpenMenuId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
        setOpenMenuId(openMenuId === casebill.id ? null : casebill.id); // Open or close menu
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setOpenMenuId(null); // Close the dropdown menu when modal opens
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
            {openMenuId === casebill.id && (
                <CaseActionMenu
                casebill={casebill}
                onEdit={openEditModal}
                onDelete={onDelete}
                onPrintBill={onPrintBill}
                
                />               
            )}

            {/* Modal for editing stock */}
            {isModalOpen && (
                <CaseBillEditModal

                casebillId={casebill.id}
                currentCustomer={casebill.customer_name}
                currentDate={casebill.date}
                currentMobileNumber={casebill.customer_phone}
                currentAddress={casebill.address}
               
                closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default ActionCaseButton;
