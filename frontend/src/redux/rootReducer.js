import { ADD_USER } from "./action-types/action-types";
import { REMOVE_USER } from "./action-types/action-types";

const initialState = {
  user: {},
};
function rootReducer(state = initialState, action) {
    if (action.type === ADD_USER) {
      console.log("adding user");
      return Object.assign({}, state, {
        user: action.payload
      });
    }
    if(action.type===REMOVE_USER){
      console.log("removing user");
      return Object.assign({}, state, {
        user: {}
      }); 
    }
    return state;
  }
  
export default rootReducer;