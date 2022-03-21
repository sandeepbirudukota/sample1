import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link, Navigate, useNavigate} from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, InputGroup, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart} from "@fortawesome/free-regular-svg-icons";
import { faCartShopping, faMagnifyingGlass, faShop} from "@fortawesome/free-solid-svg-icons";

import {axiosInstance as authapi} from '../services/authpost';
import { connect } from "react-redux";
import { removeUser } from "../redux/actions/actions.js";
import '../styles/mainnavbar.css';
import 'bootstrap/dist/css/bootstrap.css';

const USER_SHOP_API = "api/shop/user/";
const CART_PAGE = "/cart";
const LOGIN_PAGE = "/login";
const SHOP_HOME_PAGE = "/shop/home/";
const SHOP_CREATE_PAGE = "/shop/create";

const ConnectedMainNavBar = ({searchQuery, getOtherFilterItems, setSearchQuery,removeUser})=>{
    const navigate = useNavigate();

    const logout = ()=>{
        removeUser();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate(LOGIN_PAGE,{replace:true});
    }

    const goToShop = async ()=>{
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if(!token || !user){
            navigate(LOGIN_PAGE, {replace:true});
        }else{
            try{
                const response = await authapi.get(USER_SHOP_API+user.id);
                console.log(response, response.data)
                if(response && response.data){
                    if(response.data.success){
                        if(response.data.shopFound){
                           // const shop = response.data.shop;
                           // console.log(response.data.shop.id)
                            navigate(SHOP_HOME_PAGE+response.data.shop.id);
                        }else{
                            navigate(SHOP_CREATE_PAGE);
                        }
                    }else{
                        console.log(response);
                    }
                }else{
                   console.log(response);
                }
            }catch(err){
                if(err && err.response && err.response.data && err.response.data.error){
                    console.log(err.response.data.error);
                }
            }
        }
    }

    const goToCart = async ()=>{
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if(!token || !user){
            navigate(LOGIN_PAGE, {replace:true});
        }else{
            navigate(CART_PAGE);
        }
    }
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand className="mainnavbar-title" href="/home">Etsy</Navbar.Brand>
                <InputGroup>
                    <FormControl
                    placeholder="Search for anything" className="mainnavbar-search-1"
                    value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value)}}
                    />
                    <InputGroup.Text className="mainnavbar-search-2" onClick={getOtherFilterItems} id="basic-addon2"><FontAwesomeIcon color="black" icon={faMagnifyingGlass}/></InputGroup.Text>
                </InputGroup>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title={<FontAwesomeIcon color="black" icon={faUser}/>} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/view-profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="/orders">My Orders</NavDropdown.Item>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/view-profile"><FontAwesomeIcon color="black" icon={faHeart}/></Nav.Link>
                    <Nav.Link onClick={goToShop}><FontAwesomeIcon color="black" icon={faShop}/></Nav.Link>
                    <Nav.Link onClick={goToCart}><FontAwesomeIcon color="black" icon={faCartShopping}/></Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function mapDispatchToProps(dispatch) {
  return {
    removeUser: user => dispatch(removeUser())
  };
}

const MainNavbar = connect(null,mapDispatchToProps)(ConnectedMainNavBar);
export default MainNavbar