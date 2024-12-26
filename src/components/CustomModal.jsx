import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Upload } from 'antd';
import { LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/core';

const { Option } = Select;

const CustomModal = ({ isModalVisible, handleOk, onCancel }) => {
  const [measurement, setMeasurement] = useState('');
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    company: '',
    companyName: '',
    product: '',
    productName: '',
    measurement: '',
    price: '',
    quantity: '',
    dateFrom: '',
    image: null,
  });


  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        
        const data = await invoke("get_all_companies");
        const activeCompanies = data.data.filter((company) => company.status === 'active');
        setCompanies(activeCompanies);
        // setCompanies(data.results);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompaniesData();
  }, []);


  const handleCompanySelect = async (companyId) => {
    const selectedCompany = companies.find(company => company.id === companyId);
    setFormData((prevData) => ({
      ...prevData,
      company: selectedCompany.id,   // Store ID for submission
      companyName: selectedCompany.name,  // Store name for display
    }));
    setProducts([]);
    try {
        const fetchedProducts = await invoke('get_products_by_company', { companyId: companyId });
        if (fetchedProducts.success) {
            const activeProducts = fetchedProducts.data.filter((product) => product.status === 'active');
            setProducts(activeProducts);
        } else {
            console.error("Failed to fetch products:", fetchedProducts);
        }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const handleProductSelect = async (productId) => {
    const selectedProduct = products.find(product => product.id === productId);
    setMeasurement(selectedProduct.measurement);
    setFormData((prevData) => ({
      ...prevData,
      product: selectedProduct.id,   // Store ID for submission
      productName: selectedProduct.name,  // Store name for display
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleImageUpload = async (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      alert('Please upload a valid image file');
      return false;
    }
  
    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(',')[1]; // Remove the data URL part
      setFormData((prevData) => ({
        ...prevData,
        image: base64Image, // Store base64 encoded image
      }));
    };
    reader.readAsDataURL(file);
  
    return false; // Prevent the default upload behavior
  };
  

  const handleSave = async () => {
    const dataToSend = {
      product_id: formData.product,
      company_id: formData.company,
      measurement: measurement,
      // price: formData.price, 
      price: parseFloat(formData.price), 
      quantity: parseInt(formData.quantity, 10),
      image: formData.image,  // base64 string if there's an image
      date: formData.dateFrom,
    };
    

    try {
      const response = await invoke("create_stock", {newStock: dataToSend});  // Pass data to Tauri command
      handleOk();
    } catch (error) {
      console.error("Error creating stock:", error);
    }
  };
    
  
  
  return (
    <Modal
      open={isModalVisible}
      onCancel={onCancel}
      title={null}
      footer={null}
      style={{
        maxWidth: '80vw',
        top: '50px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #14ADD6 0%, #384295 100%)',
        padding: '0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }} onClick={onCancel}>
        <LeftOutlined style={{ marginRight: '8px', cursor: 'pointer' }} />
        <span style={{ fontSize: '16px', fontWeight: '400' }}>Back</span>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '27.28px', marginBottom: '8px' }}>Create New Stock</h2>
      <p style={{ fontSize: '14px', fontWeight: '400', lineHeight: '24px' }}>
        Kindly fill in the form below to submit a New Stock
      </p>

      {/* Row 1 */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
        <div style={{ flex: '1' }}>
          <label style={labelStyle}>Select Company</label>
          <Select style={inputStyle} onChange={handleCompanySelect}>
            {companies.map((company) => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ flex: '1' }}>
          <label style={labelStyle}>Product Name</label>
          <Select style={inputStyle} onChange={handleProductSelect}>
            {products.map((product) => (
              <Option key={product.id} value={product.id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ flex: '1' }}>
          <label style={labelStyle}>Measurement</label>
          <Input name="measurement" style={inputStyle} value={measurement} disabled />
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
        <div style={{ flex: '1' }}>
          <label style={labelStyle}>Price (Rs)</label>
          <Input name="price" style={inputStyle} placeholder="Enter price" onChange={handleInputChange} />
        </div>

        <div style={{ flex: '1' }}>
          <label style={labelStyle}>Quantity</label>
          <Input name="quantity" style={inputStyle} placeholder="Enter quantity" onChange={handleInputChange} />
        </div>

        <div style={{ flex: '1' }}>
          <label style={labelStyle}>Upload Image</label>
          <Upload beforeUpload={handleImageUpload}>
            <Button>Upload</Button>
          </Upload>
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={imagePreviewStyle}>
          <span>Image Preview</span>
          {formData.image && (
            <img
            src={`data:image/png;base64,${formData.image}`}
            alt="preview"
            style={{ width: '100px', height: 'auto' }}
          />
          )}
        </div>
      </div>

      {/* Row 4 */}
      <div style={{ marginBottom: '16px', width: '50%' }}>
        <label style={labelStyle}>Date From</label>
        <Input name="dateFrom" type="date" style={inputStyle} onChange={handleInputChange} />
      </div>

      {/* Final Row */}
      <Button style={saveButtonStyle} onClick={handleSave}>
        Save
      </Button>
    </Modal>
  );
};

// Styles
const labelStyle = {
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '24px',
  display: 'block',
  marginBottom: '4px',
};

const inputStyle = {
  width: '100%',
  height: '50px',
  border: '1px solid #D0D0D0',
  borderRadius: '10px',
};

const imagePreviewStyle = {
  width: '100%',
  height: '68px',
  border: '1px solid #D0D0D0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const saveButtonStyle = {
  width: '100%',
  height: '44px',
  borderRadius: '6px',
  background: 'linear-gradient(135deg, #14ADD6 0%, #384295 100%)',
  color: '#fff',
  fontWeight: '600',
};

export default CustomModal;


