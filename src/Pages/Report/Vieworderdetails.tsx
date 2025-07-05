// src/pages/ViewOrderPage.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ViewOrder.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface LocationState {
  cartItems: CartItem[];
  paymentMethod: string;
  paymentInfo: string;
  salesId: string;
  SoledAt: string;
}

const ViewOrderPage: React.FC = () => {
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  const totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rounded = Math.round(totalAmount);
  return (
    <div className="view-order-container">
      <div className="view-order-header">
        <h2><center>Sold Items </center></h2>
          {state.cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} className="cart-image" />
              <div className="cart-info">
                <p><strong>{item.name}</strong></p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
                <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <hr />
             <p><strong>Bill No:</strong> {state.salesId}</p>
            <p><strong>Payment Method:</strong> {state.paymentMethod.toUpperCase()}</p>
            {/* <p><strong>Payment Info:</strong> {state.paymentInfo}</p> */}
            <p><strong>Order Date:</strong> {new Date(state.SoledAt).toLocaleString()}</p>
            <p><strong>Grand Total:</strong> ₹{rounded}</p>
          </div>
        </div>
      </div>
  
  );
};

export default ViewOrderPage;
