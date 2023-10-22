import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userSlice from "./user/userSlice"
import storage from "redux-persist/lib/storage"
import {persistReducer,persistStore} from "redux-persist"
const rootReducer=combineReducers({user:userSlice})
const persistedReducer=persistReducer({key:'root',storage},rootReducer)
export const store=configureStore({
    reducer:persistedReducer
})

export const persistor=persistStore(store)