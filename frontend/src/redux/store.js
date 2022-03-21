import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./rootReducer.js";
import { composeWithDevTools } from "redux-devtools-extension";
    
    const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
      rootReducer,
      composeWithDevTools()
    );
    export default store;