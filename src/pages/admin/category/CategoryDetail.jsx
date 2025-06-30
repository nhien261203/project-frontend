import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCategoryById, clearCategory } from '../../../features/category/categorySlice'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'

const CategoryDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const { category, loading } = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategoryById(id)).unwrap().catch(() => {
            toast.error('Không tìm thấy danh mục!')
            navigate('/admin/categories')
        })

        return () => dispatch(clearCategory())
    }, [dispatch, id, navigate])

    if (loading || !category) {
        return (
            <div className="p-6">
                <div className="text-gray-600">🔄 Đang tải chi tiết danh mục...</div>
            </div>
        )
    }

    return (
        <div className="p-6 font-sans max-w-xl mx-auto bg-white shadow rounded">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-800">📂 Chi tiết danh mục</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                    <FaArrowLeft /> Quay lại
                </button>
            </div>

            <div className="space-y-4 text-gray-700 text-sm">
                <DetailItem label="ID" value={category.id} />
                <DetailItem label="Tên danh mục" value={category.name} />
                <DetailItem label="Slug" value={category.slug} />
                <DetailItem label="Trạng thái" value={category.status === 1 ? '✅ Hoạt động' : '⛔ Tạm ẩn'} />
                <DetailItem label="Danh mục cha" value={category.parent?.name || 'Gốc'} />
                {category.children?.length > 0 && (
                    <DetailItem
                        label="Danh mục con"
                        value={
                            <ul className="list-disc ml-5">
                                {category.children.map(child => (
                                    <li key={child.id}>{child.name}</li>
                                ))}
                            </ul>
                        }
                    />
                )}
                <DetailItem label="Ngày tạo" value={new Date(category.createdAt).toLocaleString()} />
                <DetailItem label="Cập nhật lần cuối" value={new Date(category.updatedAt).toLocaleString()} />
            </div>
        </div>
    )
}

const DetailItem = ({ label, value }) => (
    <div>
        <div className="font-medium text-gray-600">{label}:</div>
        <div className="text-gray-800">{value}</div>
    </div>
)

export default CategoryDetail
