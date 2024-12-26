import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DatePicker, Select, Input, Button, message } from 'antd';
import { LeftOutlined, PrinterOutlined } from '@ant-design/icons';
import SuccessPopup from './SucessModal';
import { invoke } from '@tauri-apps/api/core';
import moment from 'moment';


const CreateBillForm = () => {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [total_cost, setTotalCost] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const [rows, setRows] = useState([
    { product: '', quantity: '', measurement: '', value: '', rate: '', row_total: 0 }
  ]);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    company: '',
    date: null,
    hammali: '',
    freight: '',
    case_amount: '',
    remark: '',
  });



  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {0
        const data = await invoke("get_all_companies");
        const activeCompanies = data.data.filter((company) => company.status === 'active');
        setCompanies(activeCompanies);
      
      } catch (error) {
        message.error('Error loading companies');
      }
    };
    fetchCompaniesData();
  }, []);

  const handleCompanySelect = async (companyId) => {
    setFormData((prevData) => ({ ...prevData, company: companyId }));
    try {
      const fetchedProducts = await invoke('get_products_by_company', { companyId: companyId });
      if (fetchedProducts.success) {
        const activeProducts = fetchedProducts.data.filter((product) => product.status === 'active');
        setProducts(activeProducts);
    } else {
        console.error("Failed to fetch products:", fetchedProducts);
    }

    } catch (error) {
      message.error('Error loading products');
    }
  };

  const handleProductSelect = async (rowIndex, product) => {
    const newRows = [...rows];

    newRows[rowIndex].product = product;
    try {
      const productDetails = await invoke("get_product_by_id", {id:product});
      console.log("D PROD: ", productDetails)
      newRows[rowIndex].measurement = productDetails.data.measurement;
      setRows(newRows);
    } catch (error) {
      message.error('Error loading product details');
    }
  };

  const handleInputChange = (rowIndex, e) => {
    const { name, value } = e.target;
  
    if (typeof rowIndex === 'number') {
      const newRows = [...rows];
      newRows[rowIndex][name] = value;
  
      if (name === 'quantity' || name === 'rate') {
        const quantity = parseFloat(newRows[rowIndex].quantity) || 0;
        const rate = parseFloat(newRows[rowIndex].rate) || 0;
        newRows[rowIndex].row_total = quantity * rate;
      }
      setRows(newRows);
    } else {
      setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: value };
        if (name === 'hammali' || name === 'freight') {
          calculateTotalCost(rows, updatedData.hammali, updatedData.freight);
        }
        return updatedData;
      });
    }
  };


  const addRow = () => {
    setRows([...rows, { product: '', quantity: '', measurement: '', value: '', rate: '', row_total: 0 }]);
  };

  const deleteRow = (rowIndex) => {
    const newRows = rows.filter((_, index) => index !== rowIndex);
    setRows(newRows);
    calculateTotalCost(newRows);
  };

  const calculateTotalCost = (rowsData, hammali, freight) => {
    const total = rowsData.reduce((acc, row) => acc + row.row_total, 0);
    const hammaliCost = parseFloat(hammali) || 0;
    const freightCost = parseFloat(freight) || 0;
    setTotalCost(total + hammaliCost + freightCost);
  };

  useEffect(() => {
    calculateTotalCost(rows, formData.hammali, formData.freight);
  }, [rows, formData.hammali, formData.freight]);
  

  const handleSave = async () => {
    try {
      
      const items = rows.map((row) => ({
        
        product_id: row.product,
        quantity: parseInt(row.quantity, 10),
        measurement: row.measurement,
        value: parseFloat(row.value),
        rate: parseFloat(row.rate),
        row_total: row.row_total,

      }));

      const caseAmount = parseFloat(formData.case_amount) || 0;
     
      const totalAmount = total_cost - caseAmount;
      const billData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        address: formData.address,
        company_id: formData.company,

        date: formData.date ? moment(formData.date).format('YYYY-MM-DD') : null,
        items,
        case_amount: parseFloat(formData.case_amount),
        freight: parseFloat(formData.freight),
        hammali:parseFloat(formData.hammali),
        total_cost,
        remark: formData.remark,
        total_amount: totalAmount,

      };
      console.log(billData)
      
      const response = await invoke("create_bill", { newBill: billData });
      
      message.success('Bill saved successfully');
      setIsModalVisible(true);
    } catch (error) {
      console.log(error)
      message.error('Failed to save the bill',error);
    }

  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.href = '/invoice';
  };



  return (
    
    <Wrapper>
      <Section>
        <BackButton icon={<LeftOutlined />}>Back</BackButton>
        <Title>Create a New Bill</Title>
        <Subtitle>Fill in the form below to submit a new bill</Subtitle>

        <Row>
          <InputWrapper flex="0.6">
            <Label>Name</Label>
            <RoundedInput name="customer_name" placeholder="Enter Name" onChange={(e) => handleInputChange(null, e)} />
          </InputWrapper>
          <InputWrapper flex="0.4">
            <Label>Mobile Number</Label>
            <RoundedInput name="customer_phone" placeholder="Enter Mobile Number" onChange={(e) => handleInputChange(null, e)} />
          </InputWrapper>
        </Row>

        <Row>
          <InputWrapper>
            <Label>Address</Label>
            <RoundedInput name="address" placeholder="Enter Address" onChange={(e) => handleInputChange(null, e)} />
          </InputWrapper>
        </Row>

        <Row>
          <InputWrapper flex="0.6">
            <Label>Select Company</Label>
            <Select
              placeholder="Select company"
              style={{ width: '100%' }}
              onChange={handleCompanySelect}
            >
              {companies.map((company) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.name}
                </Select.Option>
              ))}
            </Select>
          </InputWrapper>
          <InputWrapper flex="0.4">
            <Label>Date</Label>
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => setFormData({ ...formData, date })}
            />
          </InputWrapper>
        </Row>
      </Section>

      <Section>
        {rows.map((row, index) => (
          <Row key={index}>
            <InputWrapper flex="0.2">
              <Label>Item</Label>
              <Select
                placeholder="Select item"
                style={{ width: '100%' }}
                onChange={(value) => handleProductSelect(index, value)}
              >
                {products.map((product) => (
                  <Select.Option key={product.id} value={product.id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </InputWrapper>
            <InputWrapper flex="0.2">
              <Label>Quantity</Label>
              <RoundedInput
                name="quantity"
                placeholder="0"
                value={row.quantity}
                onChange={(e) => handleInputChange(index, e)}
              />
            </InputWrapper>
            <InputWrapper flex="0.1">
              <Label>Measurement</Label>
              <RoundedInput
                name="measurement"
                placeholder="MM"
                value={row.measurement}
                disabled
              />
            </InputWrapper>
            <InputWrapper flex="0.2">
              <Label>Value</Label>
              <RoundedInput
                name="value"
                placeholder="Value"
                value={row.value}
                onChange={(e) => handleInputChange(index, e)}
              />
            </InputWrapper>
            <InputWrapper flex="0.2">
              <Label>Rate</Label>
              <RoundedInput
                name="rate"
                placeholder="Rate"
                value={row.rate}
                onChange={(e) => handleInputChange(index, e)}
              />
            </InputWrapper>
            <InputWrapper flex="0.15">
              <Label>Row Total</Label>
              <RoundedInput
                value={row.row_total}
                disabled
                style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
              />
            </InputWrapper>
            <Button style={{top:'20px'}} onClick={() => deleteRow(index)}>
            <svg width="16" height="14" viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.99996 29.8333C1.99996 31.85 3.64996 33.5 5.66663 33.5H20.3333C22.35 33.5 24 31.85 24 29.8333V7.83333H1.99996V29.8333ZM25.8333 2.33333H19.4166L17.5833 0.5H8.41663L6.58329 2.33333H0.166626V6H25.8333V2.33333Z" fill="#FF1E1E"/>
              </svg>

            </Button>
            
          </Row>
        ))}

        <Row>
          <Button type="primary" onClick={addRow}>+ Add</Button>
        </Row>

        <Row>
        <InputWrapper flex="0.5">
          <Label>Hammali</Label>
          <RoundedInput name="hammali" onChange={(e) => handleInputChange(null, e)} />
        </InputWrapper>
        <InputWrapper flex="0.5">
          <Label>Freight</Label>
          <RoundedInput name="freight" onChange={(e) => handleInputChange(null, e)} />
        </InputWrapper>

          <TotalCostCard>
            <TotalCostText>Rs {total_cost}</TotalCostText>
            <CostLabel>Total Cost</CostLabel>
          </TotalCostCard>
        </Row>

        <Row>
          <InputWrapper>
            <Label>Case Amount</Label>
            <RoundedInput name="case_amount" onChange={(e) => handleInputChange(null, e)} />
          </InputWrapper>
        </Row>

        <Row>
          <InputWrapper>
            <Label>Remark</Label>
            <RoundedInput name="remark" onChange={(e) => handleInputChange(null, e)} style={{height: '70px'}} />
          </InputWrapper>
        </Row>

    
      </Section>

      <Section>
      <TotalAmountDiv>
      <TotalAmountText>Total Amount</TotalAmountText>
 
      
      <Button style={{ background: '#FFBF00', color: '#000', borderRadius: '10px' }}>

      <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.16 4C7.6 2.82 6.4 2 5 2H0.5V0H12.5V2H9.24C9.72 2.58 10.08 3.26 10.29 4H12.5V6H10.48C10.23 8.8 7.87 11 5 11H4.27L11 18H8.23L1.5 11V9H5C6.76 9 8.22 7.7 8.46 6H0.5V4H8.16Z" fill="black"/>
        </svg>
        Rs {total_cost - (parseFloat(formData.case_amount) || 0)}
      </Button>
    </TotalAmountDiv>
      </Section>

      <Section>
        <Button type="primary" style={{ marginTop: '20px' }} onClick={handleSave}>
          Save
        </Button>
        <Button type="default" style={{ marginTop: '20px', marginLeft: '10px' }}>
          <PrinterOutlined /> Print
        </Button>

        <SuccessPopup
      
        visible={isModalVisible}
        onClose={handleModalOk}
        title = {"Congratulations"}
        message = {"New stock added successfully."}
        >
        </SuccessPopup>
  
      </Section>
    </Wrapper>
  );
};




const Wrapper = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background-color: #e3e6e8;
  border-radius: 10px;
  overflow-y: auto;  // Enables vertical scrolling
  height: 100vh; 
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: Nunito;
  color: #000;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-family: Nunito;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  font-family: Nunito;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  margin-bottom: 15px;
`;

const Section = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const InputWrapper = styled.div`
  flex: ${props => props.flex || 1};
`;

const Label = styled.label`
  font-family: Nunito;
  font-size: 14px;
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
`;

const RoundedInput = styled(Input)`
  border-radius: 8px;
  
`;

const TotalCostCard = styled.div`
  width: 165px;
  height: 53px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const TotalCostText = styled.div`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 800;
`;

const CostLabel = styled.div`
  font-family: Nunito;
  font-size: 11px;
  font-weight: 400;
`;

const TotalAmountDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
`;

const TotalAmountText = styled.div`
  font-family: Nunito;
  font-size: 28px;
  font-weight: 700;
`;

const RoundedButton = styled(Button)`
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #14add6 0%, #384295 100%);
  color: white;
  font-family: Nunito;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
`;


const TotalAmountCardText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #000;  // or any color you need
`;


export default CreateBillForm;



