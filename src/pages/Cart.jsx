import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { databases } from "../utils/appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = "685974800022b980b3f5";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [detailedCart, setDetailedCart] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const results = await Promise.all(
        cart.map(async (item) => {
          try {
            const product = await databases.getDocument(
              DATABASE_ID,
              PRODUCTS_COLLECTION_ID,
              item.productId
            );
            return { ...product, quantity: item.quantity, cartId: item.$id };
          } catch (err) {
            return null;
          }
        })
      );
      setDetailedCart(results.filter(Boolean));
    };

    if (cart.length > 0) fetchProductDetails();
    else setDetailedCart([]);
  }, [cart]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {detailedCart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
        <div className="space-y-4">
          {detailedCart.map((item) => (
            <div
              key={item.cartId}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity-1)}
                    disabled={item.quantity === 1}
                    className="px-3 py-1 border rounded text-lg font-semibold transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    -
                  </button>
                  <span className="text-base mx-2">{item.quantity}</span>
                  <div className="relative group inline-block">
                  <button
                    onClick={() => 
                      updateQuantity(item.cartId, item.quantity+1)
                    }
                    disabled={item.quantity >= item.stock}
                    className="px-3 py-1 border rounded text-lg font-semibold transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    +
                  </button>

                  {item.quantity >= item.stock && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 
                                    px-2 py-1 text-xs bg-black text-white rounded 
                                    opacity-0 group-hover:opacity-50 transition-all duration-200 
                                    pointer-events-none z-10">
                      Stock empty
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Subtotal: ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-red-500 hover:underline text-sm mt-2 block"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Total Amount */}
        <div className="mt-6 text-right">
          <h2 className="text-xl font-semibold">
            Total: ₹
            {detailedCart.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}
          </h2>
        </div>
      </>
      )}
    </div>
  );
}
