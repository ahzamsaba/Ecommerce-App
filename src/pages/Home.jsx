import { useEffect, useState } from "react";
import {getAllProducts} from '../utils/productService'
import ProductCard from '../components/ProductCard'

export default function Home() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getAllProducts().then(setProducts)
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

