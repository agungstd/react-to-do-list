import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { reduxBatch } from "@manaflair/redux-batch";
import { persistStore } from "redux-persist";
import rootSaga from "../sagas/rootSaga";
import { rootReducer } from "./rootReducer";

const sagaMiddleware = createSagaMiddleware();

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
}).concat(sagaMiddleware);

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
  enhancers: [reduxBatch],
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
