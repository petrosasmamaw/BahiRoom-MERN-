import Client from '../models/Client.js';

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createClient = async (req, res) => {
    const { name, userId, idCard, phone, status } = req.body;
    const image = req.file?.path; // multer + cloudinary path

    const newClient = new Client({ name, userId, idCard, phone, status, image });

    try {
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const updatedFields = req.body;
        if (req.file?.path) updatedFields.image = req.file.path;

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        if (!updatedClient) return res.status(404).json({ message: "Client not found" });
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
