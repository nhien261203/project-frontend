// src/pages/admin/brand/EditBrand.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrandById, updateBrand, resetState } from '../../../features/brand/brandSlice'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'

const EditBrand = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { brand, loading, error, success } = useSelector(state => state.brand)

    const [form, setForm] = useState({
        name: '',
        slug: '',
        country: '',
        status: 1,
        logo: null
    })
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (!brand || brand.id !== parseInt(id)) {
            dispatch(fetchBrandById(id))
        }
    }, [dispatch, id, brand])


    useEffect(() => {
        if (brand) {
            setForm({
                name: brand.name || '',
                slug: brand.slug || '',
                country: brand.country || '',
                status: brand.status ?? 1,
                logo: null
            })
            setPreview(`http://localhost:3000${brand.logo}`)
        }
    }, [brand])

    useEffect(() => {
        if (error) toast.error(error.message)
        if (success) {
            toast.success('✅ Cập nhật thành công')
            navigate('/admin/brands')
        }
        return () => dispatch(resetState())
    }, [error, success, dispatch, navigate])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = e => {
        const file = e.target.files[0]
        setForm(prev => ({ ...prev, logo: file }))
        if (file) setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('slug', form.slug)
        formData.append('country', form.country)
        formData.append('status', form.status)
        if (form.logo) formData.append('logo', form.logo)

        dispatch(updateBrand({ id, formData }))
    }

    return (
        <div className="p-6 max-w-xl mx-auto font-sans">
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600">
                        <FaArrowLeft />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">✏️ Chỉnh sửa Thương hiệu</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-sm">Tên thương hiệu *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-sm">Slug</label>
                        <input
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-sm">Quốc gia</label>
                        <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-sm">Trạng thái</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Tạm ẩn</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-sm">Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-3 w-32 h-32 object-contain border rounded shadow"
                            />
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? 'Đang cập nhật...' : '💾 Lưu thay đổi'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/brands')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditBrand
