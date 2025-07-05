// src/pages/EditOrderPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditInvoice.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface LocationState {
  cartItems: CartItem[];
  paymentMethod: string;
  paymentInfo: string;
  salesId: string;
  SoledAt: string;
}

const EditOrderPage: React.FC = () => {
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>(state.cartItems || []);
  const [products, setProducts] = useState<Product[]>([]); // All available products

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>('http://localhost:8080/api/products/all');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add new product to cart
  const handleAddToCart = (product: Product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (!existing) {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // ✅ Quantity controls
  const increaseQuantity = (id: string) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleReorder = () => {
    navigate('/payment', {
      state: {
        cartItems,
        paymentMethod: state.paymentMethod,
        paymentInfo: state.paymentInfo,
         salesId: state.salesId,
      },
    });
  };

  return (
    <div className="product-page split-layout">
      {/* Left - All available products to add */}
      
      <div className="product-section">
           
        <h2>All Products</h2>
        <div className="product-grid">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} className="product-img" />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button className="add-btn" onClick={() => handleAddToCart(product)}>Add</button>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Editable Cart */}
      <div className="cart-popup-half">
        <div className="cart-header">
          <h3> Edit Your Order ({cartItems.length})</h3>
          <button className="close-btn" onClick={() => setCartItems([])}>✕</button>
        </div>

        <div className="cart-body">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} className="cart-image" />
              <div className="cart-info">
                <p><strong>{item.name}</strong></p>
                <div className="quantity-control">
                  <button onClick={() => decreaseQuantity(item.id)} className="qty-btn">−</button>
                  <input type="text" value={item.quantity} readOnly className="qty-input" />
                  <button onClick={() => increaseQuantity(item.id)} className="qty-btn">+</button>
                </div>
                <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>🗑</button>
            </div>
          ))}

          <div className="cart-total">
            <hr />
            <p><strong>Total:</strong> ₹{totalAmount.toFixed(2)}</p>
            <button className="buy-btn" onClick={handleReorder}>Proceed to Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage;
