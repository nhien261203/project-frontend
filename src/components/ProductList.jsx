import { useEffect, useState } from 'react';
import axios from '../api/axiosClient';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`/products?page=${page}`);
            setProducts(res.data.products || []);
            setCurrentPage(res.data.currentPage || 1);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('❌ Lỗi khi tải sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        fetchProducts(page);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🛒 Danh sách sản phẩm</h2>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : products.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
                        {products.map((p) => (
                            <div
                                key={p.id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: 8,
                                    padding: 12,
                                    width: 260,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                }}
                            >
                                <h3>{p.name}</h3>
                                <p style={{ fontSize: 14, color: '#666' }}>{p.description}</p>
                                <strong style={{ color: '#d0021b' }}>
                                    {Number(p.price).toLocaleString()} đ
                                </strong>

                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    {p.ProductImages?.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`http://localhost:3000${img.image_path}`}
                                            alt=""
                                            width={80}
                                            style={{ borderRadius: 4, objectFit: 'cover' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PHÂN TRANG */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        fontWeight: currentPage === page ? 'bold' : 'normal',
                                        textDecoration: currentPage === page ? 'underline' : 'none',
                                    }}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductList;
