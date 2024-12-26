import React, { useState } from 'react';
import styled from 'styled-components';
import { DatePicker, Input, Button, message } from 'antd';
import { LeftOutlined, PrinterOutlined } from '@ant-design/icons';
import SuccessPopup from './SucessModal';
import { invoke } from '@tauri-apps/api/core';
import moment from 'moment';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background-color: #e3e6e8;  // White background
  border-radius: 10px;
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
  background-color: #ffffff;  // White background for each section
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
  background-color: #ffffff;  // White background
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

const CreateCaseForm = () => {
  // const [total_cost, setTotalCost] = useState(0);
  const [name, setName] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(null);
  const [case_bill_amount, setCaseBillAmount] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false); 


  const handleSave = async () => {
    try {
  
      const caseData = {
      
        name: name,
        mobile_number: mobile_number,
        address: address,
        date: date ? moment(date).format('YYYY-MM-DD') : null,
        case_bill_amount: parseFloat(case_bill_amount)

      };


      await invoke("create_case_bill",{ newCaseBill: caseData}) 
    
      message.success('Case saved successfully');
      setIsModalVisible(true);
    } catch (error) {
      console.log(error)
      message.error('Failed to save the case');
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.href = '/inventory';
    // history.push('/inventory'); // Navigate back to inventory page
  };



  return (
    <Wrapper>
      
      {/* First Rounded Section */}
      <Section>
      <BackButton icon={<LeftOutlined />}>Back</BackButton>
      <Title>Create a New Bill</Title>
      <Subtitle>Kindly fill in the form below to submit a New Bill</Subtitle>

        <Row>
          <InputWrapper flex="0.6">
            <Label>Name</Label>
            <RoundedInput placeholder="Enter Name" onChange={(e)=>setName(e.target.value)} />
          </InputWrapper>
          <InputWrapper flex="0.4">
            <Label>Mobile Number</Label>
            <RoundedInput placeholder="Enter Mobile Number" onChange={(e)=>setMobileNumber(e.target.value)} />
          </InputWrapper>
        </Row>

        <Row>
          <InputWrapper>
            <Label>Address</Label>
            <RoundedInput placeholder="Enter Address" onChange={(e)=>setAddress(e.target.value)} />
          </InputWrapper>
        </Row>

        <Row>
          <InputWrapper flex="0.6">
            <Label>Case Bill Amount</Label>
          {/*  <Select placeholder="Select company" style={{ width: '100%', borderRadius: '8px' }} /> */}
          <RoundedInput name="case" placeholder="Enter Case Amount" onChange={(e)=>setCaseBillAmount(e.target.value)} />
          </InputWrapper>
          <InputWrapper flex="0.4">
            <Label>Date From</Label>
            <DatePicker
            style={{ width: '100%' }}
            onChange={(date)=>setDate(date)}
          />
          </InputWrapper>
        </Row>
      </Section>

      <Section>
   


      <TotalAmountDiv>
        <TotalAmountText>Total Amount</TotalAmountText>
        <Button style={{ background: '#FFBF00', color: '#000', borderRadius: '10px' }}>
          <svg width="13" height="18" fill="black" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.16 4C7.6 2.82 6.4 2 5 2H0.5V0H12.5V2H9.24C9.72 2.58 10.08 3.26 10.29 4H12.5V6H10.48C10.23 8.8 7.87 11 5 11H4.27L11 18H8.23L1.5 11V9H5C6.76 9 8.22 7.7 8.46 6H0.5V4H8.16Z" fill="black"/>

          </svg>
        {case_bill_amount}
        </Button>
      </TotalAmountDiv>

      <Row>
        <RoundedButton onClick={handleSave}>Save</RoundedButton>
        <PrinterOutlined style={{ fontSize: '30px', marginLeft: '15px', color: 'black' }} />
      </Row>
      <SuccessPopup
        visible={isModalVisible}
        onClose={handleModalOk}
        title = {"Congratulations"}
        message = {"Case Bill have been saved successfully."}
        >
      </SuccessPopup>


       </Section>
    </Wrapper>
  );
};

export default CreateCaseForm;
