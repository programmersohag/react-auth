import './App.css';
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NoPage from "./pages/NoPage";
import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "./services/auth.service";
import AuthVerify from "./common/AuthVerify";
import axios from "axios";
import JwtUtil from "./common/jwt.util";

function App() {
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            const decodedJwt = JwtUtil.parseJwt(user.token);
            setCurrentUser(user);
            setShowAdminBoard(decodedJwt.scope.includes("ADMIN"));
        }
    }, []);

    const logOut = () => {
        navigate('/login', {replace: true});
        AuthService.logout();
        setShowAdminBoard(false);
        setCurrentUser(undefined);
        window.location.reload();
    };

    axios.interceptors.request.use((config) => {
        config.headers.siteName = "helloWorld.com";
        config.headers.Authorization = localStorage.token;
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    axios.interceptors.response.use((response) => {
        if (response.status === 401) {
            alert("You are not authorized");
            navigate("/login", {replace: true});
        } else if (response.status === 403) {
            alert("You don't have permission to access this page");
        }
        return response;
    }, (error) => {
        if (error) {
            return Promise.reject(error);
        }
        return Promise.reject(error.message);
    });
    return (
        <div>
            <nav>
                <ul>
                    {showAdminBoard ? (
                        <>
                            <li><Link to={'/'}>Home</Link></li>
                            <li><Link to={'/about'}>About</Link></li>
                            <li><Link to={'/logout'} onClick={logOut}>Logout</Link></li>
                        </>
                    ) : (
                        <li><Link to={'/login'} onClick={logOut}>Login</Link></li>
                    )}
                </ul>
            </nav>
            <Routes>
                {showAdminBoard && (
                    <>
                        <Route index element={<Home/>}/>
                        <Route path="about" element={<About/>}/>
                    </>)}
                <Route path="login" element={<Login/>}/>
                <Route path="logout" element={<Logout/>}/>
                <Route path="*" element={<NoPage/>}/>
            </Routes>
            <AuthVerify logOut={logOut}/>
        </div>
    );
}

export default App;
