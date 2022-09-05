import React from "react";
import {useLocation} from "react-router-dom";
import JwtUtil from "./jwt.util";

const AuthVerify = (props) => {
    const location = useLocation();
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const decodedJwt = JwtUtil.parseJwt(user.token);
            console.log(decodedJwt)
            console.log(new Date(decodedJwt.exp * 1000))
            if (decodedJwt.exp * 1000 < Date.now()) {
                props.logOut();
            }
        }
        console.log('new route: ', location.pathname)
    }, [location, props])
    return <div/>;
};

export default AuthVerify;