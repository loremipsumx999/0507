import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Logout from './pages/components/LogoutButton';

export default function App() {

    const [isLoggedIn, setisLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setisLoggedIn(!!token);
    }, []);
    return (
        <BrowserRouter>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {!isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Regisztráció</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Regisztráció</Link>
                                    </li>
                                </>
                            ):(
                                <li className="nav-item">
                                    <LougoutButton setisLoggedIn={setisLoggedIn} />
                                </li>
                            )
                            }
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <Routes>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/login" element={<Login setisLoggedIn={setisLoggedIn}/>}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}