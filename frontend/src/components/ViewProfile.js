import React from 'react';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import {useEffect, useState} from 'react';
import {useNavigate, Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCamera, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import LoadingIcons from 'react-loading-icons';
import {axiosInstance as authapi} from '../services/authpost';
import FavoriteItem from './FavoriteItem.js';
import { Navbar, Nav, Container, NavDropdown, InputGroup, FormControl} from 'react-bootstrap';
import config from '../config/config';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/viewprofile.css';


const GET_USER_API = '/api/user/';
const GET_COUNTRY_API = '/api/country/';
const GET_FAVORITE_ITEMS_API = 'api/favoriteitem/';
const GET_FAVORITE_ITEMS_FILTER_API = 'api/favoriteitem/filter';
const GET_USER_CURRENCY_API = "api/currency/";
const UPLOAD_PROFILE_PIC_API = "api/user/profile-picture/upload";
const GET_PROFILE_PIC_API = config.baseUrl+"/api/user/profile-picture/";

const ViewProfile = () => {
    
    const getUser = async ({id})=>{
        setViewProfileLoading(true);
        try{
            const response = await authapi.get(GET_USER_API+id);
            if(response && response.data && response.data.success && response.data.user){
                let date = new Date(response.data.user.dob);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let dt = date.getDate();
                if (dt < 10) {
                dt = '0' + dt;
                }
                if (month < 10) {
                month = '0' + month;
                }
                response.data.user.dob = month+"/"+dt+"/"+year;
                setUser(response.data.user);
                setViewProfileLoading(false);
            }else{
                setError("Some unexpected error occurred!");
                setViewProfileLoading(false);    
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setViewProfileLoading(false);
        }
    }

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

    const getFavoriteItems = async () => {
        setGettingFavoriteItems(true);
        try{
            
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await authapi.get(GET_FAVORITE_ITEMS_API+user.id);
            if(response && response.data && response.data.success && response.data.favoriteItems){
                setFavoriteItems(response.data.favoriteItems);
                setGettingFavoriteItems(false);
            }else{
                setError("Some unexpected error occurred!");
                setGettingFavoriteItems(false);
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setGettingFavoriteItems(false);
        }
    }

    const getFilteredFavoriteItems = async ()=>{
        setGettingFavoriteItems(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const filterData = {};
        filterData.searchQuery = searchQuery;
        filterData.userId = user.id;
        try{
        const response = await authapi.post(GET_FAVORITE_ITEMS_FILTER_API,filterData);
        if(response && response.data){
            if(response.data.success){
                const items = response.data.items;
                setFavoriteItems(items);
                setGettingFavoriteItems(false);
            }else{
                setError("Some unexpected error occurred!");
                setGettingFavoriteItems(false);
            }
        }else{
            setError("Some unexpected error occurred!");
            setGettingFavoriteItems(false);
        }
        }catch(err){
            if(err && err.response && err.response.data && err.response.data.error){
                setError(err.response.data.error);
            }
            setGettingFavoriteItems(false);
        }
  }

  const getUserCurrency = async ({currency})=>{
        setGettingCurrency(true);
        try{
            const response = await authapi.get(GET_USER_CURRENCY_API+currency);
            if(response && response.data){
                if(response.data.success){
                    setCurrency(response.data.currency);
                    setGettingCurrency(false);
                }else{
                    console.log(response);
                    setGettingCurrency(false);
                }
            }else{
                console.log(response);
                setGettingCurrency(false);
            }
        }catch(err){
            console.log(JSON.stringify(err));
            setGettingCurrency(false);
        }
    }

    const [countries, setCountries] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [user, setUser] = useState("");
    const [error, setError] = useState(false);
    const [viewProfileLoading, setViewProfileLoading] = useState(true);
    const [gettingCountries, setGettingCountries] = useState(true);
    const [gettingFavoriteItems, setGettingFavoriteItems] = useState(true);
    const [profilePicture,setProfilePicture] = useState("");
    const [searchQuery,setSearchQuery] = useState("");
    const [currency,setCurrency] = useState({});
    const [gettingCurrency, setGettingCurrency] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if(!token || !user){
            navigate("/login", {replace:true});
        }else{
            getUser(user);
            getCountries();
            getFavoriteItems();
            getUserCurrency(user);
            setProfilePicture(user.profilePicture);
        }
    },[]);

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
         <div className="view_profile_home_body">
            {!gettingCurrency && !gettingFavoriteItems && !gettingCountries && !viewProfileLoading && <div>
                    <div className="row">
                        <div className="col-md-2 col-sm-12">
                            <div><img src={GET_PROFILE_PIC_API+user.profilePicture} className="view_profile_picture"></img></div>
                            {console.log(GET_PROFILE_PIC_API+user.profilePicture)}
                            {console.log("kasdhkaj")}
                            <div>
                                <label className="viewprofile-editimg"htmlFor="profile-pic"><FontAwesomeIcon icon={faCamera}/></label>
                                <input data-testid="profile-pic" onChange={profilePictureSelected} style={{display: "none"}} id="profile-pic" type="file"></input>
                            </div>
                        </div>
                        <div className="viewprofile_username col-md-8 col-sm-12">
                            <div>
                                <span>{user && user.name}</span>
                                <span className="viewprofile_editicon_container">
                                    <Link to="/edit-profile">
                                        <FontAwesomeIcon className="viewprofile_edit_icon viewprofile_edit-profile-icon" icon={faPen}/>
                                    </Link>
                                </span>
                            </div>
                            <div className="row">
                                <div data-testid="user-email" className="viewprofile_useremail col-md-6 col-sm-12">
                                    {user && user.email}
                                </div>
                                <div data-testid="user-gender" className="viewprofile_usergendercountry col-md-12 col-sm-12">
                                    {user && user.gender}{countries.filter((eachCountry)=>{return user.country===parseInt(eachCountry.id)}) && countries.filter((eachCountry)=>{return user.country===parseInt(eachCountry.id)})[0] && countries.filter((eachCountry)=>{return user.country===parseInt(eachCountry.id)})[0].name ? countries.filter((eachCountry)=>{return user.country===parseInt(eachCountry.id)}) && countries.filter((eachCountry)=>{return user.country===parseInt(eachCountry.id)})[0] && ", "+countries.filter((eachCountry)=>{return user.country===parseInt(eachCountry.id)})[0].name:""}
                                </div>
                                <div data-testid="user-dob" className="viewprofile_userdob col-md-12 col-sm-12">
                                    {user && <span>{user.dob}</span>}
                                </div>
                                <div data-testid="user-phone" className="viewprofile_userphone col-md-12 col-sm-12">
                                    {user && <span>{user.phone}</span>}
                                </div>
                                <div data-testid="user-address" className="viewprofile_useraddress col-md-12 col-sm-12">
                                    {user && user.address}
                                </div>
                                <div data-testid="user-city" className="viewprofile_usercity col-md-12 col-sm-12">
                                    {user && user.city}
                                </div>
                                <div data-testid="user-about" className="viewprofile_userabout col-md-12 col-sm-12">
                                    <span>{user && user.about}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="favitems-container">
                    <span className="favitems-header"><h4>Favorite Items</h4></span>
                    <span className="favitems-search-container">
                        <InputGroup>
                            <FormControl className="favitems-search-bar-1"
                            placeholder="Search your favorites"
                            value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value)}}
                            />
                            <InputGroup.Text className="favitems-search-bar-2" onClick={getFilteredFavoriteItems} id="basic-addon2"><FontAwesomeIcon icon={faMagnifyingGlass}/></InputGroup.Text>
                        </InputGroup>
                    </span>
                </div>
                <div>
                    {favoriteItems && favoriteItems.map((eachFavoriteItem,index)=>{
                        return <FavoriteItem currency={currency} index={index} favoriteItems={favoriteItems} setFavoriteItems={setFavoriteItems} key={eachFavoriteItem.favoriteItemId} item={eachFavoriteItem}/>
                    })}
                </div>
            </div>}
            {viewProfileLoading && <span><LoadingIcons.ThreeDots height="5px" width="30px" stroke="black" fill="black"/></span>}
         </div>
        {!gettingCurrency && !gettingFavoriteItems && !gettingCountries && !viewProfileLoading && <MainFooter currency={currency} setCurrency={setCurrency}/>}
    </div>
  )
}

export default ViewProfile