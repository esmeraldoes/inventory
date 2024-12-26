import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { invoke } from '@tauri-apps/api/core';

import { useParams,useNavigate } from 'react-router-dom';
import './ChallanBill.css';

const MemoBill = () => {
  const [billData, setBillData] = useState(null); // Bill data
  const [loading, setLoading] = useState(true); // Loading state
  const challanRef = useRef(null);
  const { challanId } = useParams();
  const navigate = useNavigate();
  const id = parseInt(challanId, 10); 

  const capitalizeText = (text) => {
    if (typeof text !== 'string') {
      console.warn("Expected a string but got:", typeof text, text);
      return text;
    }
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };



  useEffect(() => {
    const loadBillData = async () => {
      try {
        console.log("Fetching bill by ID...");
        const bill = await invoke('get_bill_by_id', { id: id });
        console.log("Bill fetched:", bill);

        if (bill.data && bill.data.items) {
          console.log("Fetching product names for itemsYYYYHGXHB...", bill);
          const itemsWithNames = await fetchAndSetProductNames(bill.data.items);
          console.log("Items with product names:", itemsWithNames);
          setBillData({ ...bill.data.bill, items: itemsWithNames });
        } else {
          console.warn("No items found in the bill data.");
          setBillData(bill.data || {});
        }
      } catch (error) {
        console.error("Failed to load bill data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBillData();
  }, [id]);

  const fetchAndSetProductNames = async (items) => {
    return await Promise.all(
      items.map(async (item) => {
        try {
          console.log("Fetching product details for ID:");
          const productDetails = await invoke('get_product_by_id', { id: item.product_id });
          console.log("Product details fetched:", productDetails);
          return { ...item, productName: productDetails.data.name };
        } catch (error) {
          console.error(`Error fetching product name for ID ${item.product}`, error);
          return { ...item, productName: "Unknown Product" };
        }
      })
    );
  };


  const generatePDF = () => {
    const input = challanRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [105, 148]); // A6 size
      const pdfWidth = 105;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const marginTop = (148 - pdfHeight) / 2;
      pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
      pdf.save('MemoBill-A6.pdf');
    });
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Show loading spinner or message
  if (loading) {
    return <p>Loading...</p>;
  }

  // Handle empty or invalid data
  if (!billData) {
    return <p>Failed to load data. Please try again.</p>;
  }

  const { customer_name, customer_phone, address, date, total_amount, freight, hammali, total_cost, items = [], remark, case_amount } = billData;

  return (
    <div className="challan-container">
      <div className="challan-content" ref={challanRef}>
      <button className="close-btn" onClick={handleClose}>X</button> {/* Close button */}

        <h1 className="heading">ESTIMATE MEMO</h1>
        <div className="header">
          <div className="left-section">
            <div className="stamp-box">STAMP</div>
            <div className="details">
              <p><strong>Name:</strong> {capitalizeText(customer_name)}</p>
              <p><strong>Address:</strong> {capitalizeText(address)}</p>
            </div>
          </div>
          <div className="right-section">
            <div className="details right-align">
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Mobile No:</strong> {customer_phone}</p>
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Particular</th>
              <th>Type</th>
              <th>Unit</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{capitalizeText(item.productName)}</td>
                <td>{item.quantity}</td>
                <td>{capitalizeText(item.measurement)}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer">
        <div className="remark">
          <div className="remark-details">
            <span><strong>Hammali:</strong> {hammali}</span>
            <span><strong>Freight:</strong> {freight}</span>
            <span className="total"><strong>Total:</strong> <strong>{total_cost}</strong></span>
          </div>
          <p><strong>Remark:</strong> {remark}</p>
          <p><strong>Cash:</strong> {case_amount}</p>
      </div>
      
       
        </div>
      </div>

      <div className="grand">
        <p><strong>Grand Total:</strong> <span>{total_amount}</span></p>
      </div>

  
      <button className="download-btn" onClick={generatePDF}>
        Download as PDF
      </button>
    </div>
  );
};

export default MemoBill;

