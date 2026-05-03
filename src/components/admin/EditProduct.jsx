// src/components/Admin/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [sizeInput, setSizeInput] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) navigate('/admin/login');
      const res = await api.get(`/products/${id}`);
      const product = res.data.data;
      setForm({
        name: product.name || '',
        description: product.description || '',
        gender: product.gender || 'MEN',
        shoeType: product.shoeType || 'RUNNING',
        price: product.price || '',
        sale: product.sale || false,
        salePrice: product.salePrice || '',
        sizes: product.sizes || [],
        items_left: product.items_left || '',
        featured: product.featured || false,
        images: product.images || []
      });
      setExistingImages(product.images || []);
      setImagePreviews(product.images || []);
    } catch (err) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (imageFiles.length + existingImages.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImageFiles([...imageFiles, file]);
    const preview = URL.createObjectURL(file);
    setImagePreviews([...imagePreviews, preview]);
    e.target.value = '';
  };

  const removeExistingImage = (index) => {
    const removed = existingImages[index];
    setRemovedImages([...removedImages, removed]);
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const removeNewImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(existingImages.length + index, 1);
    setImagePreviews(newPreviews);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingImages.length + imageFiles.length === 0) {
      toast.error('At least one image required');
      return;
    }
    setSaving(true);
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
    formData.append('existingImages', JSON.stringify(existingImages));
    formData.append('removedImages', JSON.stringify(removedImages));
    for (let file of imageFiles) {
      formData.append('newImages', file);
    }

    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-black italic mb-6">Edit Product</h2>
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

          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} className="w-5 h-5" />
              <span className="font-bold">On Sale?</span>
            </label>
            {form.sale && (
              <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} placeholder="Sale Price" className="border rounded-lg p-2 w-40" />
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-bold mb-1">Sizes</label>
            <div className="flex gap-2">
              <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="e.g., 7" className="border rounded-lg p-2 w-24" />
              <button type="button" onClick={addSize} className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
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

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5" />
            <label className="font-bold">Feature this product on homepage</label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-bold mb-1">Product Images (max 5)</label>
            <div className="flex items-center gap-2 mb-3">
              <input type="file" accept="image/*" onChange={handleAddImage} className="border rounded-lg p-2" />
              <span className="text-sm text-gray-500">{existingImages.length + imageFiles.length}/5 images</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((src, idx) => {
                const isExisting = idx < existingImages.length;
                return (
                  <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => isExisting ? removeExistingImage(idx) : removeNewImage(idx - existingImages.length)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-bl-lg px-1"
                    >✕</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;