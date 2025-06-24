import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const {signup} = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({email: "", password: "", name: ""})

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signup(form.email, form.password, form.name)
            navigate('/')
        } catch (err) {
            alert("Signup failed!")
            console.error(err)
        }
    };

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Signup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    name="name"
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded">
                    Sign Up
                </button>
            </form>
        </div>
    );
}