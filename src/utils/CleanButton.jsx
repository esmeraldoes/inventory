import React from 'react';

function SquareButton({ text, onClick, style }) {
  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content', // Let the button width adjust to the content
        height: '40px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        color: '#1E88E5',
        cursor: 'pointer',
        marginLeft: '30px',
        ...style,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default SquareButton;

