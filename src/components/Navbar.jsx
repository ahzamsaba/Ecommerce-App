import {Link} from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className='flex justify-between p-4 shadow bg-white'>
            <Link to='/' className='text-xl font-bold'>ShopEase</Link>
            <div className='space-x-4'>
                <Link to='/cart'>Cart</Link>
                <Link to='/login'>Login</Link>
            </div>
        </nav>
    );
}