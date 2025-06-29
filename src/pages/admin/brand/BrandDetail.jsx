// src/pages/admin/brand/BrandDetail.jsx
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrandById } from '../../../features/brand/brandSlice'
import { FaArrowLeft } from 'react-icons/fa'

const BrandDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { brand, loading, error } = useSelector(state => state.brand)

    useEffect(() => {
        dispatch(fetchBrandById(id))
    }, [dispatch, id])

    if (loading) return <div className="p-6 text-gray-600 text-center">⏳ Đang tải dữ liệu...</div>
    if (error) return <div className="p-6 text-red-600 text-center">❌ Lỗi: {error.message}</div>
    if (!brand) return <div className="p-6 text-center">⚠️ Không tìm thấy thương hiệu</div>

    return (
        <div className="p-6 max-w-2xl mx-auto font-sans">
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4 gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-blue-600"
                        title="Quay lại"
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">📄 Chi tiết Thương hiệu</h2>
                </div>

                <div className="space-y-4 text-gray-800">
                    <div>
                        <label className="font-medium">Tên thương hiệu:</label>
                        <p className="pl-2 text-lg font-semibold">{brand.name}</p>
                    </div>

                    <div>
                        <label className="font-medium">Slug:</label>
                        <p className="pl-2 text-gray-700">{brand.slug}</p>
                    </div>

                    <div>
                        <label className="font-medium">Quốc gia:</label>
                        <p className="pl-2">{brand.country || <i>Không có</i>}</p>
                    </div>

                    <div>
                        <label className="font-medium">Trạng thái:</label>
                        <span className={`ml-2 inline-block px-2 py-1 rounded text-sm font-medium 
              ${brand.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {brand.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                        </span>
                    </div>

                    <div>
                        <label className="font-medium">Logo:</label>
                        <div className="mt-2">
                            <img
                                src={brand.logo?.startsWith('http') ? brand.logo : `http://localhost:3000${brand.logo}`}
                                alt={brand.name}
                                className="w-32 h-32 object-contain border rounded shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => navigate(`/admin/brands/edit/${id}`, { state: { brand } })}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium"
                    >
                        ✏️ Chỉnh sửa
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BrandDetail
