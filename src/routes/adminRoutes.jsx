import { lazy } from 'react'
import AdminLayout from '../layouts/AdminLayout'

// Lazy load trang admin
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const BrandList = lazy(() => import('../pages/admin/brand/BrandList'))
const AddBrand = lazy(() => import('../pages/admin/brand/AddBrand'))
const EditBrand = lazy(() => import('../pages/admin/brand/EditBrand'))
const BrandDetail = lazy(() => import('../pages/admin/brand/BrandDetail'))

const CategoryList = lazy(() => import('../pages/admin/category/CategoryList'))
const AddCategory = lazy(() => import('../pages/admin/category/AddCategory'))
const EditCategory = lazy(() => import('../pages/admin/category/EditCategory'))
const CategoryDetail = lazy(() => import('../pages/admin/category/CategoryDetail'))
const adminRoutes = {
    path: '/admin',
    element: <AdminLayout />,
    children: [
        { index: true, element: <Dashboard /> },
        // Quản lý thương hiệu
        { path: 'brands', element: <BrandList /> },
        { path: 'brands/create', element: <AddBrand /> },
        { path: 'brands/edit/:id', element: <EditBrand /> },
        { path: 'brands/:id', element: <BrandDetail/> },

        // Quản lý danh mục
        {path: 'categories', element: <CategoryList /> },
        {path: 'categories/create', element: <AddCategory /> },
        {path: 'categories/edit/:id', element: <EditCategory /> },
        {path: 'categories/:id', element: <CategoryDetail /> },
    ],

}

export default adminRoutes
