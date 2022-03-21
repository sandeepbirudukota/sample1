import React from 'react';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import {useEffect, useState} from 'react';
import {useNavigate, Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle, faCamera } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, Container, NavDropdown, InputGroup, FormControl, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import {axiosInstance as authapi} from '../services/authpost';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/editprofile.css';
import LoadingIcons from 'react-loading-icons';
import config from '../config/config';
import '../styles/editprofile.css';
import 'bootstrap/dist/css/bootstrap.css';



const GET_USER_API = '/api/user/';
const EDIT_USER_API = '/api/user/';
const GET_COUNTRY_API = '/api/country/';
const GET_USER_CURRENCY_API = "api/currency/";
const GET_PROFILE_PIC_API = config.baseUrl+"/api/user/profile-picture/";
const UPLOAD_PROFILE_PIC_API = "api/user/profile_picture/upload";


const NAME_REGEX = /^[A-z][A-z0-9-_ ]{3,23}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const ADDRESS_REGEX = /[A-z0-9-_ ,]{3,100}$/;
const CITY_REGEX = /[A-z][A-z-_ ,]{3,10}$/;
const ABOUT_REGEX = /[A-z][A-z0-9-_ ,]{3,100}$/;

const EditProfile = () => {
    const [user, setUser] = useState({});

    const [profilePicture, setProfilePicture] = useState("");

    const [name, setName] = useState("");
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [gender, setGender] = useState("");
    const [validGender, setValidGender] = useState(false);
    const [genderFocus, setGenderFocus] = useState(false);

    const [phone, setPhone] = useState("");
    const [validPhone, setValidPhone] = useState();
    const [phoneFocus, setPhoneFocus] = useState();

    const [city, setCity] = useState("");
    const [validCity, setValidCity] = useState();
    const [cityFocus, setCityFocus] = useState();

    const [address, setAddress] = useState("");
    const [validAddress, setValidAddress] = useState();
    const [addressFocus, setAddressFocus] = useState();

    const [dob, setDob] = useState("");
    const [validDob, setValidDob] = useState();
    const [dobFocus, setDobFocus] = useState();

    const [country, setCountry] = useState("");
    const [validCountry, setValidCountry] = useState();
    const [countryFocus, setCountryFocus] = useState();

    const [about, setAbout] = useState("");
    const [validAbout, setValidAbout] = useState();
    const [aboutFocus, setAboutFocus] = useState();

    const [countries, setCountries] = useState([]);

    const[editProfileLoading, setEditProfileLoading] = useState(true);
    const[editingProfile, setEditingProfile] = useState(false);
    const [gettingCountries, setGettingCountries] = useState(true);
    
    const [error, setError] = useState();
    
    const navigate = useNavigate();
    const [currency,setCurrency] = useState({});


    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone));
    }, [phone])

    useEffect(() => {
        setValidCity(CITY_REGEX.test(city));
    }, [city])

    useEffect(() => {
        setValidAddress(ADDRESS_REGEX.test(address));
    }, [address])

    useEffect(() => {
        setValidAbout(ABOUT_REGEX.test(about));
    }, [about])

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if(!token || !user){
            navigate("/login", {replace:true});
        }else{
            getUser(user);
            getCountries();
            getUserCurrency(user);
        }
    },[]);


    const getCountries = async () => {
        setGettingCountries(true);
        try{
            const response = await authapi.get(GET_COUNTRY_API);
            if(response && response.data && response.data.success && response.data.countries){
                setCountries(response.data.countries);
                setGettingCountries(false);
            }else{
                setError("Some unexpected error occurred!");
                setGettingCountries(false);
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setGettingCountries(false);
        }
    }

    const getUser = async ({id})=>{
        try{
            const response = await authapi.get(GET_USER_API+id);
            if(response && response.data && response.data.success && response.data.user){
                const userObj = response.data.user;
                setUser(userObj);
                if(userObj.profilePicture){
                    setProfilePicture(userObj.profilePicture);
                }
                if(userObj.name){
                    setName(userObj.name);
                }
                if(userObj.email){
                    setEmail(userObj.email);
                }
                if(userObj.gender){
                    setGender(userObj.gender);
                }
                if(userObj.dob){
                    setDob(new Date(userObj.dob));
                }
                if(userObj.phone){
                    setPhone(userObj.phone);
                }
                if(userObj.address){
                    setAddress(userObj.address);
                }
                if(userObj.city){
                    setCity(userObj.city);
                }
                if(userObj.country){
                    setCountry(userObj.country);
                }
                if(userObj.about){
                    setAbout(userObj.about);
                }
                setEditProfileLoading(false);
            }else{
                setError("Some unexpected error occurred!");
                setEditProfileLoading(false);    
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setEditProfileLoading(false);
        }
    }

    const editProfile = async ({id}) => {
        setEditingProfile(true);
        try{
            const userObj = {};
            if(user.id){
                userObj.id = user.id;
            }
            if(profilePicture){
                userObj.profilePicture = profilePicture;
            }
            if(name){
                userObj.name = name;
            }
            if(email){
                userObj.email = email;
            }
            if(gender){
               userObj.gender = gender;
            }
            if(dob){
                userObj.dob = dob;
            }
            if(phone){
                userObj.phone = phone;
            }
            if(address){
                userObj.address = address;
            }
            if(city){
                userObj.city = city;
            }
            if(country){
                userObj.country = country;
            }
            if(about){
                userObj.about = about;
            }
            const response = await authapi.put(EDIT_USER_API+id,userObj);
            if(response && response.data && response.data.success && response.data.user){
                const userObj = response.data.user;
                setUser(userObj);
                if(userObj.profilePicture){
                    setProfilePicture(userObj.profilePicture);
                }
                if(userObj.name){
                    setName(userObj.name);
                }
                if(userObj.email){
                    setEmail(userObj.email);
                }
                if(userObj.gender){
                    setGender(userObj.gender);
                }
                if(userObj.dob){
                    setDob(new Date(userObj.dob));
                }
                if(userObj.phone){
                    setPhone(userObj.phone);
                }
                if(userObj.address){
                    setAddress(userObj.address);
                }
                if(userObj.city){
                    setCity(userObj.city);
                }
                if(userObj.country){
                    setCountry(userObj.country);
                }
                if(userObj.about){
                    setAbout(userObj.about);
                }
                localStorage.setItem('user', JSON.stringify(userObj));
                setEditingProfile(false);
                navigate("/view-profile", {replace:true});
            }else{
                setError("Some unexpected error occurred!");
                setEditingProfile(false);    
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
        }
    }

    const getUserCurrency = async ({currency})=>{
        try{
            const response = await authapi.get(GET_USER_CURRENCY_API+currency);
            if(response && response.data){
                if(response.data.success){
                    setCurrency(response.data.currency);
                }else{
                    console.log(response);
                }
            }else{
                console.log(response);
            }
        }catch(err){
            console.log(JSON.stringify(err));
        }
    }

    const profilePictureSelected = async (event) => {
        const userBrowserStorage = JSON.parse(localStorage.getItem("user"));
        let formData = new FormData();
        const image = event.target.files[0];
        formData.append("image", image);
        formData.append("userId",userBrowserStorage.id);
        try{
            const response = await authapi.post(UPLOAD_PROFILE_PIC_API, formData, { headers: {'Content-Type': 'multipart/form-data'}});
            if(response && response.data && response.data.imageKey){
                const userCopy = JSON.parse(JSON.stringify(user));
                userCopy.profilePicture = response.data.imageKey;
                userBrowserStorage.profilePicture = response.data.imageKey;
                localStorage.setItem("user",JSON.stringify(userBrowserStorage));
                setUser(userCopy);
            }else{
                console.log(response);
            }
        }catch(err){
            console.log(JSON.stringify(err));
        }
	}

  return (
    <div>
        <MainNavbar />
        {!editProfileLoading && !gettingCountries && 
            <div className="edit_profile_home_body">
                <div className="container">
                    <h3 className="edit_profile_header">Your Public Profile</h3>
                    <div className="edit_profile_subheader">Everything on this page can be seen by anyone</div>
                    <button className="btn editprofile_viewprofile-btn" onClick={()=>{navigate("/view-profile")}}>View Profile</button>
                </div>
                <div className="edit-profile-form-container container">
                    <div className="row">
                        <div className="border-btm col-md-12">
                            <div><img src={GET_PROFILE_PIC_API+user.profilePicture} className="view_profile_picture"></img></div>
                            <div>
                                <label className="viewprofile-editimg"htmlFor="profile-pic"><FontAwesomeIcon icon={faCamera}/></label>
                                <input data-testid="profile-pic" onChange={profilePictureSelected} style={{display: "none"}} id="profile-pic" type="file"></input>
                            </div>
                        </div>
                        <div className="border-btm col-md-12">
                        <label htmlFor="username" className="editprofile_item_label">Name</label>
                        <input value={name} className="form-control editprofile_item_input" id="username" name="username" type="text" onChange={(e)=>{setName(e.target.value)}} onFocus={() => setNameFocus(true)} 
                        onBlur={() => setNameFocus(false)}>
                        </input>
                        {validName && <FontAwesomeIcon color="green" icon={faCheck}/> }
                        {(!validName && name) && <FontAwesomeIcon color="red" icon={faTimes} />}
                        <div className="editprofile_input_error">
                            {nameFocus && !validName && 
                                <small className="form-text text-muted editprofile_item_text_container">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <span className="editprofile_item_text">Invalid Name</span>
                                </small>
                            }
                        </div>        
                        </div>
                        <div className="border-btm col-md-12">
                        <label htmlFor="useremail" className="editprofile_item_label">Email</label>
                                <input value={email} className="form-control editprofile_item_input" id="useremail" name="useremail" type="text" onChange={(e)=>{setEmail(e.target.value)}} onFocus={() => setEmailFocus(true)} 
                                onBlur={() => setEmailFocus(false)}>
                                </input>
                                {validEmail && <FontAwesomeIcon color="green" icon={faCheck}/> }
                                {(!validEmail && email) && <FontAwesomeIcon color="red" icon={faTimes} />}
                            <div className="editprofile_input_error">
                                {emailFocus && !validEmail && 
                                    <small className="form-text text-muted editprofile_item_text_container">
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        <span className="editprofile_item_text">Invalid Email</span>
                                    </small>
                                }
                            </div>
                        </div> 
                        <div className="border-btm col-md-12">
                            <div>Gender</div>
                            <Form.Check type="radio" name="gender" id="gender" label="Male" checked={gender === 'Male'} value="Male" onClick={() => setGender('Male')} onChange={() => {}}/>
                            <Form.Check type="radio" name="gender" id="gender" label="Female" checked={gender === 'Female'} value="Female" onClick={() => setGender('Female')} onChange={() => {}} />
                        </div>
                        <div className="border-btm col-md-12">
                            <label htmlFor="userdob" className="editprofile_item_label">Date of Birth</label>
                            <span className="editprofile_dob_container">
                                <DatePicker id="userdob" name="userdob" className="editprofile_dob" selected={dob} onChange={(date) => {setDob(date)}} />
                            </span>
                        </div>
                        <div className="border-btm col-md-12">
                            <label htmlFor="userphone" className="editprofile_item_label">Phone</label>
                                <input value={phone} className="form-control editprofile_item_input" id="userphone" name="userphone" type="text" onChange={(e)=>{setPhone(e.target.value)}} onFocus={() => setPhoneFocus(true)} 
                                onBlur={() => setPhoneFocus(false)}>
                                </input>
                                {validPhone && <FontAwesomeIcon color="green" icon={faCheck}/> }
                                {(!validPhone && phone) && <FontAwesomeIcon color="red" icon={faTimes} />}
                                <div className="editprofile_input_error">
                                    {phoneFocus && !validPhone && 
                                        <small className="form-text text-muted editprofile_item_text_container">
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                            <span className="editprofile_item_text">Invalid Phone</span>
                                        </small>
                                    }
                                </div>
                        </div>
                        <div className="border-btm col-md-12">
                                <label htmlFor="useraddress" className="editprofile_item_label">Address</label>
                                <input value={address} className="form-control editprofile_item_input" id="useraddress" name="useraddress" type="text" onChange={(e)=>{setAddress(e.target.value)}} onFocus={() => setAddressFocus(true)} 
                                onBlur={() => setAddressFocus(false)}>
                                </input>
                                {validAddress && <FontAwesomeIcon color="green" icon={faCheck}/> }
                                {(!validAddress && address) && <FontAwesomeIcon color="red" icon={faTimes} />}
                                <div className="editprofile_input_error">
                                    {addressFocus && !validAddress && 
                                        <small className="form-text text-muted editprofile_item_text_container">
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                            <span className="editprofile_item_text">Invalid Address</span>
                                        </small>
                                    }
                                </div>
                        </div>
                        <div className="border-btm col-md-12">
                            <label htmlFor="usercity" className="editprofile_item_label">City</label>
                                <input value={city} className="form-control editprofile_item_input" id="usercity" name="usercity" type="text" onChange={(e)=>{setCity(e.target.value)}} onFocus={() => setCityFocus(true)} 
                                onBlur={() => setCityFocus(false)}>
                                </input>
                                {validCity && <FontAwesomeIcon color="green" icon={faCheck}/> }
                                {(!validCity && city) && <FontAwesomeIcon color="red" icon={faTimes} />}
                                <div className="editprofile_input_error">
                                    {cityFocus && !validCity && 
                                        <small className="form-text text-muted editprofile_item_text_container">
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                            <span className="editprofile_item_text">Invalid City</span>
                                        </small>
                                    }
                                </div>
                        </div>
                        <div className="border-btm col-md-12">
                            <label htmlFor="usercountry" className="editprofile_item_label">Country</label>
                            <span className="editprofile-country">
                                <Form.Select name="usercountry" id="usercountry" value={country} onChange={(e)=>{setCountry(e.target.value)}}>
                                    <option value="">Select Country</option>
                                    {
                                        countries.map((eachCountry,index)=>{
                                            return <option key={index} value={eachCountry.id}>{eachCountry.name}</option>
                                        })
                                    }
                                </Form.Select>
                            </span>
                        </div>
                        <div className="col-md-12">
                                <Form.Label className="editprofile_item_label margn-tp">About</Form.Label>
                                {validAbout && <FontAwesomeIcon color="green" icon={faCheck}/> }
                                {(!validAbout && about) && <FontAwesomeIcon color="red" icon={faTimes} />}
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Control value={about} as="textarea" rows={3} onChange={(e)=>{setAbout(e.target.value)}} />
                                </Form.Group>
                            <div>
                                {about && !validAbout && 
                                    <small className="form-text text-muted editprofile_item_text_container">
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        <span className="editprofile_item_text">Invalid About</span>
                                    </small>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="col-md-12">
                        <button className="btn editprofile_save-btn" onClick={()=>{editProfile(user)}} disabled={editingProfile || !validName || !validEmail || !validPhone || !validAddress || !validCity || !validAbout}>Save</button>
                        <button className="btn editprofile_cancel-btn" onClick={()=>{navigate("/view-profile")}} disabled={editingProfile}>Cancel</button>
                    </div>
                </div>
            </div>
        }
        {editProfileLoading && <span><LoadingIcons.ThreeDots height="5px" width="30px" stroke="black" fill="black"/></span>}
        {!editProfileLoading && <MainFooter currency={currency} setCurrency={setCurrency}/>}
    </div>
  )
}

export default EditProfile