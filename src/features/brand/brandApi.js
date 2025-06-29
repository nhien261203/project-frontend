import axiosClient from '../../api/axiosClient'

export const createBrandAPI = (formData) =>
    axiosClient.post('/admin/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

export const fetchBrandsAPI = (params) =>
    axiosClient.get('/admin/brands', { params })

export const updateBrandAPI = (id, formData) =>
    axiosClient.put(`/admin/brands/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

export const deleteBrandAPI = (id) =>
    axiosClient.delete(`/admin/brands/${id}`)

export const fetchBrandByIdAPI = (id) =>
    axiosClient.get(`/admin/brands/${id}`)

export const fetchCountriesAPI = async () => {
    const response = await axiosClient.get('/admin/brands/countries')
    return response.data
}

