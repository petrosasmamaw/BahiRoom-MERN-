import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CLIENTAPI = "https://bahiroom-backend.onrender.com/api/client";

export const fetchClients = createAsyncThunk("clients/fetchClients", async () => {
    const response = await axios.get(CLIENTAPI);
    return response.data;
});

export const addClient = createAsyncThunk("clients/addClient", async (clientData) => {
    // if there's an imageFile (File object), send as FormData so backend upload middleware can parse it
    if (clientData.imageFile) {
        const fd = new FormData();
        fd.append('name', clientData.name || '');
        fd.append('userId', clientData.userId || '');
        fd.append('idCardNo', clientData.idCardNo || clientData.idCard || '');
        fd.append('phone', clientData.phone || '');
        if (clientData.status) fd.append('status', clientData.status);
        fd.append('image', clientData.imageFile);
        const response = await axios.post(CLIENTAPI, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    }
    const { imageFile, ...payload } = clientData;
    const response = await axios.post(CLIENTAPI, payload);
    return response.data;
});

export const fetchClientById = createAsyncThunk("clients/fetchClientById", async (clientId) => {
    // fetch by userId (owner id). backend provides /user/:userId route
    const response = await axios.get(`${CLIENTAPI}/user/${clientId}`);
    return response.data;
});

export const updateClient = createAsyncThunk("clients/updateClient", async ({ clientId, updatedData }) => {
    if (updatedData.imageFile) {
        const fd = new FormData();
        if (updatedData.name) fd.append('name', updatedData.name);
        if (updatedData.userId) fd.append('userId', updatedData.userId);
        if (updatedData.idCardNo) fd.append('idCardNo', updatedData.idCardNo);
        if (updatedData.phone) fd.append('phone', updatedData.phone);
        if (updatedData.status) fd.append('status', updatedData.status);
        fd.append('image', updatedData.imageFile);
        const response = await axios.put(`${CLIENTAPI}/${clientId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    }
    const { imageFile, ...payload } = updatedData;
    const response = await axios.put(`${CLIENTAPI}/${clientId}`, payload);
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