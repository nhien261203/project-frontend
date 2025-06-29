import { lazy } from 'react'
import AdminLayout from '../layouts/AdminLayout'

// Lazy load trang admin
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const BrandList = lazy(() => import('../pages/admin/brand/BrandList'))
const AddBrand = lazy(() => import('../pages/admin/brand/AddBrand'))
const EditBrand = lazy(() => import('../pages/admin/brand/EditBrand'))
const BrandDetail = lazy(() => import('../pages/admin/brand/BrandDetail'))

const adminRoutes = {
    path: '/admin',
    element: <AdminLayout />,
    children: [
        { index: true, element: <Dashboard /> },
        { path: 'brands', element: <BrandList /> },
        { path: 'brands/create', element: <AddBrand /> },
        { path: 'brands/edit/:id', element: <EditBrand /> },
        { path: 'brands/:id', element: <BrandDetail/> },
    ]
}

export default adminRoutes
