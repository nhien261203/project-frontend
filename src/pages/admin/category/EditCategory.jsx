import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
    fetchCategories,
    fetchCategoryById,
    updateCategory,
    resetState
} from '../../../features/category/categorySlice'
import { toast } from 'react-toastify'

const EditCategory = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const { categories, category: selectedCategory, loading, success, errorList } = useSelector(state => state.category)

    const [form, setForm] = useState({
        name: '',
        slug: '',
        parent_id: '',
        status: '1',
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(fetchCategories({ limit: 100 }))
        dispatch(fetchCategoryById(id))

    }, [dispatch, id])

    useEffect(() => {
        if (selectedCategory) {
            setForm({
                name: selectedCategory.name || '',
                slug: selectedCategory.slug || '',
                parent_id: selectedCategory.parent_id || '',
                status: String(selectedCategory.status ?? '1'),
            })
        }
    }, [selectedCategory])

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
            toast.success('Cập nhật thành công!')
            dispatch(resetState())
            navigate('/admin/categories')
        }
    }, [success, dispatch, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})

        const payload = {
            ...form,
            parent_id: form.parent_id === '' ? null : parseInt(form.parent_id),
            status: parseInt(form.status),
        }

        dispatch(updateCategory({ id, data: payload }))
    }

    useEffect(() => {
        return () => {
            dispatch(resetState()) //dọn state sau khi rời trang
        }
    }, [dispatch])

    return (
        <div className="p-6 max-w-xl mx-auto bg-white shadow rounded font-sans">
            <h2 className="text-xl font-bold mb-4">✏️ Cập nhật danh mục</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Tên danh mục *" name="name" value={form.name} onChange={handleChange} error={errors.name} />
                <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug} placeholder="Bỏ trống sẽ tự tạo" />

                <div>
                    <label className="block font-medium">Danh mục cha</label>
                    <select name="parent_id" value={form.parent_id || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                        <option value="">-- Không có --</option>
                        {categories
                            .filter(cat => cat.id !== Number(id)) // không cho chọn chính nó
                            .map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                    </select>
                    {errors.parent_id && <p className="text-red-500 text-sm">{errors.parent_id}</p>}
                </div>

                <div>
                    <label className="block font-medium">Trạng thái</label>
                    <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                        <option value="1">Hoạt động</option>
                        <option value="0">Tạm ẩn</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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

export default EditCategory
