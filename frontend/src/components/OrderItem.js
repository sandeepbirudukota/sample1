import React,{useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import config from '../config/config';
import '../styles/orderitem.css';

const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";


const OrderItem = ({item, currency}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if(!token || !user){
            navigate("/login", {replace:true});
        }
    });

    return (
        <div>
            <div className="container orderitem-container">
                <div className="row">
                    <div className="col-md-5">
                        <div><img src={GET_ITEM_DISPLAY_PIC_API+item.displayPicture} className="orderitem_display_picture"></img></div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <span className="overview-name">{item.name}</span>
                        </div>
                        <div>{"Price: "+currency.name+" "+item.price*item.orderQuantity+" ("+currency.name+" "+item.price+" per piece)"}</div>
                        <div>{"Shop Name: "+item.shopName}</div>
                        <div>{"Quantity: "+item.orderQuantity}</div>
                        <div>{"Date: "+item.date}</div>
                        <div className="homeitem_sales_count">{item.orderId}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItem