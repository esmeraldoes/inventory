import React from 'react';

const BillActionMenu = ({ bill, onEdit, onDelete, onPrintChallan, onPrintBill }) => {
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
      <div style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }} onClick={() => onEdit(bill.id)}>
        Edit
        <svg width="19" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.99994L15 5.99994M10 16.9999H18M2 12.9999L1 16.9999L5 15.9999L16.586 4.41394C16.9609 4.03889 17.1716 3.53027 17.1716 2.99994C17.1716 2.46961 16.9609 1.961 16.586 1.58594L16.414 1.41394C16.0389 1.039 15.5303 0.828369 15 0.828369C14.4697 0.828369 13.9611 1.039 13.586 1.41394L2 12.9999Z" stroke="#4A8404" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }} onClick={() => onDelete(bill.id)}>
        Delete
        <svg width="14" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6.58406V17.233H3V6.58406H11ZM9.5 0.194702H4.5L3.5 1.2596H0V3.38938H14V1.2596H10.5L9.5 0.194702ZM13 4.45428H1V17.233C1 18.4044 1.9 19.3628 3 19.3628H11C12.1 19.3628 13 18.4044 13 17.233V4.45428Z" fill="#FF1616"/>
        </svg>
      </div>
      
      <div style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }} onClick={() => onPrintChallan(bill.id)}>
       Print Challan
        <svg width="14" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6.58406V17.233H3V6.58406H11ZM9.5 0.194702H4.5L3.5 1.2596H0V3.38938H14V1.2596H10.5L9.5 0.194702ZM13 4.45428H1V17.233C1 18.4044 1.9 19.3628 3 19.3628H11C12.1 19.3628 13 18.4044 13 17.233V4.45428Z" fill="#FF1616"/>
        </svg>
      </div>

      <div style={{ ...menuItemStyle, borderBottom: '1px solid #E0E0E0' }} onClick={() => onPrintBill(bill.id)}>
      Print Bill
      <svg width="14" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 6.58406V17.233H3V6.58406H11ZM9.5 0.194702H4.5L3.5 1.2596H0V3.38938H14V1.2596H10.5L9.5 0.194702ZM13 4.45428H1V17.233C1 18.4044 1.9 19.3628 3 19.3628H11C12.1 19.3628 13 18.4044 13 17.233V4.45428Z" fill="#FF1616"/>
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

export default BillActionMenu;

