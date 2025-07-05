import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';

interface Product {
  id: string;
  name: string;
  price: number | string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const ViewProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>('http://localhost:8080/api/products/all');
      setProducts(res.data);
    } catch (error: any) {
      console.error('Fetch Error:', error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/delete/${id}`);
        fetchProducts();
      } catch (error: any) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    const price = parseFloat(product.price as string);
    const exists = cartItems.find(item => item.id === product.id);
    if (!exists) {
      setCartItems([...cartItems, { ...product, price, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCartItems(cartItems.filter(item => item.id !== id));
    }
  };

  const increaseQuantity = (id: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
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

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price as string) || 0;
    const quantity = parseInt(item.quantity.toString()) || 0;
    return sum + price * quantity;
  }, 0);

  const handleBuyAll = () => {
    if (cartItems.length === 0) return;
    navigate('/payment', { state: { cartItems } });
  };

  return (
    <div className={`product-page ${cartItems.length > 0 ? 'split-layout' : ''}`}>
      {/* Left - Product Listing */}
      <div className="product-section">
       

        {/* <button onClick={() => navigate('/addproduct')}>+ CREATE</button> */}

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
                className="product-img"
              />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <div className="product-actions">
                <button className="add-btn" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Cart Popup */}
      {cartItems.length > 0 && (
        <div className="cart-popup-half">
          <div className="cart-header">
            <h3> Cart ({cartItems.length})</h3>
            <button className="close-btn" onClick={() => setCartItems([])}>✕</button>
          </div>

          <div className="cart-body">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="cart-image"
                />
                <div className="cart-info">
                  <p><strong>{item.name}</strong></p>
                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(item.id)} className="qty-btn">−</button>
                    <input type="text" value={item.quantity} readOnly className="qty-input" />
                    <button onClick={() => increaseQuantity(item.id)} className="qty-btn">+</button>
                  </div>
                  <p>Total: ₹{(item.price as number * item.quantity).toFixed(2)}</p>
                </div>
                <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>🗑</button>
              </div>
            ))}

            <div className="cart-total">
              <hr />
              <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2).toLocaleString()}</p>
              <button className="buy-btn" onClick={handleBuyAll}>Buy Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProductsPage;
