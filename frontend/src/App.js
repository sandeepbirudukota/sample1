import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Route, Routes} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import ShopCreate from './components/ShopCreate';
import ShopHome from './components/ShopHome';
import ItemOverview from './components/ItemOverview';
import Cart from './components/Cart';
import Orders from './components/Orders';


function App() {
  return (
    <Routes>
        <Route exact path="register" element={<Register/>} />
        <Route exact path="login" element={<Login/>} />
        <Route exact path="home" element={<Home/>}/>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="view-profile" element={<ViewProfile/>}/>
        <Route exact path="edit-profile" element={<EditProfile/>}/>
        <Route exact path="shop/create" element={<ShopCreate/>}/>
        <Route exact path="shop/home/:shopId" element={<ShopHome/>}/>
        <Route exact path="item/overview/:id" element={<ItemOverview/>}/>
        <Route exact path="cart" element={<Cart/>}/>
        <Route exact path="orders" element={<Orders/>}/>
    </Routes>
  );
}

export default App;
