// src/components/Admin/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    gender: 'MEN',
    shoeType: 'RUNNING',
    price: '',
    sale: false,
    salePrice: '',
    sizes: [],
    items_left: '',
    featured: false,
    images: []   // will store base64 strings or URLs after upload
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [tempImage, setTempImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = imageFiles.length + files.length;
    if (total > 5) {
      toast.error("Maximum 5 images allowed");
      e.target.value = ""; // clear input
      return;
    }
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);
    // Previews (blob URLs)
    const previews = newImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setForm({ ...form, images: previews });
  };

  const removeImage = (index) => {
    // Revoke blob URL to avoid memory leak
    URL.revokeObjectURL(imagePreviews[index]);
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    setForm({ ...form, images: newPreviews });
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (imageFiles.length >= 5) {
      toast.error("Maximum 5 images already added");
      e.target.value = '';
      return;
    }
    const newImageFiles = [...imageFiles, file];
    setImageFiles(newImageFiles);
    const preview = URL.createObjectURL(file);
    const newPreviews = [...imagePreviews, preview];
    setImagePreviews(newPreviews);
    setForm({ ...form, images: newPreviews });
    e.target.value = ''; // reset so same file can be added again
  };

  const addSize = () => {
    if (sizeInput && !form.sizes.includes(sizeInput)) {
      setForm({ ...form, sizes: [...form.sizes, sizeInput] });
      setSizeInput('');
    }
  };
  const removeSize = (size) => {
    setForm({ ...form, sizes: form.sizes.filter(s => s !== size) });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (form.images.length === 0) {
  //     toast.error('Please add at least one product image');
  //     return;
  //   }
  //   if (form.sizes.length === 0) {
  //     toast.error('Please add at least one size');
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem('adminToken');
  //     await api.post('/products', form, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     toast.success('Product added successfully!');
  //     navigate('/admin/dashboard');
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || 'Failed to add product');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('gender', form.gender);
    formData.append('shoeType', form.shoeType);
    formData.append('price', form.price);
    formData.append('sale', form.sale);
    if (form.salePrice) formData.append('salePrice', form.salePrice);
    formData.append('sizes', JSON.stringify(form.sizes));
    formData.append('items_left', form.items_left);
    formData.append('featured', form.featured);

    // Append image files (File objects, not base64)
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Product added');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-black italic mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-1">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="KIDS">Kids</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full border rounded-lg p-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-1">Shoe Type *</label>
              <select name="shoeType" value={form.shoeType} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option value="RUNNING">Running</option>
                <option value="BASKETBALL">Basketball</option>
                <option value="TENNIS">Tennis</option>
                <option value="GOLF">Golf</option>
                <option value="SKATEBOARDING">Skateboarding</option>
                <option value="FOOTBALL">Football</option>
                <option value="TRAINING">Training</option>
                <option value="LIFESTYLE">Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Price (USD) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2" required />
            </div>
          </div>

          {/* Sale Toggle */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} className="w-5 h-5" />
              <span className="font-bold">On Sale?</span>
            </label>
            {form.sale && (
              <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} placeholder="Sale Price" className="border rounded-lg p-2 w-40" />
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-bold mb-1">Sizes (e.g., 7, 8, 9, 10, 11, 12)</label>
            <div className="flex gap-2">
              <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="Size" className="border rounded-lg p-2 w-24" />
              <button type="button" onClick={addSize} className="bg-black text-white px-4 py-2 rounded-lg">Add Size</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.sizes.map(size => (
                <span key={size} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {size} <button type="button" onClick={() => removeSize(size)} className="text-red-500 font-bold">✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Inventory */}
          <div>
            <label className="block text-sm font-bold mb-1">Quantity in Stock</label>
            <input type="number" name="items_left" value={form.items_left} onChange={handleChange} className="border rounded-lg p-2 w-32" />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5" />
            <label className="font-bold">Feature this product on homepage</label>
          </div>

          {/* Multiple Images Upload */}
          <div>
            <label className="block text-sm font-bold mb-1">Product Images (min 1, max 5)</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                className="border rounded-lg p-2"
              />
              <span className="text-sm text-gray-500">{imageFiles.length}/5 images added</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                  <img src={src} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-bl-lg px-1">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;