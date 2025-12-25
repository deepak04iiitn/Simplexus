import { configureStore , combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import campaignReducer from './campaign/campaignSlice';
import briefReducer from './brief/briefSlice';
import deliverableReducer from './deliverable/deliverableSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer= combineReducers({
    user : userReducer,
    campaign: campaignReducer,
    brief: briefReducer,
    deliverable: deliverableReducer,
})

const persistConfig = {
    key : 'root',
    storage,
    version : 1,
}

const persistedReducer = persistReducer(persistConfig , rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) => getDefaultMiddleware(
    { serializableCheck : false }
  )
})

export const persistor = persistStore(store);