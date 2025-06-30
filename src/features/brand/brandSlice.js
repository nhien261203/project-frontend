// src/features/brand/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

// ==== Async Thunks ====

export const fetchBrands = createAsyncThunk(
    'brand/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get('/admin/brands', { params })
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh sách' })
        }
    }
)

export const fetchBrandById = createAsyncThunk(
    'brand/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get(`/admin/brands/${id}`)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Không tìm thấy brand' })
        }
    }
)

export const createBrand = createAsyncThunk(
    'brand/create',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosClient.post('/admin/brands', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return res.data
        } catch (err) {
            const res = err.response?.data
            return rejectWithValue(
                res?.errors || [{ field: 'error', message: res?.message || 'Lỗi tạo brand' }]
            )
        }
    }
)

export const updateBrand = createAsyncThunk(
    'brand/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await axiosClient.put(`/admin/brands/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return res.data
        } catch (err) {
            const res = err.response?.data
            return rejectWithValue(
                res?.errors || [{ field: 'error', message: res?.message || 'Lỗi cập nhật brand' }]
            )
        }
    }
)

export const deleteBrand = createAsyncThunk(
    'brand/delete',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosClient.delete(`/admin/brands/${id}`)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi xoá brand' })
        }
    }
)

// ==== Slice ====

const initialState = {
    brands: [],
    brand: null,
    loading: false,
    success: false,
    errorList: [],
    filteredTotal: null,
    pagination: {
        total: 0,
        currentPage: 1,
        totalPages: 1,
    },
}

const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        resetState: (state) => {
            state.success = false
            state.errorList = []
        },
        clearBrand: (state) => {
            state.brand = null
        },
        setFilteredTotal: (state, action) => {
            state.filteredTotal = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false
                state.brands = action.payload.data
                state.pagination = {
                    total: action.payload.total,
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                }
            })
            .addCase(fetchBrands.rejected, (state) => {
                state.loading = false
            })

            .addCase(fetchBrandById.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchBrandById.fulfilled, (state, action) => {
                state.loading = false
                state.brand = action.payload
            })
            .addCase(fetchBrandById.rejected, (state) => {
                state.loading = false
                state.brand = null // ✅ Fix infinite fetch loop
            })

            .addCase(createBrand.pending, (state) => {
                state.loading = true
                state.success = false
                state.errorList = []
            })
            .addCase(createBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false
                state.errorList = action.payload
            })

            .addCase(updateBrand.pending, (state) => {
                state.loading = true
                state.success = false
                state.errorList = []
            })
            .addCase(updateBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false
                state.errorList = action.payload
            })

            .addCase(deleteBrand.pending, (state) => {
                state.loading = true
                state.success = false
            })
            .addCase(deleteBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteBrand.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { resetState, clearBrand, setFilteredTotal } = brandSlice.actions
export default brandSlice.reducer
