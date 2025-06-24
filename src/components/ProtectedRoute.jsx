import {Navigate, useLocation} from "react-router-dom"
import {useAuth} from '../context/AuthContext'
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function ProtectedRoute({children}) {
    const { user, loading} = useAuth()
    const location = useLocation()

    useEffect(() => {
        if(!user && !loading)
            toast.error("Please login to access this page")
    }, [user, loading])

    if(loading) return <p className="p-6">Checking login status...</p>

    if(!user){
        return <Navigate to='/login' state={{from: location}} replace />
    }

    return children;
}