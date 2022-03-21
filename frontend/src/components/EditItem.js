import React,{useState, useEffect} from 'react';
import {InputGroup, Collapse, Button, Modal, Form} from 'react-bootstrap';
import {axiosInstance as authapi} from '../services/authpost';
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCamera } from "@fortawesome/free-solid-svg-icons";
import config from '../config/config';
import '../styles/editshopitem.css';
import 'bootstrap/dist/css/bootstrap.css';

const GET_CATEGORIES_API = "/api/category/";
const EDIT_ITEM_API = "/api/item/edit";
const ADD_CATEGORY_API = "/api/category/add";
const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";
const UPLOAD_ITEM_DISPLAY_PIC_API = "api/item/display-picture/upload";


const EditItem = ({items,setItems,index,id,name,setName,displayPicture,setDisplayPicture,category,setCategory,description,setDescription,price,setPrice,quantity,setQuantity,currency}) => {
    const navigate = useNavigate();
    const [categories,setCategories] = useState([]);
    const [gettingCategories,setGettingCategories] = useState([]);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [editingItem, setEditingItem] = useState(false);
    const [newCategory,setNewCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);

    
    const getCategories = async ({id}) => {
        setGettingCategories(true);
        try{
            const response = await authapi.get(GET_CATEGORIES_API+id);
            if(response && response.data && response.data.success && response.data.categories){
                setCategories(response.data.categories);
                setGettingCategories(false);
            }else{
                setError("Some unexpected error occurred!");
                setGettingCategories(false);
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setGettingCategories(false);
        }
    }

    

    const handleClose = () => setShow(false);

    const handleShow = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        getCategories(user);
        setShow(true);
    };

    const editItem = async ()=>{
        setEditingItem(true);
        const item = {};
        item.displayPicture = displayPicture;
        item.name = name;
        item.price = price;
        item.quantity = quantity;
        item.category = category;
        item.description = description;
        item.id=id;
        items[index] = item;
        setItems(items);
        try{
            const response = await authapi.post(EDIT_ITEM_API,item);
            if(response && response.data && response.data.success){
                setEditingItem(false);
                handleClose();
            }else{
                setError("Some unexpected error occurred!");
                setEditingItem(false);
            }
        }catch(e){
            setEditingItem(false);
        }
        handleClose();
    }

    const addCategory = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.name = newCategory;
        data.userId = user.id;
        try{
            const response = await authapi.post(ADD_CATEGORY_API,data);
            if(response && response.data && response.data.success){
                setCategories([...categories,{name:data.name,id: response.data.addedCategory.insertId}]);
                setNewCategory("");
                setNewCategory("");
            }else{
                setError("Some unexpected error occurred!");
                setNewCategory("");
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setNewCategory("");
        }
    }

    const itemDisplayPictureSelected = async (event) => {
        let formData = new FormData();
        const image = event.target.files[0];
        formData.append("image", image);
        formData.append("itemId",id);
        try{
            const response = await authapi.post(UPLOAD_ITEM_DISPLAY_PIC_API, formData, { headers: {'Content-Type': 'multipart/form-data'}});
            if(response && response.data && response.data.imageKey){
                setDisplayPicture(response.data.imageKey);
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
            getCategories(user);
        }
    },[]);

  return (
    <>
      <FontAwesomeIcon className="edit_icon" icon={faPen} onClick={handleShow}/>
      <Modal show={show && !gettingCategories} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <div className="col-md-12">
                    <div><img src={GET_ITEM_DISPLAY_PIC_API+displayPicture} className="view_profile_picture"></img></div>
                    <div>
                        <label className="viewprofile-editimg"htmlFor="profile-pic"><FontAwesomeIcon icon={faCamera}/></label>
                        <input data-testid="profile-pic" onChange={itemDisplayPictureSelected} style={{display: "none"}} id="profile-pic" type="file"></input>
                    </div>
                </div>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={(e)=>{setName(e.target.value)}} value={name} type="text" placeholder="Name" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Price {"("+currency.name+")"}</Form.Label>
                    <Form.Control onChange={(e)=>{setPrice(e.target.value)}} value={price} type="number" placeholder="Price" />
                </Form.Group>
                <Form.Group  className="mb-3" >
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control onChange={(e)=>{setQuantity(e.target.value)}} value={quantity} type="number" placeholder="Quantity" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" id="category" value={category} onChange={(e)=>{setCategory(e.target.value)}}>
                        <option value="">Select Category</option>
                        {
                            categories.map((eachCategory,index)=>{
                                return <option key={index} value={eachCategory.id}>{eachCategory.name}</option>
                            })
                        }
                    </Form.Select>
                    <span className="additem-category-collapse" onClick={() => setCategoryOpen(!categoryOpen)} aria-controls="example-collapse-text" aria-expanded={categoryOpen}>
                        Add a new category
                    </span>
                    <Collapse in={categoryOpen}>
                        <Form.Group size="sm" className="mb-3">
                            <Form.Control size="sm" value={newCategory} onChange={(e)=>{setNewCategory(e.target.value)}} type="text" placeholder="Enter category name" />
                            <Button className="add-category-btn" size="sm" variant="secondary" onClick={addCategory}>Add</Button>
                        </Form.Group>
                    </Collapse>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control onChange={(e)=>{setDescription(e.target.value)}} value={description}  as="textarea" placeholder="Description" />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editItem}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditItem;