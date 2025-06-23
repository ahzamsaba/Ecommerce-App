export default function ProductCard({product}) {
    return (
        <div className="border p-4 rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">₹{product.price}</p>
            <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">Add to Cart</button>
        </div>
    );
}