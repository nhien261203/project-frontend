import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createBrand, resetState } from '../../../features/brand/brandSlice'

const AddBrand = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { loading, success, errorList } = useSelector(state => state.brand)

    const [form, setForm] = useState({
        name: '',
        slug: '',
        country: '',
        status: '1',
        logo: null,
    })
    const [preview, setPreview] = useState(null)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(resetState())
    }, [dispatch])

    useEffect(() => {
        if (errorList.length > 0) {
            const fieldErr = {}
            errorList.forEach(e => {
                const field = e.field || e.path || 'error'
                const msg = e.message || e.msg || 'Lỗi không xác định'
                fieldErr[field] = msg
                toast.error(`${field !== 'error' ? `${field}: ` : ''}${msg}`)
            })
            setErrors(fieldErr)
        }
    }, [errorList])

    useEffect(() => {
        if (success) {
            toast.success('Thêm thương hiệu thành công!')
            dispatch(resetState())
            navigate('/admin/brands')
        }
    }, [success, dispatch, navigate])

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'logo') {
            const file = files[0]
            setForm(prev => ({ ...prev, logo: file }))
            setPreview(file ? URL.createObjectURL(file) : null)
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})
        const data = new FormData()
        Object.entries(form).forEach(([key, value]) => {
            if (value) data.append(key, value)
        })
        dispatch(createBrand(data))
    }

    return (
        <div className="p-6 max-w-xl mx-auto bg-white shadow rounded font-sans">
            <h2 className="text-xl font-bold mb-4">➕ Thêm thương hiệu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <InputField
                    label="Tên thương hiệu *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                {/* Slug */}
                <InputField
                    label="Slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    error={errors.slug}
                    placeholder="Bỏ trống sẽ tự tạo"
                />

                {/* Country */}
                <InputField
                    label="Quốc gia"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    error={errors.country}
                />

                {/* Status */}
                <div>
                    <label className="block font-medium">Trạng thái</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="1">Hoạt động</option>
                        <option value="0">Tạm ẩn</option>
                    </select>
                </div>

                {/* Logo */}
                <div>
                    <label className="block font-medium">Logo</label>
                    <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-contain border mt-2 rounded"
                        />
                    )}
                    {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Đang lưu...' : '💾 Lưu'}
                </button>
            </form>
        </div>
    )
}

const InputField = ({ label, name, value, onChange, error, placeholder = '' }) => (
    <div>
        <label className="block font-medium">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border px-3 py-2 rounded ${error ? 'border-red-500' : ''}`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
)

export default AddBrand
