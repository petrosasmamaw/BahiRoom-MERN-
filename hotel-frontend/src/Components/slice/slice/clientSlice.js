import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CLIENTAPI = "https://bahiroom-backend.onrender.com/api/client";

export const fetchClients = createAsyncThunk("clients/fetchClients", async () => {
    const response = await axios.get(CLIENTAPI);
    return response.data;
});

export const addClient = createAsyncThunk("clients/addClient", async (clientData) => {
    const response = await axios.post(CLIENTAPI, clientData);
    return response.data;
});

export const fetchClientById = createAsyncThunk("clients/fetchClientById", async (clientId) => {
    const response = await axios.get(`${CLIENTAPI}/${clientId}`);
    return response.data;
});

export const updateClient = createAsyncThunk("clients/updateClient", async ({ clientId, updatedData }) => {
    const response = await axios.put(`${CLIENTAPI}/${clientId}`, updatedData);
    return response.data;
});

export const deleteClient = createAsyncThunk("clients/deleteClient", async (clientId) => {
    const response = await axios.delete(`${CLIENTAPI}/${clientId}`);
    return response.data;
});

const clientSlice = createSlice({
    name: "clients",
    initialState: {
        clients: [],
        status: "idle",
        error: null 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // addClient
            .addCase(addClient.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.clients.push(action.payload);
            })
            .addCase(addClient.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // fetchClientById
            .addCase(fetchClientById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchClientById.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.clients.findIndex((c) => c._id === action.payload._id || c.id === action.payload.id);
                if (idx !== -1) {
                    state.clients[idx] = action.payload;
                } else {
                    state.clients.push(action.payload);
                }
            })
            .addCase(fetchClientById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // updateClient
            .addCase(updateClient.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.status = "succeeded";
                const idx = state.clients.findIndex((c) => c._id === action.payload._id || c.id === action.payload.id);
                if (idx !== -1) {
                    state.clients[idx] = action.payload;
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // deleteClient
            .addCase(deleteClient.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.payload?.id || action.meta.arg;
                state.clients = state.clients.filter((c) => c._id !== deletedId && c.id !== deletedId);
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default clientSlice.reducer;