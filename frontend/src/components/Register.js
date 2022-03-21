import React,{useState, useRef, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useNavigate} from 'react-router-dom';
import api from '../services/post';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/register.css';
import LoadingIcons from 'react-loading-icons';
import {Link} from 'react-router-dom';
import { connect } from "react-redux";
import { addUser } from "../redux/actions/actions.js";

const USER_REGEX = /^[A-z][A-z0-9-_ ]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const REGISTER_API = '/api/register';
const HOMEPAGE = "/"; 
const LOGIN_URL = "/login";

const ConnectedRegister = ({user,addUser}) => {
    const nameRef = useRef();

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [registering, setRegistering] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if(token && user){
            navigate(HOMEPAGE, {replace:true});
        }
    },[]);

    
    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(name));
    }, [name])

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    },[email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatchPassword(PWD_REGEX.test(matchPassword) && password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrorMsg('');
    }, [name, email, password, matchPassword])

    const registerUser = async ()=>{
        // make AXIOS api call
        try{
            setRegistering(true);
            const user = {name,email,password};
            const response = await api.post(REGISTER_API,user);
            if(response && response.data){
                if(response.data.success){
                    const user = response.data.user;
                    if(user && user.token){
                        localStorage.setItem("token",user.token);
                        delete user.token;
                        localStorage.setItem("user",JSON.stringify(user));
                        addUser(user);
                        setRegistering(false);
                        setSuccess(true);
                        navigate(HOMEPAGE,{replace:true});
                    }
                }else{
                    // TODO show error message from response
                    setSuccess(false);
                    setErrorMsg("Some unexpected error occurred!");
                    setRegistering(false);
                }
            }else{
                //TODO show unexpected error
                setErrorMsg("Some unexpected error occurred!");
                setRegistering(false);
            }
        }catch(err){
            setSuccess(false);
            if(err && err.response && err.response.data && err.response.data.error){
                setErrorMsg(err.response.data.error);
            }
            setRegistering(false);
        }
    }
    
    
    const handleUserRegistrationSubmit = (e)=>{
        if(validName && validEmail && validPassword && validMatchPassword && !registering){
            e.preventDefault();
            registerUser();
        }
    }

    return (
        <section>
            <form action="" onSubmit={handleUserRegistrationSubmit}>
                <div className="container">
                    <div className="register_container col-md-3 col-sm-12">
                        <div className="mainnavbar-title">Etsy</div>
                        <h1 className="register__header">Register</h1>
                        <div className="register_item_container form-group">
                            <label className="register_item_label" htmlFor="username">Name</label>
                            {validName && <FontAwesomeIcon color="green" icon={faCheck}/> }
                            {(!validName && name) && <FontAwesomeIcon color="red" icon={faTimes} />}
                            <input ref={nameRef} className="form-control register_item_input" id="username" name="username" type="text" onChange={(e)=>{setName(e.target.value)}} onFocus={() => setUserFocus(true)} 
                            onBlur={() => setUserFocus(false)}>
                            </input>
                            {userFocus && !validName && 
                                <small className="form-text text-muted register_item_text_container">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <span className="register_item_text">4 to 24 characters.<br />
                                    Must begin with a letter.<br />
                                    Letters, numbers, underscores, hyphens allowed.</span>
                                </small>
                            }    
                        </div>
                        <div className="register_item_container form-group">
                            <label className="register_item_label" htmlFor="useremail">Email</label>
                            {validEmail && <FontAwesomeIcon color="green" icon={faCheck}/> }
                            {(!validEmail && email) && <FontAwesomeIcon color="red" icon={faTimes} />}
                            <input className="form-control register_item_input" id="useremail" name="useremail" type="text" onChange={(e)=>{setEmail(e.target.value)}} onFocus={() => setEmailFocus(true)} 
                            onBlur={() => setEmailFocus(false)}>
                            </input>
                            {emailFocus && !validEmail && 
                                <small className="form-text text-muted register_item_text_container">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <span className="register_item_text">Invalid Email</span>
                                </small>
                            }    
                        </div>
                        <div className="register_item_container form-group">
                            <label className="register_item_label" htmlFor="userpassword">Password</label>
                            {validPassword && <FontAwesomeIcon color="green" icon={faCheck}/> }
                            {(!validPassword && password) && <FontAwesomeIcon color="red" icon={faTimes} />}
                            <input className="form-control register_item_input" id="userpassword" name="userpassword" type="password" onChange={(e)=>{setPassword(e.target.value)}} onFocus={() => setPasswordFocus(true)} 
                            onBlur={() => setPasswordFocus(false)}>
                            </input>
                            {passwordFocus && !validPassword && 
                                <small className="form-text text-muted register_item_text_container">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <span className="register_item_text">
                                    8 to 24 characters.<br />
                                    Must include uppercase and lowercase letters, a number and a special character.<br />
                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span></span>
                                </small>
                            }    
                        </div>
                        <div className="register_item_container form-group">
                            <label className="register_item_label" htmlFor="usermatchpassword">Confirm Password</label>
                            {validMatchPassword && <FontAwesomeIcon color="green" icon={faCheck}/> }
                            {(!validMatchPassword && matchPassword) && <FontAwesomeIcon color="red" icon={faTimes} />}
                            <input className="form-control register_item_input" id="usermatchpassword" name="usermatchpassword" type="password" onChange={(e)=>{setMatchPassword(e.target.value)}} onFocus={() => setMatchPasswordFocus(true)} 
                            onBlur={() => setMatchPasswordFocus(false)}>
                            </input>
                            {matchPasswordFocus && !validMatchPassword && 
                                <small className="form-text text-muted register_item_text_container">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <span className="register_item_text">Must match the first password input field.</span>
                                </small>
                            }    
                        </div>
                        <div className="register_item_container form-group">
                            <button  className="btn btn-dark register_btn" type="submit">Register</button>
                            {registering && <span><LoadingIcons.ThreeDots height="5px" width="30px" stroke="black" fill="black"/></span>}
                            {errorMsg && <p className="error">{errorMsg}</p>}
                            <p><Link to={LOGIN_URL}>Already Have an account? Login here!</Link></p>
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

const Register = connect(mapStateToProps,mapDispatchToProps)(ConnectedRegister);
export default Register