import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css'; // Ensure this CSS is defined

interface Product {
  id: string;
  name: string;
  price: number | string;
  image?: string;
}

const ManageProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  return (
    <div className="manage-products-page">
      <div className="header-section">

        <button className="create-btn" onClick={() => navigate('/addproduct')}>
          + Add Product
        </button>
      </div>

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
            <button
              className="update-btn"
             onClick={() => navigate('/addproduct', { state: { productId: product.id } })}

            >
              Edit
            </button>
            <button className="delete-btn" onClick={() => handleDelete(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProductsPage;
