import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const SuccessPopup = ({ visible, onClose, title = "Congratulations", message = "New stock added successfully." }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      style={{
        maxWidth: '400px',
        textAlign: 'center',
        borderRadius: '10px',
      }}
      bodyStyle={{
        padding: '24px',
        borderRadius: '10px',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '27.28px' }}>
        {title}
      </h2>
      <p style={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
        {message}
      </p>
      <Button
        type="primary"
        onClick={onClose}
        style={{
          width: '100%',
          height: '44px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #14ADD6 0%, #384295 100%)',
          color: '#fff',
          fontWeight: '600',
        }}
      >
        Ok
      </Button>
    </Modal>
  );
};

export default SuccessPopup;

