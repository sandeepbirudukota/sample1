import axios from 'axios';
import config from '../config/config';


const axiosInstance = axios.create({
    baseURL: config.baseUrl
});

axiosInstance.interceptors.request.use(
    function(request) {
        request.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return request;
    }, 
    
  ); 

export {axiosInstance};