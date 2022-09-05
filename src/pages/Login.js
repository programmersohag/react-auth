import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";

const required = (value) => {
    if (!value) {
        return (
            <div className="invalid-feedback d-block">
                This field is required!
            </div>
        );
    }
};
const Login = () => {
    const checkBtn = useRef();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState({username: '', password: ''});
    const navigate = useNavigate();
    const onChangeForm = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        // form.current.validateAll();
        if (checkBtn.current.context._errors.length === 0) {
            AuthService.login(user.username, user.password).then((resp) => {
                    if (resp) {
                        navigate("/");
                        window.location.reload();
                    }
                },
                (error) => {
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message;
                    setLoading(false);
                    setMessage(resMessage);
                    console.log(error.response.data.message)
                });
        } else {
            setLoading(false);
        }
    };
    return (
        <div className="row">
            <div className="col-md-4 offset-4">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />
                    <Form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={onChangeForm}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={onChangeForm}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" disabled={loading}>
                                {loading && (
                                    <span className="mr-2 spinner-border spinner-border-sm"/>
                                )}
                                <span>Login</span>
                            </button>
                        </div>
                        {message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                        <CheckButton style={{display: "none"}} ref={checkBtn}/>
                    </Form>
                </div>
            </div>
        </div>
    );
};
export default Login;