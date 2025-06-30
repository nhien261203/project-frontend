import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

// ==========================
// Async Thunks
// ==========================

// Lấy danh sách danh mục
export const fetchCategories = createAsyncThunk(
    'category/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get('/admin/categories', { params })
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi khi tải danh sách danh mục' })
        }
    }
)

// Lấy chi tiết danh mục theo ID
export const fetchCategoryById = createAsyncThunk(
    'category/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get(`/admin/categories/${id}`)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Không tìm thấy danh mục' })
        }
    }
)

// Tạo mới
export const createCategory = createAsyncThunk(
    'category/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosClient.post('/admin/categories', data)
            return res.data
        } catch (err) {
            const res = err.response?.data
            return rejectWithValue(res?.errors || [{ field: 'error', message: res?.message || 'Lỗi tạo danh mục' }])
        }
    }
)

// Cập nhật
export const updateCategory = createAsyncThunk(
    'category/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axiosClient.put(`/admin/categories/${id}`, data)
            return res.data
        } catch (err) {
            const res = err.response?.data
            return rejectWithValue(res?.errors || [{ field: 'error', message: res?.message || 'Lỗi cập nhật danh mục' }])
        }
    }
)

// Xoá
export const deleteCategory = createAsyncThunk(
    'category/delete',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosClient.delete(`/admin/categories/${id}`)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi xoá danh mục' })
        }
    }
)

// ==========================
// Initial State
// ==========================

const initialState = {
    categories: [],
    category: null,
    loading: false,
    success: false,
    errorList: [],
    pagination: {
        total: 0,
        current_page: 1,
        last_page: 1,
    },
}

// ==========================
// Slice
// ==========================

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        resetState: (state) => {
            state.success = false
            state.errorList = []
        },
        clearCategory: (state) => {
            state.category = null
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== Fetch All =====
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload.data
                state.pagination = {
                    total: action.payload.pagination.total,
                    current_page: action.payload.pagination.current_page,
                    last_page: action.payload.pagination.last_page,
                }
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.loading = false
            })

            // ===== Fetch By ID =====
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.loading = false
                state.category = action.payload
            })
            .addCase(fetchCategoryById.rejected, (state) => {
                state.loading = false
                state.category = null
            })

            // ===== Create =====
            .addCase(createCategory.pending, (state) => {
                state.loading = true
                state.success = false
                state.errorList = []
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false
                state.errorList = action.payload
            })

            // ===== Update =====
            .addCase(updateCategory.pending, (state) => {
                state.loading = true
                state.success = false
                state.errorList = []
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false
                state.errorList = action.payload
            })

            // ===== Delete =====
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true
                state.success = false
            })
            .addCase(deleteCategory.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteCategory.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { resetState, clearCategory } = categorySlice.actions
export default categorySlice.reducer
