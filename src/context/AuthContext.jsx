import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../utils/appwriteConfig";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const getUser = async () => {
        try {
            const userData = await account.get()
            setUser(userData)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    };

    const signup = async (email, password, name) => {
        await account.create("unique()", email, password, name)
        return login(email,password)
    };

    const login = async (email, password) => {
        await account.createEmailPasswordSession(email,password)
        return getUser()
    };

    const logout = async () => {
        await account.deleteSession("current")
        setUser(null)
    };

    useEffect(() => {
        getUser()
    }, [])

    return (
        <AuthContext.Provider value={{user, login, signup, logout, loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
}