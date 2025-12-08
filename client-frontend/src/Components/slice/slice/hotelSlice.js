import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CLIENTAPI = "http://localhost:5000/api/hotel";

export const fetchHotels = createAsyncThunk("hotels/fetchHotels", async () => {
    const response = await axios.get(CLIENTAPI);
    return response.data;
});

export const addHotel = createAsyncThunk("hotels/addHotel", async (hotelData) => {
    const response = await axios.post(CLIENTAPI, hotelData);
    return response.data;
});
export const fetchHotelById = createAsyncThunk("hotels/fetchHotelById", async (hotelId) => {
    const response = await axios.get(`${CLIENTAPI}/${hotelId}`);
    return response.data;
});
export const updateHotel = createAsyncThunk("hotels/updateHotel", async ({ hotelId, updatedData }) => {
    const response = await axios.put(`${CLIENTAPI}/${hotelId}`, updatedData);
    return response.data;
});

export const deleteHotel = createAsyncThunk("hotels/deleteHotel", async (hotelId) => {
    const response = await axios.delete(`${CLIENTAPI}/${hotelId}`);
    return response.data;
});
const hotelSlice = createSlice({
    name: "hotels",
    initialState: { 
        hotels: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchHotels
            .addCase(fetchHotels.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // addHotel
            .addCase(addHotel.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addHotel.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.hotels.push(action.payload);
            })
            .addCase(addHotel.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchHotelById
            .addCase(fetchHotelById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchHotelById.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.hotels.findIndex(
                    (h) => h._id === action.payload._id || h.id === action.payload.id
                );
                if (idx !== -1) {
                    state.hotels[idx] = action.payload;
                } else {
                    state.hotels.push(action.payload);
                }
            })
            .addCase(fetchHotelById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // updateHotel
            .addCase(updateHotel.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateHotel.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.hotels.findIndex(
                    (h) => h._id === action.payload._id || h.id === action.payload.id
                );
                if (idx !== -1) {
                    state.hotels[idx] = action.payload;
                }
            })
            .addCase(updateHotel.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // deleteHotel
            .addCase(deleteHotel.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteHotel.fulfilled, (state, action) => {
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.payload?.id || action.meta.arg;
                state.hotels = state.hotels.filter(
                    (h) => h._id !== deletedId && h.id !== deletedId
                );
            })
            .addCase(deleteHotel.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default hotelSlice.reducer;