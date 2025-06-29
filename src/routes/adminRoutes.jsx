// src/routes/adminRoutes.jsx
import { lazy, Suspense } from 'react'
import AdminLayout from '../layouts/AdminLayout'


// Lazy load các trang
const Dashboard = lazy(() => import('../pages/admin/DashBoard'))




const adminRoutes = {
    path: '/admin',
    element: <AdminLayout />,
    children: [
        { index: true, element: <Dashboard />},
    ]
}

export default adminRoutes
