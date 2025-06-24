import {Link} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const {user, logout} = useAuth()

    return (
        <nav className='flex justify-between items-center p-4 shadow bg-white'>
            <Link to='/' className='text-xl font-bold'>ShopEase</Link>
            <div className='space-x-4'>
                {user && (
                    <>
                        <Link
                            to='/cart'
                            className='text-gray-700'
                        >
                            🛒 Cart
                        </Link>

                        <Link
                            to='/order-history'
                            className='text-gray-700 hover:underline'
                        >
                            📦 My Orders
                        </Link>
                    </>
                )}
                
                {user ? (
                    <>
                        <span className='text-sm text-gray-700'>Hello, {user.name}</span>
                        <button onClick={logout} className='text-red-600 hover:underline'>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className='text-blue-600 hover:underline'>Login</Link>
                        <Link to='/signup' className='text-blue-600 hover:underline'>Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
}