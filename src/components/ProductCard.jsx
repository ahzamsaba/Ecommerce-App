import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({product}) {
    const {addToCart} = useCart()

    const handleAdd = () => {
        addToCart(product)
        toast.success(`${product.name} added to cart`)
    }

    return (
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
            <p className="text-gray-700 mb-1">₹{product.price}</p>
            <p className="text-sm text-gray-500 mb-1">Stock: {product.stock}</p>
            <p className="text-sm text-gray-500 mb-1">
                Category: {product.category || "Uncategorized"}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <button 
                onClick={handleAdd}
                className="mt-3 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Add to Cart
            </button>
        </div>
    );
}