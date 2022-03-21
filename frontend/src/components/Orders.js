import React,{useState,useEffect} from 'react'
import OrderItem from './OrderItem';
import {useNavigate} from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';
import MainFooter from './MainFooter';
import MainNavbar from './MainNavbar';
import '../styles/orders.css';


const ORDER_ITEMS_API = "/api/order/get/";
const LOGIN_PAGE = "/login";
const GET_USER_CURRENCY_API = "api/currency/";

const Orders = () => {
  const navigate = useNavigate();
  const [orderItems,setOrderItems] = useState();
  const [currency,setCurrency] = useState({});


  const getOrderItems = async ()=>{
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate(LOGIN_PAGE, {replace:true});
      }else{
          try{
              const response = await authapi.get(ORDER_ITEMS_API+user.id);
              if(response && response.data){
                  if(response.data.success){
                      if(response.data.items){
                          console.log(response.data.items);
                          setOrderItems(response.data.items);
                      }else{
                          setOrderItems([]);
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

  useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate("/login", {replace:true});
      }else{
          getOrderItems();
          getUserCurrency(user);
      }
  },[]);

  return (
    <div>
      <MainNavbar/>
      <div className="container cart-heading">
        <h1>Your Orders</h1>
      </div>
      {orderItems && orderItems.length && orderItems.map((eachOrderItem)=>{
        return <OrderItem currency={currency} key={eachOrderItem.id} item={eachOrderItem}/>
      })}
       <MainFooter currency={currency} setCurrency={setCurrency}/>
    </div>
  )
}

export default Orders