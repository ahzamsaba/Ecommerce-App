import { useEffect, useState } from "react";
import {databases} from "../utils/appwriteConfig"
import {useAuth} from "../context/AuthContext"
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const ORDERS_COLLECTION_ID = "685974900028ee5e0360"
const PRODUCTS_COLLECTION_ID = "685974800022b980b3f5"

export default function OrderHistory() {
    const {user} = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
                Query.equal("userId", user?.$id),
            ]);

            const fetchedOrders = await Promise.all(
                res.documents.map(async (order) => {
                    const productDetails = await Promise.all(
                        order.productIds.map((productId) => 
                            databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID,productId)
                        )
                    );
                    return {
                        ...order,
                        productDetails
                    }
                })
            );

            setOrders(fetchedOrders)
            setLoading(false)
        } catch (er) {
            console.error("Failed to fetch orders", er)
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user?.$id) fetchOrders()
    }, [user]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>You have no past orders</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div key={order.$id} className="border p-4 rounded">
                            <h2 className="font-semibold mb-2">Order #{index + 1}</h2>
                            <p className="text-sm text-gray-500 mb-2">Status: {order.status}</p>
                            <ul className="list-disc list-inside">
                                {order.productDetails.map((product, idx) => (
                                    <li key={product.$id}>
                                        {product.name} x {order.quantities[idx]} = ₹
                                        {product.price * order.quantities[idx]}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 font-medium">Total: {order.totalAmount}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}