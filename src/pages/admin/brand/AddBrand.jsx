import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createBrand, resetState } from '../../../features/brand/brandSlice'

const AddBrand = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector(state => state.brand)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        country: '',
        status: '1',
        logo: null
    })
    const [previewLogo, setPreviewLogo] = useState(null)

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'logo') {
            const file = files[0]
            setFormData(prev => ({ ...prev, logo: file }))
            if (file) {
                setPreviewLogo(URL.createObjectURL(file))
            } else {
                setPreviewLogo(null)
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = new FormData()
        data.append('name', formData.name)
        data.append('slug', formData.slug)
        data.append('country', formData.country)
        data.append('status', formData.status)
        if (formData.logo) {
            data.append('logo', formData.logo)
        }

        try {
            await dispatch(createBrand(formData)).unwrap()
            toast.success('Thêm thương hiệu thành công!')
            navigate('/admin/brands')
        } catch (err) {
            const message = err?.message || err?.errors?.[0]?.msg || 'Thêm thương hiệu thất bại!'
            toast.error(message)
            console.error('Lỗi:', err)
        }

    }

    return (
        <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">➕ Thêm thương hiệu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Tên thương hiệu *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="Bỏ trống sẽ tự tạo theo tên"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Quốc gia</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Trạng thái</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="1">Hoạt động</option>
                        <option value="0">Tạm ẩn</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Logo</label>
                    <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full"
                    />
                    {previewLogo && (
                        <img
                            src={previewLogo}
                            alt="Preview"
                            className="w-32 h-32 object-contain border mt-2 rounded"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
            </form>
        </div>
    )
}

export default AddBrand
