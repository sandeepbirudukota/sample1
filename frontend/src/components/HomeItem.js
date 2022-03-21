import React,{useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';
import { faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from '../config/config';
import {Card} from 'react-bootstrap';
import '../styles/homeitem.css';
import 'bootstrap/dist/css/bootstrap.css';

const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";
const REMOVE_FAVORITE_ITEM_API = "api/favoriteitem/remove";
const ADD_FAVORITE_ITEM_API = "api/favoriteitem/add";

const HomeItem = ({item,items,setItems,index,currency}) => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if(!token || !user){
            navigate("/login", {replace:true});
        }
    });

    const viewItemOverview = ({id})=>{
        if(id) {
             navigate("/item/overview/"+id);
        }
    }

    const removeFavoriteItem = async (event) => {
        event.stopPropagation();
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.itemId = item.id;
        data.userId = user.id;
        try{
            const response = await authapi.post(REMOVE_FAVORITE_ITEM_API,data);
            if(response && response.data){
                if(response.data.success){
                    if(response.data.removeItem){
                        const itemCopy = JSON.parse(JSON.stringify(item));
                        itemCopy.favorite = false;
                        items[index] = itemCopy;
                        const itemsCopy = JSON.parse(JSON.stringify(items));
                        setItems(itemsCopy);
                    }else{
                    console.log(response);
                    }
                }else{
                    console.log(response);
                }
            }else{
                console.log(response);
            }
        }catch(err){
            if(err && err.response && err.response.data && err.response.data.error){
                if(err.response.data.itemExists){
                    console.log(err.response.data.error);
                }
            }
        }
    }

    const addFavoriteItem = async (event)=>{
        event.stopPropagation();
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.itemId = item.id;
        data.userId = user.id;
        try{
            const response = await authapi.post(ADD_FAVORITE_ITEM_API,data);
            console.log(response)
            if(response && response.data){
                if(response.data.success){
                    if(response.data.favoriteItem){
                        const itemCopy = JSON.parse(JSON.stringify(item));
                        itemCopy.favorite = true;
                        items[index] = itemCopy;
                        const itemsCopy = JSON.parse(JSON.stringify(items));
                        setItems(itemsCopy);
                    }else{
                    console.log(response);
                    }
                }else{
                    console.log(response);
                }
            }else{
                console.log(response);
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            {item && <Card className="homeitem_card" onClick={()=>{viewItemOverview(item)}}>
                <Card.Img variant="top" className="homeitem_picture" src={GET_ITEM_DISPLAY_PIC_API+item.displaypicture} />
                <Card.Body>
                    <Card.Title>
                        <div className="row">
                            <div className="col-md-8"><span className="homeitem_name">{item.name}</span></div>
                            {!item.favorite && <div className="col-md-4 homeitem-favorite-icon"><FontAwesomeIcon onClick={addFavoriteItem} icon={faHeartRegular} color="red"/></div>}
                            {item.favorite && <div className="col-md-4 homeitem-favorite-icon"><FontAwesomeIcon onClick={removeFavoriteItem} icon={faHeartSolid} color="red"/></div>}
                        </div>
                    </Card.Title>
                    <Card.Text>
                        <div className="homeitem_price">{(currency && currency.name)+" "+item.price}</div>
                        <div className="homeitem_description">{item.description}</div>
                        <div className="homeitem_sales_count">{item.quantity-item.salescount+" pieces available!"}</div>
                        <div className="homeitem_sales_count">{item.salescount+" pieces sold till now!"}</div>
                    </Card.Text>
                </Card.Body>
            </Card>}            
        </>
    )
}

export default HomeItem