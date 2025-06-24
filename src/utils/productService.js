import { databases } from "./appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = "685974800022b980b3f5"

export async function getAllProducts() {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID)
        return response.documents
    } catch (error) {
        console.error("Failed to fetch products:", error)
        return []
    }
}