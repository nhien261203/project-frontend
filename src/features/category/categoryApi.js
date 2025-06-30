import axiosClient from '../../api/axiosClient'

export const createCategoryAPI = (data) =>
    axiosClient.post('/admin/categories', data)

export const fetchCategoriesAPI = (params) =>
    axiosClient.get('/admin/categories', { params })

export const fetchCategoryByIdAPI = (id) =>
    axiosClient.get(`/admin/categories/${id}`)

export const updateCategoryAPI = (id, data) =>
    axiosClient.put(`/admin/categories/${id}`, data)

export const deleteCategoryAPI = (id) =>
    axiosClient.delete(`/admin/categories/${id}`)
