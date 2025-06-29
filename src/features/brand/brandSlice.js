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

export const createBrand = createAsyncThunk(
    'brand/create',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosClient.post('/admin/brands', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tạo brand' })
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
            return rejectWithValue(err.response?.data || { message: 'Lỗi cập nhật' })
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

export const fetchBrandById = createAsyncThunk(
    'brand/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get(`/admin/brands/${id}`)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Không tìm thấy' })
        }
    }
)

// ==== Slice ====

const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        brands: [],
        brand: null,
        loading: false,
        success: false,
        error: null,
        filteredTotal: null, // 👈 thêm state lọc
        pagination: {
            total: 0,
            currentPage: 1,
            totalPages: 1,
        },
    },
    reducers: {
        resetState: (state) => {
            state.success = false
            state.error = null
        },
        setFilteredTotal: (state, action) => {
            state.filteredTotal = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
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
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Create
            .addCase(createBrand.pending, (state) => {
                state.loading = true
                state.success = false
            })
            .addCase(createBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Update
            .addCase(updateBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Delete
            .addCase(deleteBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch by ID
            .addCase(fetchBrandById.fulfilled, (state, action) => {
                state.brand = action.payload
                state.loading = false
            })
            .addCase(fetchBrandById.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchBrandById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetState, setFilteredTotal } = brandSlice.actions
export default brandSlice.reducer
