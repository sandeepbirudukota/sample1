import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';
import { Form, Button } from 'react-bootstrap';
import config from '../config/config';
import '../styles/cartitem.css';

const REMOVE_ITEM_CART_API = "/api/cart/delete";
const UPDATE_ITEM_QUANTITY_CART_API = "/api/cart/item/quantity";
const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";


const CartItem = ({index, invalidOrder,setInvalidOrder, item, cartItems, setCartItems,currency }) => {
    const navigate = useNavigate();
    const [orderQuantity, setOrderQuantity] = useState(item.orderQuantity);
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (!token || !user) {
            navigate("/login", { replace: true });
        }
    });

    useEffect(async () => {
        if (orderQuantity) {
            if((item.itemQuantity-item.itemSalesCount)<orderQuantity){
                let invalidOrderCopy = JSON.parse(JSON.stringify(invalidOrder));
                invalidOrderCopy[index] = true;
                setInvalidOrder(invalidOrderCopy);
            }else{
                let invalidOrderCopy = JSON.parse(JSON.stringify(invalidOrder));
                invalidOrderCopy[index] = false;
                setInvalidOrder(invalidOrderCopy);
                item.orderQuantity = orderQuantity;
                try {
                    const user = JSON.parse(localStorage.getItem("user"));
                    const data = {};
                    data.cartId = item.cartId;
                    data.userId = user.id;
                    data.itemId = item.itemId;
                    data.orderQuantity = orderQuantity;
                    const response = await authapi.post(UPDATE_ITEM_QUANTITY_CART_API, data);
                    if (response && response.data && response.data.success) {
                        cartItems.forEach((eachCartItem) => {
                            if(eachCartItem.cartId == item.cartId){
                                eachCartItem.orderQuantity = item.orderQuantity;  
                            }
                        });
                        setCartItems([...cartItems]);
                    } else {
                        console.log("Error updating quantity");
                    }
                } catch (e) {

                }
            }
        }
    }, [orderQuantity]);

    const removeItem = async () => {
        const data = {};
        data.id = item.cartId;
        try {
            const response = await authapi.post(REMOVE_ITEM_CART_API, data);
            if (response && response.data) {
                if (response.data.success) {
                    const filteredCartItems = cartItems.filter((eachCartItem) => {
                        return eachCartItem.cartId != item.cartId;
                    });
                    setCartItems(filteredCartItems);
                } else {
                    console.log("Error removing item");
                }
            } else {
                console.log(response);
            }
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.error) {
                console.log(err.response.data.error);
            }
        }
    }
    return (
        <div>
            <div className="container cartitem-container">
                <div className="row">
                    <div className="col-md-5">
                        <div><img src={GET_ITEM_DISPLAY_PIC_API+item.itemDisplayPicture} className="cartitem_display_picture"></img></div>
                    </div>
                    <div className="mrgn-tp col-md-4">
                        <div>
                            <span className="overview-name">{item.itemName}</span>
                        </div>
                        <div>{item.itemCategory}</div>
                        <div>{(currency && currency.name)+" "+item.itemPrice}</div>
                        <div>{item.itemDescription}</div>
                        <div className="homeitem_sales_count">{(item.itemQuantity-item.itemSalesCount)+" pieces available!"}</div>
                        <div className="homeitem_sales_count">{item.itemSalesCount+" pieces sold till now!"}</div>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="quantity">Quantity</Form.Label>
                        <Form.Control value={orderQuantity} onChange={(e) => { setOrderQuantity(e.target.value) }} type="number" id="quantity" />
                        {(item.itemQuantity-item.itemSalesCount)<orderQuantity && <div className="mrgn-tp addcart-error">Out of Stock!</div>}
                    </Form.Group>
                    <Button className="cartitem_remove-btn" onClick={removeItem}>
                        Delete
                    </Button>
                        <span className="cartitem-cost">{"Cost: "+(currency && currency.name)+" "+item.itemPrice*orderQuantity}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem