import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyButton = ({ icon, label, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path); 
    }
  };

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#4299e1',
        color: '#fff',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: '30px',
      }}
      onClick={handleClick}
    >
      {icon}
      {label}
    </button>
  );
};

export default MyButton;

