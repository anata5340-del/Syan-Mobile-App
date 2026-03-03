import { combineReducers } from 'redux';
import drawerReducer from './drawarReducer';


const rootReducer = combineReducers({
    drawer: drawerReducer,
});

export default rootReducer;


