import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CLIENTAPI = "http://localhost:5000/api/hotel";

export const fetchHotels = createAsyncThunk("hotels/fetchHotels", async () => {
    const response = await axios.get(CLIENTAPI);
    return response.data;
});

export const addHotel = createAsyncThunk("hotels/addHotel", async (hotelData) => {
    // if there's an imageFile (File object), send as FormData so backend upload middleware can parse it
    if (hotelData.imageFile) {
        const fd = new FormData();
        fd.append('name', hotelData.name || '');
        fd.append('userId', hotelData.userId || '');
        fd.append('address', hotelData.address || '');
        fd.append('phone', hotelData.phone || '');
        if (hotelData.status) fd.append('status', hotelData.status);
        fd.append('image', hotelData.imageFile);
        const response = await axios.post(CLIENTAPI, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
    // otherwise send JSON
    const { imageFile, ...payload } = hotelData;
    const response = await axios.post(CLIENTAPI, payload);
    return response.data;
});
export const fetchHotelById = createAsyncThunk("hotels/fetchHotelById", async (hotelId) => {
    // fetch by userId (owner id). backend provides /user/:userId route
    const response = await axios.get(`${CLIENTAPI}/user/${hotelId}`);
    return response.data;
});
export const updateHotel = createAsyncThunk("hotels/updateHotel", async ({ hotelId, updatedData }) => {
    // If updatedData contains an imageFile, send as FormData
    if (updatedData.imageFile) {
        const fd = new FormData();
        if (updatedData.name) fd.append('name', updatedData.name);
        if (updatedData.userId) fd.append('userId', updatedData.userId);
        if (updatedData.address) fd.append('address', updatedData.address);
        if (updatedData.phone) fd.append('phone', updatedData.phone);
        if (updatedData.status) fd.append('status', updatedData.status);
        fd.append('image', updatedData.imageFile);
        const response = await axios.put(`${CLIENTAPI}/${hotelId}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
    const { imageFile, ...payload } = updatedData;
    const response = await axios.put(`${CLIENTAPI}/${hotelId}`, payload);
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