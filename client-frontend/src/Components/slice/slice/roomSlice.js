import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CLIENTAPI = "http://localhost:5000/api/room";

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
    const response = await axios.get(CLIENTAPI);
    return response.data;
});

export const addRoom = createAsyncThunk("rooms/addRoom", async (roomData) => {
    const response = await axios.post(CLIENTAPI, roomData);
    return response.data;
});

export const fetchRoomById = createAsyncThunk("rooms/fetchRoomById", async (roomId) => {
    const response = await axios.get(`${CLIENTAPI}/${roomId}`);
    return response.data;
});

export const fetchRoomsByHotelId = createAsyncThunk("rooms/fetchRoomsByHotelId", async (hotelId) => {
    const response = await axios.get(`${CLIENTAPI}/hotel/${hotelId}`);
    return response.data;
});

export const updateRoom = createAsyncThunk("rooms/updateRoom", async ({ roomId, updatedData }) => {
    const response = await axios.put(`${CLIENTAPI}/${roomId}`, updatedData);
    return response.data;
});

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (roomId) => {
    const response = await axios.delete(`${CLIENTAPI}/${roomId}`);
    return response.data;
});

const roomSlice = createSlice({
    name: "rooms",
    initialState: {
        rooms: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchRooms
            .addCase(fetchRooms.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.rooms = action.payload;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // addRoom
            .addCase(addRoom.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.rooms.push(action.payload);
            })
            .addCase(addRoom.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchRoomById
            .addCase(fetchRoomById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchRoomById.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.rooms.findIndex(
                    (r) => r._id === action.payload._id || r.id === action.payload.id
                );
                if (idx !== -1) {
                    state.rooms[idx] = action.payload;
                } else {
                    state.rooms.push(action.payload);
                }
            })
            .addCase(fetchRoomById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchRoomsByHotelId
            .addCase(fetchRoomsByHotelId.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchRoomsByHotelId.fulfilled, (state, action) => {
                state.status = "succeeded";
                const byId = new Map(state.rooms.map((r) => [r._id || r.id, r]));
                for (const r of action.payload) {
                    byId.set(r._id || r.id, r);
                }
                state.rooms = Array.from(byId.values());
            })
            .addCase(fetchRoomsByHotelId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // updateRoom
            .addCase(updateRoom.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.rooms.findIndex(
                    (r) => r._id === action.payload._id || r.id === action.payload.id
                );
                if (idx !== -1) {
                    state.rooms[idx] = action.payload;
                }
            })
            .addCase(updateRoom.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // deleteRoom
            .addCase(deleteRoom.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.payload?.id || action.meta.arg;
                state.rooms = state.rooms.filter(
                    (r) => r._id !== deletedId && r.id !== deletedId
                );
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default roomSlice.reducer;