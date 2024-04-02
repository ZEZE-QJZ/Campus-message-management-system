import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { CollapsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['LoadingReducer']
};

const reducer = combineReducers({
  CollapsedReducer,
  LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)


let store = createStore(persistedReducer)
let persistor = persistStore(store)
export {
  store,
  persistor
}
