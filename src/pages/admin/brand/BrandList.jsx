import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'

import {
    fetchBrands,
    deleteBrand,
    resetState,
    setFilteredTotal,
} from '../../../features/brand/brandSlice'
import { fetchCountriesAPI } from '../../../features/brand/brandAPI'
import ConfirmModal from '../../../components/ConfirmModal'
import TableSkeleton from '../../../components/skeletons/TableSkeleton'



const BrandList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { brands, loading, error, success, pagination, filteredTotal } = useSelector((state) => state.brand)

    const [searchParams, setSearchParams] = useSearchParams()
    const perPage = 8
    const page = parseInt(searchParams.get('page')) || 1

    const [currentPage, setCurrentPage] = useState(page)
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [status, setStatus] = useState('')
    const [countries, setCountries] = useState([])
    const [localBrands, setLocalBrands] = useState([])

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const firstLoad = useRef(true)
    const prevFilter = useRef({ search: '', country: '', status: '' })

    useEffect(() => {
        fetchCountriesAPI()
            .then(setCountries)
            .catch(() => toast.error('Không thể lấy danh sách quốc gia'))
    }, [])


    // Sync redux -> local
    useEffect(() => {
        setLocalBrands(brands)
    }, [brands])

    useEffect(() => {
        const changed = (
            search !== prevFilter.current.search ||
            country !== prevFilter.current.country ||
            status !== prevFilter.current.status
        )

        if (!firstLoad.current && changed) {
            setCurrentPage(1)
        }

        prevFilter.current = { search, country, status }
    }, [search, country, status])

    const debouncedFetch = useCallback(debounce((page, search, country, status) => {
        dispatch(fetchBrands({ page, limit: perPage, search, country, status }))
            .unwrap()
            .then(res => dispatch(setFilteredTotal(res.total)))
            .catch(() => dispatch(setFilteredTotal(null)))
    }, 400), [dispatch])

    useEffect(() => {
        setSearchParams({ page: currentPage })
        if (firstLoad.current) {
            dispatch(fetchBrands({ page: currentPage, limit: perPage, search, country, status }))
                .unwrap()
                .then(res => dispatch(setFilteredTotal(res.total)))
            firstLoad.current = false
        } else {
            debouncedFetch(currentPage, search, country, status)
        }

        return () => debouncedFetch.cancel()
    }, [currentPage, search, country, status, dispatch])

    useEffect(() => {
        if (error) toast.error(error.message || 'Lỗi xảy ra')
        if (success) {
            dispatch(fetchBrands({ page: currentPage, limit: perPage, search, country, status }))
        }
        return () => dispatch(resetState())
    }, [error, success, dispatch, currentPage, perPage, search, country, status])

    const handleDelete = async () => {
        if (isProcessing) return
        setIsProcessing(true)

        const prevList = [...localBrands]
        setLocalBrands(prevList.filter(b => b.id !== selectedId))
        setConfirmOpen(false)

        try {
            await dispatch(deleteBrand(selectedId)).unwrap()
            toast.success('Đã xoá thương hiệu!')
        } catch {
            setLocalBrands(prevList)
            toast.error('Xoá thất bại!')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">🏷️ Danh sách thương hiệu</h2>
                <button
                    onClick={() => navigate('/admin/brands/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 Tìm tên thương hiệu..."
                    className="border rounded px-3 py-2 w-full md:w-1/3"
                />
                <select value={country} onChange={e => setCountry(e.target.value)} className="border rounded px-3 py-2 w-full md:w-1/4">
                    <option value="">-- Quốc gia --</option>
                    {countries.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>
                <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-3 py-2 w-full md:w-1/5">
                    <option value="">-- Trạng thái --</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Tạm ẩn</option>
                </select>
                <button onClick={() => {
                    setSearch('')
                    setCountry('')
                    setStatus('')
                    setCurrentPage(1)
                }} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                    🔄 Reset
                </button>
            </div>

            <div className="text-sm mb-2 text-gray-600">
                Tổng: <b>{pagination.total}</b> thương hiệu
                {filteredTotal !== null && filteredTotal !== pagination.total && (
                    <> | Kết quả lọc: <b>{filteredTotal}</b></>
                )}
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Logo</th>
                            <th className="p-3">Tên</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">Quốc gia</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && localBrands.length === 0 ? (
                            <TableSkeleton columns={6} rows={6} />
                        ) : localBrands.length === 0 ? (
                            <tr><td colSpan="6" className="p-4 text-center">Không có dữ liệu</td></tr>
                        ) : (
                            localBrands.map(brand => (
                                <tr key={brand.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 min-w-[90px] w-[90px] md:min-w-[130px] md:w-[130px]">
                                        <img
                                            src={`http://localhost:3000${brand.logo}`}
                                            alt={brand.name}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain rounded border"
                                        />
                                    </td>
                                    <td className="p-3 font-semibold">{brand.name}</td>
                                    <td className="p-3">{brand.slug}</td>
                                    <td className="p-3">{brand.country}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${brand.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {brand.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-3 text-blue-600">
                                            <button onClick={() => navigate(`/admin/brands/${brand.id}`)} title="Xem"><FaEye /></button>
                                            <button onClick={() => navigate(`/admin/brands/edit/${brand.id}`)} title="Sửa" className="text-yellow-500"><FaEdit /></button>
                                            <button onClick={() => {
                                                setSelectedId(brand.id)
                                                setConfirmOpen(true)
                                            }} title="Xoá" className="text-red-500"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {pagination?.total > perPage && (
                <div className="flex justify-center mt-4 gap-1 flex-wrap">
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">◀</button>
                    {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-1 rounded ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                        >
                            {p}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pagination.totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">▶</button>
                </div>
            )}

            {/* Modal xác nhận xoá */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xoá"
                message="Bạn chắc chắn muốn xoá thương hiệu này?"
                onConfirm={handleDelete}
                onCancel={() => !isProcessing && setConfirmOpen(false)}
                disabled={isProcessing}
            />
        </div>
    )
}

export default BrandList
