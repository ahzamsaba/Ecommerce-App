import { useCart} from '../context/CartContext'
import { useAuth } from '../context/AuthContext';
import { data, useNavigate } from 'react-router-dom';
import { databases } from '../utils/appwriteConfig';

export default function OrderSummary() {
    const {detailedCart, cart} = useCart()
    const {user} = useAuth()
    const navigate = useNavigate()

    const totalAmount = detailedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        const productIds = detailedCart.map(item => item.$id)
        const quantities = detailedCart.map(item => item.quantity)

        try {
            // Create order document
            await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                "685974900028ee5e0360",//orders collection id
                "unique()",
                {
                    userId: user.$id,
                    productIds,
                    quantities,
                    totalAmount: totalAmount,
                    status: "pending",
                }
            );
            
            // Clear cart
            await Promise.all(
                cart.map(item =>
                    databases.deleteDocument(
                        import.meta.env.VITE_APPWRITE_DATABASE_ID,
                        "6859af840000a66c5a4c",// cart collection id
                        item.$id
                    )
                )
            );

            // Reduce stock for each product
            await Promise.all(
                detailedCart.map(item =>
                    databases.updateDocument(
                        import.meta.env.VITE_APPWRITE_DATABASE_ID,
                        "685974800022b980b3f5",//products colection id
                        item.$id,
                        {
                            stock: item.stock - item.quantity
                        }
                    )
                )
            )

            alert("✅ Order placed!")
            navigate("/")
        } catch (e) {
            console.error("Order failed", e)
        }
    }

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>Order Summary</h1>

            {detailedCart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                <div className='space-y-4'>
                    {detailedCart.map((item) => (
                        <div key={item.cartId} className='border p-4 rounded'>
                            <h2 className='font-semibold'>{item.name}</h2>
                            <p>₹{item.price} x {item.quantity}</p>
                            <p className='text-sm text-gray-500'>
                                Subtotal: ₹{item.price * item.quantity}
                            </p>
                        </div>
                    ))}
                </div>
                    <hr className='my-4' />
                    <div className='mt-6 text-right'>
                        <h2 className='text-xl font-bold'>Total: ₹{totalAmount}</h2>
                        <button
                            onClick={handlePlaceOrder}
                            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                        >
                            Place Order
                        </button>
                    </div>
                </>
                
            )}
        </div>
    )
}