import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css'; 
import { useNavigate } from 'react-router-dom';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Sales {
  salesId: string;
  paymentMethod: string;
  paymentInfo: string;
  soledAt: string;
  items: CartItem[];
}

const SalesReport: React.FC = () => {
  const [sales, setSales] = useState<Sales[]>([]);


 useEffect(() => {
  const fetchSales = async () => {
    const userId = localStorage.getItem('userId');
    console.log("User ID from localStorage:", userId);
    
    if (!userId) {
      console.warn("No userId found in localStorage");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/Sales/${userId}`);
      const sortedData = response.data.sort(
        (a: Sales, b: Sales) => new Date(b.soledAt).getTime() - new Date(a.soledAt).getTime()
      );

      console.log('Sorted Purchases:', sortedData);
      setSales(sortedData);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  fetchSales();
}, []);
 const navigate = useNavigate();

const handleEditInvoice = (sales: Sales) => {
  navigate('/edit', {
    state: {
      cartItems: sales.items,      // pre-filled cart
      paymentMethod: sales.paymentMethod,
      paymentInfo: sales.paymentInfo,
      salesId: sales.salesId,
      soledAt: sales.soledAt,
    },
  });
};
const handleViewOrder = (sales: Sales) => {
  navigate('/vieworder', {
    state: {
      cartItems: sales.items,
      paymentMethod: sales.paymentMethod,
      paymentInfo: sales.paymentInfo,
      salesId: sales.salesId,
      SoledAt: sales.soledAt,
    },
  });
};


const handlePrintInvoice = (sales: Sales) => {
  navigate('/bill', {
    state: {
      cartItems: sales.items,
      paymentMethod: sales.paymentMethod,
      paymentInfo: sales.paymentInfo,
      salesId: sales.salesId,
      SoledAt: sales.soledAt,
    },
  });
}
 


return (
  <div className="report-page">
    <h2><center>Sales History</center></h2>
    <table className="report-table">
      <thead>
        <tr>
          <th>Bill No</th>
          <th>Payment Method</th>
          <th>Amount</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale, index) => {
          const total = sale.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
           const rounded = Math.round(total); 
          return (
            <tr key={index}>
              <td>{sale.salesId}</td>
              <td>{sale.paymentMethod.toUpperCase()}</td>
              <td>₹{Math.round(total)}</td>

   <td>
  {sale.soledAt
    ? new Date(sale.soledAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'}
</td>

              <td>
               <button onClick={() => handleEditInvoice(sale)}>Edit</button>
               <button onClick={() => handleViewOrder(sale)} style={{ marginLeft: '8px' }}>View</button>
                <button onClick={() => handlePrintInvoice(sale)}>Print</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

};

export default SalesReport;
