import { configureStore } from "@reduxjs/toolkit";
import { middleware } from "../../server/socketIO/middleware";

export const store = configureStore({
    reducer: {},
    middleware: (getDefault) =>
        getDefault().concat(middleware),
});

export default store;