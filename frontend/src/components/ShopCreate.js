import React,{useState, useEffect} from 'react';
import {InputGroup, FormControl, Button, Navbar, Container} from 'react-bootstrap';
import {axiosInstance as authapi} from '../services/authpost';
import {useNavigate} from "react-router-dom";
import '../styles/shopcreate.css';
import 'bootstrap/dist/css/bootstrap.css';

const SHOP_NAME_AVAIL_API = "api/shop/name";
const SHOP_CREATE_API = "api/shop/create";
const SHOP_HOME_PAGE = "/shop/home/";

const CreateShop = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [shopAvailable, setShopNameAvailable] = useState(false);
  const [canShowAvailResult, setCanShowAvailResult] = useState(false);
  const [creatingShop, setCreatingShop] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setCanShowAvailResult(false);
  },[shopName]);

  const checkShopNameAvailable = async ()=>{
    if(shopName){
      const reqBody = {};
      reqBody.shopName = shopName;
      try{
        const response = await authapi.post(SHOP_NAME_AVAIL_API,reqBody);
        if(response && response.data){
          if(response.data.shopFound){
            setShopNameAvailable(false);
            setCanShowAvailResult(true);
          }else{
            setShopNameAvailable(true);
            setCanShowAvailResult(true);
          }
        }else{
          console.log("Some unexpected error!");
        }
      }catch(err){
        if(err && err.response && err.response.data && err.response.data.error){
          console.log(err.response.data.error);
        }
      }
    }
  }
    
  const createShop = async()=>{
    if(shopName){
      setCreatingShop(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const reqBody = {};
      reqBody.user = user.id;
      reqBody.shopName = shopName;
      try{
        const response = await authapi.post(SHOP_CREATE_API,reqBody);
        if(response && response.data && response.data.success){
          console.log(response.data)
          setCreatingShop(false);
          navigate(SHOP_HOME_PAGE+response.data.shopId);
        }else{
          console.log("Some unexpected error!");
          setCreatingShop(false);
        }
      }catch(err){
        if(err && err.response && err.response.data && err.response.data.error){
          setErrorMsg(err.response.data.error);
        }
        setCreatingShop(false);
      }
    }
  }
    
  return (
    <div>
      <Navbar bg="light" expand="lg">
          <Container>
              <Navbar.Brand className="shopcreate-mainnavbar-title" href="/home">Etsy</Navbar.Brand>
          </Container>
      </Navbar>
      <div class="create-shop-title">Name your Shop</div>
      <div class="create-shop-subtitle">Choose a memorable name that reflects your style</div>
        <div className="shop-create-name">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Shop Name" onChange={(e)=>{setShopName(e.target.value)}}
              />
            <Button onClick={checkShopNameAvailable} variant="outline-secondary" id="button-addon2">
              Check Availability
            </Button>
          </InputGroup>
        </div>
      <div className="create-shop-note">Your shop name will appear in tour shop and next to each of your listings throughout Etsy.</div>
        {canShowAvailResult && shopAvailable &&
            <div className="create-shop-avl">
              <div className="shopcreate-success">Available!</div>
              <div><Button onClick={createShop} variant="outline-secondary" id="button-addon2">Create Shop</Button></div>
            </div>
        }
      {canShowAvailResult && !shopAvailable &&
         <div className="create-shop-notavl">
          <div className="shopcreate-error">Not Available! Please choose a different name.</div>
        </div>
      }
    </div>
  )
}

export default CreateShop