import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './company.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface Company {
  id?: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
}

const CompanyForm: React.FC = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Company>();
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);



  const [companyId, setCompanyId] = useState<string | null>(null); // Store the existing ID if available
  const navigate = useNavigate();


  useEffect(() => {
   

  const fetchCompanies = async () => {
    try {
      const response = await axios.get<Company[]>('http://localhost:8080/api/company');
      if(response.data.length > 0) {
        const company = response.data[0];
        setCompanyId(company.id || null); 
        setValue('companyName', company.companyName);
        setValue('address', company.address);
        setValue('phone', company.phone);
        setValue('email', company.email);
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error.message);
    }
  };
  fetchCompanies();
},[setValue]);



  const onSubmit: SubmitHandler<Company> = async (data) => {
    try {
      if (companyId) {
        await axios.put(`http://localhost:8080/api/company/${companyId}`, data);
        alert('Company updated successfully!');
      } else {
         const res = await axios.post('http://localhost:8080/api/company', data);
        alert('Company saved successfully!');
        setCompanyId(res.data.id); // Store the new company ID
      }
     
    } catch (error: any) {
      alert('Error saving company: ' + (error.response?.data?.message || error.message));
    }
  };


 

  // const handleDelete = async (id?: string) => {
  //   if (!id) return;
  //   if (window.confirm('Are you sure you want to delete this company?')) {
  //     try {
  //       await axios.delete(`http://localhost:8080/api/company/delete/${id}`);
  //       alert('Company deleted successfully!');
  //       fetchCompanies();
  //     } catch (error: any) {
  //       alert('Error deleting company: ' + (error.response?.data?.message || error.message));
  //     }
  //   }
  // };


  return (
    
    <div className="company-wrapper">
     

     

      <div className="form-card">
        <h3>{editIndex !== null ? 'Edit Company' : 'Add Company'}</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Company Name"
            {...register("companyName", { required: "Company Name is required" })}
          />
          {errors.companyName && <span className="error">{errors.companyName.message}</span>}

          <input
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && <span className="error">{errors.address.message}</span>}

          <input
            type="text"
            placeholder="Phone"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10-digit number"
              }
            })}
          />
          {errors.phone && <span className="error">{errors.phone.message}</span>}

          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format"
              }
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}

          <button className="save-btn" type="submit">
            Update
          </button>
        </form>
      </div>

      
    </div>
  );
};

export default CompanyForm;
