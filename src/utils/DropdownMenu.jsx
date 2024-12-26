import React from 'react';

const ActionMenu = ({ company, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      right: '0',
      width: '150px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '8px 0',
      zIndex: 1000,
    }}>
      <div style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }} onClick={() => onEdit(company.id)}>
        Edit
        <svg width="19" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.99994L15 5.99994M10 16.9999H18M2 12.9999L1 16.9999L5 15.9999L16.586 4.41394C16.9609 4.03889 17.1716 3.53027 17.1716 2.99994C17.1716 2.46961 16.9609 1.961 16.586 1.58594L16.414 1.41394C16.0389 1.039 15.5303 0.828369 15 0.828369C14.4697 0.828369 13.9611 1.039 13.586 1.41394L2 12.9999Z" stroke="#4A8404" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }} onClick={() => onDelete(company.id)}>
        Delete
        <svg width="14" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6.58406V17.233H3V6.58406H11ZM9.5 0.194702H4.5L3.5 1.2596H0V3.38938H14V1.2596H10.5L9.5 0.194702ZM13 4.45428H1V17.233C1 18.4044 1.9 19.3628 3 19.3628H11C12.1 19.3628 13 18.4044 13 17.233V4.45428Z" fill="#FF1616"/>
        </svg>
      </div>
      
      <div
          style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }}
          onClick={() => onToggleStatus(company.id, company.status)}
      >
          {company.status === 'active' ? 'Inactive' : 'Active'}
          <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              {company.status === 'active' ? (
                <>
                <path d="M10 19.1429C15.0495 19.1429 19.1429 15.0495 19.1429 10C19.1429 4.95057 15.0495 0.857178 10 0.857178C4.95057 0.857178 0.857178 4.95057 0.857178 10C0.857178 15.0495 4.95057 19.1429 10 19.1429Z" stroke="#FF1616" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.57153 6.57141L13.4287 13.4286M13.4287 6.57141L6.57153 13.4286" stroke="#FF1616" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                
                  <path d="M9.99992 0.833374C4.95825 0.833374 0.833252 4.95837 0.833252 10C0.833252 15.0417 4.95825 19.1667 9.99992 19.1667C15.0416 19.1667 19.1666 15.0417 19.1666 10C19.1666 4.95837 15.0416 0.833374 9.99992 0.833374ZM9.99992 17.3334C5.95742 17.3334 2.66659 14.0425 2.66659 10C2.66659 5.95754 5.95742 2.66671 9.99992 2.66671C14.0424 2.66671 17.3333 5.95754 17.3333 10C17.3333 14.0425 14.0424 17.3334 9.99992 17.3334ZM14.2074 5.94837L8.16659 11.9892L5.79242 9.62421L4.49992 10.9167L8.16659 14.5834L15.4999 7.25004L14.2074 5.94837Z" fill="#10A242"/>
                  
              )}
          </svg>
      </div>



    </div>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 15px',
  color: '#333',
  fontSize: '14px',
  cursor: 'pointer',
};

export default ActionMenu;

