

import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import ActionMenu from './DropdownMenu';
// import StockActionMenu from './Dropdown';
import CompanyEditModal from '../components/CompanyEditModal';


const ActionButton = ({ company, onEdit, onDelete, onToggleStatus, openMenuId, setOpenMenuId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
        setOpenMenuId(openMenuId === company.id ? null : company.id); // Open or close menu
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setOpenMenuId(null); // Close menu when modal opens
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
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
            {openMenuId === company.id && (
                <ActionMenu
                    company={company}
                    onEdit={openEditModal}
                    onDelete={onDelete}
                    onToggleStatus={() => onToggleStatus(company.id, company.status)}
                    />
            )}
            
            {isModalOpen && (
                <CompanyEditModal
                    companyId={company.id}
                    currentName={company.name}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default ActionButton;

