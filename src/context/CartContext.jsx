import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "../utils/appwriteConfig";
import { useAuth } from "./AuthContext";
import { data } from "react-router-dom";
import { Query } from "appwrite";

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CART_COLLECTION_ID = "6859af840000a66c5a4c"
const PRODUCTS_COLLECTION_ID = "685974800022b980b3f5"

export default function CartProvider({children}) {
    const {user} = useAuth()
    const [cart, setCart] = useState([])
    const [detailedCart, setDetailedCart] = useState([])

    const fetchCart = async () => {
        console.log("Fetching cart for user:", user?.$id);
        if(!user) return setCart([])
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                CART_COLLECTION_ID,
                [Query.equal("userId", user.$id)]
            );
            console.log("Cart documents from Appwrite:", res.documents);
            setCart(res.documents)
        } catch (err) {
            console.error("Error fetching cart: ", err)
        }
    }

    const addToCart = async (product) => {
        if(!user) return;

        const existing = cart.find((item) => item.productId === product.$id)

        if(existing){
            try {
                await databases.updateDocument(
                    DATABASE_ID,
                    CART_COLLECTION_ID,
                    existing.$id,
                    {quantity: existing.quantity + 1}
                )
            } catch (err) {
                console.error("Failed to update quantity", err)
            }
        }
        else{
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    CART_COLLECTION_ID,
                    "unique()",
                    {
                        userId: user.$id,
                        productId: product.$id,
                        quantity: 1,
                    }
                )
            } catch (err) {
                console.error("Failed to add to cart", err)
            }
        }
        fetchCart();
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                CART_COLLECTION_ID,
                cartItemId
            )
            fetchCart()
        } catch (err) {
            console.error("Failed to remove from cart", err)
        }
    }

    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                CART_COLLECTION_ID,
                cartItemId,
                {quantity: newQuantity}
            );
            fetchCart()
        } catch (err) {
            console.error("Failed to update quantity", err)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [user])

    useEffect(() => {
        const fetchDetailedCart = async() => {
            if(cart.length === 0){
                setDetailedCart([])
                return;
            }

            const results = await Promise.all(
                cart.map(async (item) => {
                    try {
                        const product = await databases.getDocument(
                            DATABASE_ID,
                            PRODUCTS_COLLECTION_ID,
                            item.productId
                        )
                        return {...product, quantity: item.quantity, cartId: item.$id}
                    } catch (error) {
                        console.error("Failed to fetch product:", error);
                        return null;
                    }
                })
            )
            setDetailedCart(results.filter(Boolean))
        }
        fetchDetailedCart()
    }, [cart])


    return (
        <CartContext.Provider value={{
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            detailedCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}