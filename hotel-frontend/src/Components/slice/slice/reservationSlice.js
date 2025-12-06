import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CLIENTAPI = "http://localhost:5001/api/reservation";

export const fetchReservations = createAsyncThunk("reservations/fetchReservations", async () => {
    const response = await axios.get(CLIENTAPI);
    return response.data;
});

export const addReservation = createAsyncThunk("reservations/addReservation", async (reservationData) => {
    const response = await axios.post(CLIENTAPI, reservationData);
    return response.data;
});
export const fetchReservationById = createAsyncThunk("reservations/fetchReservationById", async (reservationId) => {
    const response = await axios.get(`${CLIENTAPI}/${reservationId}`);
    return response.data;
});
export const fetchReservationsByClientId = createAsyncThunk("reservations/fetchReservationsByClientId", async (clientId) => {
    const response = await axios.get(`${CLIENTAPI}/client/${clientId}`);
    return response.data;
});
export const fetchReservationsByHotelId = createAsyncThunk("reservations/fetchReservationsByHotelId", async (hotelId) => {
    const response = await axios.get(`${CLIENTAPI}/hotel/${hotelId}`);
    return response.data;
});
export const updateReservation = createAsyncThunk("reservations/updateReservation", async ({ reservationId, updatedData }) => {
    const response = await axios.put(`${CLIENTAPI}/${reservationId}`, updatedData);
    return response.data;
});
export const deleteReservation = createAsyncThunk("reservations/deleteReservation", async (reservationId) => {
    const response = await axios.delete(`${CLIENTAPI}/${reservationId}`);
    return response.data;
});

const reservationSlice = createSlice({
    name: "reservations",
    initialState: {
        reservations: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchReservations
            .addCase(fetchReservations.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.reservations = action.payload;
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // addReservation
            .addCase(addReservation.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.reservations.push(action.payload);
            })
            .addCase(addReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchReservationById
            .addCase(fetchReservationById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReservationById.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.reservations.findIndex(
                    (r) => r._id === action.payload._id || r.id === action.payload.id
                );
                if (idx !== -1) {
                    state.reservations[idx] = action.payload;
                } else {
                    state.reservations.push(action.payload);
                }
            })
            .addCase(fetchReservationById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchReservationsByClientId
            .addCase(fetchReservationsByClientId.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReservationsByClientId.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Replace or merge: here we upsert list by removing those for same client and adding new
                // If backend returns full list for that client, simplest is to merge unique by id
                const byId = new Map(state.reservations.map((r) => [r._id || r.id, r]));
                for (const r of action.payload) {
                    byId.set(r._id || r.id, r);
                }
                state.reservations = Array.from(byId.values());
            })
            .addCase(fetchReservationsByClientId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchReservationsByHotelId
            .addCase(fetchReservationsByHotelId.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReservationsByHotelId.fulfilled, (state, action) => {
                state.status = "succeeded";
                const byId = new Map(state.reservations.map((r) => [r._id || r.id, r]));
                for (const r of action.payload) {
                    byId.set(r._id || r.id, r);
                }
                state.reservations = Array.from(byId.values());
            })
            .addCase(fetchReservationsByHotelId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // updateReservation
            .addCase(updateReservation.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.reservations.findIndex(
                    (r) => r._id === action.payload._id || r.id === action.payload.id
                );
                if (idx !== -1) {
                    state.reservations[idx] = action.payload;
                }
            })
            .addCase(updateReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // deleteReservation
            .addCase(deleteReservation.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.payload?.id || action.meta.arg;
                state.reservations = state.reservations.filter(
                    (r) => r._id !== deletedId && r.id !== deletedId
                );
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default reservationSlice.reducer;
