import React,{useState, useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCamera} from "@fortawesome/free-solid-svg-icons";
import EditItem from './EditItem';
import config from '../config/config';
import {useNavigate} from "react-router-dom";
import {Card} from 'react-bootstrap';
import '../styles/shopitem.css';
import 'bootstrap/dist/css/bootstrap.css';

const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";

const Item = ({index,items,setItems,currency,editRights}) => {
  
    const [editMode,setEditMode] = useState(false);
    const [displayPicture,setDisplayPicture] = useState(items[index].displaypicture);
    const [name,setName] = useState(items[index].name);
    const [category,setCategory] = useState(items[index].category);
    const [price,setPrice] = useState(items[index].price);
    const [quantity,setQuantity] = useState(items[index].quantity);
    const [salesCount,setSalesCount] = useState(items[index].salescount);
    const [description,setDescription] = useState(items[index].description);
    const navigate = useNavigate();
    

    const viewItemOverview = ()=>{
        if(items[index]?.id) {
             navigate("/item/overview/"+items[index].id);
        }
    }

    return (
        <>
            <Card className="shopitem_card">
                <Card.Img variant="top" className="shopitem_picture" src={GET_ITEM_DISPLAY_PIC_API+displayPicture} />
                <Card.Body>
                    <Card.Title>
                        <div className="row">
                            <div className="col-md-8"><span className="shopitem_name">{name}</span></div>
                            {editRights && <EditItem currency={currency} id={items[index].id} items={items} setItems={setItems} index={index} displayPicture={displayPicture} setDisplayPicture={setDisplayPicture} name={name} setName={setName} category={category} setCategory={setCategory} price={price} setPrice={setPrice} quantity={quantity} setQuantity={setQuantity} salesCount={salesCount} setSalesCount={setSalesCount} description={description} setDescription={setDescription}/>}
                        </div>
                    </Card.Title>
                    <Card.Text>
                        <div className="shopitem_price">{(currency && currency.name)+" "+price}</div>
                        <div className="shopitem_description">{description}</div>
                        <div className="shopitem_sales_count">{salesCount+" pieces sold till now!"}</div>
                    </Card.Text>
                </Card.Body>
            </Card>            
        </>
    )
}

export default Item