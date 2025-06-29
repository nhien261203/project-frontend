import { useState } from 'react';
import axios from '../api/axiosClient';

function AddProduct({ onSuccess }) {
    const [form, setForm] = useState({ name: '', price: '', description: '' });
    const [images, setImages] = useState([]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('description', form.description);
        images.forEach(img => formData.append('images', img));

        await axios.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('Đã thêm sản phẩm');
        setForm({ name: '', price: '', description: '' });
        setImages([]);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} required />
            <input name="price" type="number" placeholder="Giá" value={form.price} onChange={handleChange} required />
            <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
            <input type="file" multiple onChange={e => setImages([...e.target.files])} />
            <button type="submit">Thêm</button>
        </form>
    );
}

export default AddProduct;
