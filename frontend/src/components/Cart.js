 import React,{useState, useEffect} from 'react';
import CartItem from './CartItem';
import {useNavigate} from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';

import { Form, Button } from 'react-bootstrap';
import MainFooter from './MainFooter';
import MainNavbar from './MainNavbar';
import '../styles/cart.css';


const CART_ITEMS_API = "/api/cart/get/";
const PLACE_ORDER_API = "/api/order/place/";
const LOGIN_PAGE = "/login";
const ORDERS_PAGE = "/orders";
const GET_USER_CURRENCY_API = "api/currency/";



const Cart = () => {
    const navigate = useNavigate();
    const [cartItems,setCartItems] = useState([]);
    const [currency,setCurrency] = useState({});
    const [cartCost,setCartCost] = useState(0);
    const [invalidOrder, setInvalidOrder] = useState([]);
    const [canPlaceOrder, setCanPlaceOrder] = useState(true);
    const [orderPlaceErrorMsg, setOrderPlaceErrorMsg] = useState("");
    const [totalOrderCost,setTotalOrderCost] = useState(0);
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

  const getCartItems = async ()=>{
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate(LOGIN_PAGE, {replace:true});
      }else{
          try{
              const response = await authapi.get(CART_ITEMS_API+user.id);
              if(response && response.data){
                  if(response.data.success){
                      if(response.data.items){
                          setCartItems(response.data.items);
                          console.log(response.data.items);
                          let invalidOrderCopy = [];
                          response.data.items.forEach((item)=>{
                                invalidOrderCopy.push(false);
                          })
                          setInvalidOrder(invalidOrderCopy);
                      }else{
                          setCartItems([]);
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

  const placeOrder = async ()=>{
      setOrderPlaceErrorMsg("");
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const data = {};
      data.userId = user.id;
      if(!token || !user){
          navigate(LOGIN_PAGE, {replace:true});
      }else if(!user.address || !user.country || !user.city){
        setOrderPlaceErrorMsg("Please specify complete address details in your profile section before placing order!");
      }else{
          try{
              const response = await authapi.post(PLACE_ORDER_API,data);
              if(response && response.data){
                  if(response.data.success){
                    navigate(ORDERS_PAGE, {replace:true});
                  }else{
                    console.log("Error placing order");
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

  useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate("/login", {replace:true});
      }else{
          getCartItems();
          getUserCurrency(user);
      }
  },[]);

  useEffect(() => {
        let flag = false;
        invalidOrder.forEach((eachOrderInvalid)=>{
            if(eachOrderInvalid){
                setCanPlaceOrder(false);
                flag=true;
            }
      })
      if(!flag){
          setCanPlaceOrder(true);
      }
  },[invalidOrder]);

  useEffect(() => {
        let totalCost = 0;
        cartItems.forEach((eachCartItem)=>{
            console.log(eachCartItem);
            totalCost+=parseInt(eachCartItem.orderQuantity)*parseFloat(eachCartItem.itemPrice);
        });
        setTotalOrderCost(totalCost);
  },[cartItems]);

  return (
    <div>
      <MainNavbar/>
      <div className="container cart-heading">
        <h1>Your Cart</h1>
      </div>
      {cartItems && cartItems.length && cartItems.map((eachCartItem,index)=>{  
        return <CartItem index={index} invalidOrder={invalidOrder} setInvalidOrder={setInvalidOrder} currency={currency} key={eachCartItem.cartId} cartItems={cartItems} setCartItems={setCartItems} item={eachCartItem}/>
      })}
       <div className="container">
            <Button className="cart_order-btn" onClick={placeOrder} disabled={!canPlaceOrder}>Place Order</Button>
            <span className="cart-cost">{"Total Cost: "+(currency && currency.name)+" "+totalOrderCost}</span>
            {orderPlaceErrorMsg && <div className="addcart-error">{orderPlaceErrorMsg}</div>}
       </div>
       <MainFooter currency={currency} setCurrency={setCurrency}/>
    </div>
  )
}

export default Cart