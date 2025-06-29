import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // nếu cần cookie (ví dụ auth)
})

// Interceptor nếu muốn xử lý lỗi/tokens chung
axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Có thể logout tại đây nếu auth hết hạn
        }
        return Promise.reject(error)
    }
)

export default axiosClient
