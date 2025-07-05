import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation,useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toWords } from 'number-to-words';


interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface Company {
  companyName: string;
  address: string;
  phone: string;
  email: string;
}

interface LocationState {
  cartItems?: CartItem[];
  paymentMethod?: string;
  paymentInfo?: string;
   salesId?: string; // ✅ add this
  SoledAt?: string;
}


const BillPage: React.FC = () => {
  const { state } = useLocation() as { state: LocationState };
  const cartItems: CartItem[] = state?.cartItems || [];
  const navigate = useNavigate();
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rounded = Math.round(totalAmount);
  const roundingDiff = (rounded - totalAmount).toFixed(2);
  
  const billRef = useRef<HTMLDivElement>(null);

const salesId = state?.salesId ; // fallback if missing
const soldAt = state?.SoledAt || new Date().toISOString(); // optional



  const handlePrint = useReactToPrint({
    content: () => billRef.current, 
    documentTitle: 'Invoice',
  });
const [company, setCompany] = useState<Company | null>(null);
 
useEffect(() => {
    if (!state || !state.cartItems || state.cartItems.length === 0) {
    navigate('/report', { replace: true });
  } else {
    // 👇 Manipulate history: set /report behind /bill
    window.history.replaceState(null, '', '/reports');
    window.history.pushState({ ...state }, '', '/bill');
  }
}, []);

const upiId = "mussamilhussain2001@okicici"; 
const payeeName = "Musammil"; 
const amount = rounded; 
const upiQrValue = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${rounded}&cu=INR`;

 



useEffect(() => {
  const fetchCompany = async () => {
    try {
      const response = await axios.get<Company[]>('http://localhost:8080/api/company');
      if (response.data.length > 0) {
        setCompany(response.data[0]); 
      }
    } catch (error) {
      console.error('Failed to fetch company details:', error);
    }
  };

  fetchCompany();
}, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f3f3f3',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <div ref={billRef} style={{ width: '300px', fontFamily:`'Times New Roman', Times, serif`, fontSize: '12px' }}>
          <div style={{ textAlign: 'center' }}>
             <h3>{company?.companyName }</h3>
             <p>{company?.address }</p>
             <p>{company?.phone}</p>
             <p>{company?.email}</p>
             <p style={{ borderBottom: '1px dashed #000' }}>CASH BILL</p>
        </div>

         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
         <span><strong>Bill No:</strong> {state.salesId}</span>
        <span><strong>Date:</strong> {new Date(soldAt).toLocaleDateString()}</span>
        </div>


          <p>
            <strong>To:</strong> CASH SALES
          </p>

     <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{  textAlign: 'left' }}>No</th>
      <th style={{  textAlign: 'left' }}>Item</th>
      <th style={{  textAlign: 'right' }}>Qty</th>
      <th style={{ textAlign: 'right' }}>Rate</th>
      <th style={{  textAlign: 'right' }}>Total</th>
    </tr>
  </thead>
  <tbody>
    {cartItems.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td style={{ textAlign: 'right' }}>{item.quantity}</td>
        <td style={{ textAlign: 'right' }}>{Number(item.price).toFixed(2)}</td>
        <td style={{ textAlign: 'right' }}>{(Number(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>


          <hr />
          <div style={{ textAlign: 'right' }}>
            <p>
              <strong>Gross:</strong> ₹{totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Rounded:</strong> ₹{roundingDiff}
            </p>
            <p>
              <strong>Grand Total:</strong> ₹{rounded.toFixed(2)}
            </p>
          </div>
         <p>
           <em>Rupees {toWords(rounded).toUpperCase()} Only</em>
         </p>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>Thank you for your purchase!</p>
          <p style={{ textAlign: 'right' }}>Authorized Signature</p>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <QRCodeCanvas value={upiQrValue} size={128} />
          <p style={{ marginTop: '5px' }}>Scan to Pay  via UPI</p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '5px 10px',
              fontSize: '14px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
