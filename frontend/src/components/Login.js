import React from 'react';
import {useState, useRef, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from '../services/post';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/login.css';
import LoadingIcons from 'react-loading-icons';
import {Link, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { addUser } from "../redux/actions/actions.js";



const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const LOGIN_API = '/api/login/';
const HOMEPAGE = "/";
const REGISTER_URL = "/register";


const ConnectedLogin = ({user,addUser}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [loggingIn, setLoggingIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if(token && user){
            navigate(HOMEPAGE, {replace:true});
        }
    },[]);

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    },[email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password])

    useEffect(() => {
        setErrorMsg('');
    }, [email, password])

    const loginUser = async ()=>{
        // make AXIOS api call
        setLoggingIn(true);
        const user = {email,password};
        try{
            const response = await api.post(LOGIN_API,user);
            if(response && response.data){
                if(response.data.success){
                    const user = response.data.user;
                    if(user){
                        const token = user.token;
                        localStorage.setItem("token",token);
                        delete user.token;
                        localStorage.setItem("user",JSON.stringify(user));
                        addUser(user);
                        setLoggingIn(false);
                        setSuccess(true);
                        navigate(HOMEPAGE, {replace:true});
                    }
                }else{
                    setSuccess(false);
                    setErrorMsg("Some unexpected error occurred!");
                    setLoggingIn(false);
                }
            }else{
                setSuccess(false);
                setErrorMsg("Some unexpected error occurred!");
                setLoggingIn(false);
            }
        }catch(err){
            setSuccess(false);
            if(err && err.response && err.response.data && err.response.data.error){
                console.log(err.response.data.error)
                setErrorMsg(err.response.data.error);
            }
            setLoggingIn(false);
        }
    }
    
    
    const handleUserLoginSubmit = (e)=>{
        if(validEmail && validPassword && !loggingIn){
            e.preventDefault();
            loginUser();
        }
    }
    
    return (
        <section>
            <form action="" onSubmit={handleUserLoginSubmit}>
                <div className="container login_container">
                    <div className="mainnavbar-title">Etsy</div>
                    <div className="col-md-12 col-sm-12">
                        <h1 className="login__header">Log In</h1>
                    <div className="login_item_container form-group">
                        <label htmlFor="useremail" className="login_item_label">Email</label>
                        {validEmail && <FontAwesomeIcon color="green" icon={faCheck}/> }
                        {(!validEmail && email) && <FontAwesomeIcon color="red" icon={faTimes} />}
                        <input ref={emailRef} className="form-control login_item_input" id="useremail" name="useremail" type="text" onChange={(e)=>{setEmail(e.target.value)}} onFocus={() => setEmailFocus(true)} 
                        onBlur={() => setEmailFocus(false)}>
                        </input>
                        {emailFocus && !validEmail && 
                            <small className="form-text text-muted login_item_text_container">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <span className="login_item_text">Invalid Email</span>
                            </small>
                        }    
                    </div>
                    <div className="login_item_container form-group">
                        <label className="login_item_label" htmlFor="userpassword">Password</label>
                        {validPassword && <FontAwesomeIcon color="green" icon={faCheck}/> }
                        {(!validPassword && password) && <FontAwesomeIcon color="red" icon={faTimes} />}
                        <input className="form-control login_item_input" id="userpassword" name="userpassword" type="password" onChange={(e)=>{setPassword(e.target.value)}} onFocus={() => setPasswordFocus(true)} 
                        onBlur={() => setPasswordFocus(false)}>
                        </input>
                        {passwordFocus && !validPassword && 
                            <small className="form-text text-muted login_item_text_container">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <span className="login_item_text">
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span></span>
                            </small>
                        }    
                    </div>
                    <div className="login_item_container form-group">
                        <button id="login-btn" className="btn btn-dark login_btn" type="submit">Login</button>
                        {loggingIn && <span><LoadingIcons.ThreeDots height="5px" width="30px" stroke="black" fill="black"/></span>}
                        {errorMsg && <p className="error">{errorMsg}</p>}
                        <p><Link to={REGISTER_URL}>Dont have an account? Register here!</Link></p>
                    </div>
                    </div>
                </div>
            </form>
        </section>
    )
   
}

function mapDispatchToProps(dispatch) {
  return {
    addUser: user => dispatch(addUser(user))
  };
}


const mapStateToProps = state => {
  return { user: state.user };
};

const Login = connect(mapStateToProps,mapDispatchToProps)(ConnectedLogin);
export default Login;