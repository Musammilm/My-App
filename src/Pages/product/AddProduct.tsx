import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddProduct.css';

interface ProductFormData {
  name: string;
  price: string;
  image: File | null;
  existingImage?: string; // for preview
}

const AddProductPage: React.FC = () => {
 const location = useLocation();
const productId = (location.state as { productId?: string })?.productId;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    image: null,
    existingImage: '',
  });

  const navigate = useNavigate();

  // 🟩 If editing, fetch product data
  useEffect(() => {
    if (productId) {
      axios.get(`http://localhost:8080/api/products/${productId}`)
        .then(res => {
          const product = res.data;
          setFormData({
            name: product.name,
            price: product.price,
            image: null,
            existingImage: product.image, // base64 string
          });
        })
        .catch(err => console.error('Fetch error', err));
    }
  }, [productId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (productId) {
        // 🟨 EDIT product
        await axios.put(`http://localhost:8080/api/products/update/${productId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated!');
      } else {
        // 🟩 ADD product
        await axios.post('http://localhost:8080/api/products/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product created!');
      }
      navigate('/product');
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="add-product-page">
      <form onSubmit={handleSubmit} className="product-form">
        <h2>{productId ? 'Edit Product' : 'Add Product'}</h2>

        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />

        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        /><br />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        /><br />

        {/* 🖼 Show preview if editing and image exists */}
        {productId && formData.existingImage && (
          <img
            src={`data:image/jpeg;base64,${formData.existingImage}`}
            alt="Preview"
            className="preview-img"
          />
        )}

        <button type="submit">{productId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default AddProductPage;
