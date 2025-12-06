import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./slice/clientSlice";
import hotelReducer from "./slice/hotelSlice";
import roomReducer from "./slice/roomSlice";
import reservationReducer from "./slice/reservationSlice";

const store = configureStore({
    reducer: {
        clients: clientReducer,
        hotels: hotelReducer,
        rooms: roomReducer,
        reservations: reservationReducer,
    },
});

export default store;