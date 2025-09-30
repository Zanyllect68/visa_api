"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const cardService_1 = require("../services/cardService");
class ClientController {
    static registerClient(req, res) {
        try {
            const clientData = req.body;
            // Validate input
            if (!clientData.name || !clientData.country || !clientData.cardType ||
                typeof clientData.monthlyIncome !== 'number' || typeof clientData.viseClub !== 'boolean') {
                res.status(400).json({
                    status: 'Rejected',
                    error: 'Datos incompletos'
                });
                return;
            }
            // Check card eligibility
            const eligibility = cardService_1.CardService.validateCardEligibility(clientData);
            if (!eligibility.isValid) {
                res.status(400).json({
                    status: 'Rejected',
                    error: eligibility.error
                });
                return;
            }
            // Register client
            const newClient = {
                clientId: this.nextId++,
                ...clientData
            };
            this.clients.push(newClient);
            const response = {
                clientId: newClient.clientId,
                name: newClient.name,
                cardType: newClient.cardType,
                status: 'Registered',
                message: `Cliente apto para tarjeta ${newClient.cardType}`
            };
            res.status(201).json(response);
        }
        catch (error) {
            res.status(500).json({
                status: 'Rejected',
                error: 'Error interno del servidor'
            });
        }
    }
    static getClient(clientId) {
        return this.clients.find(client => client.clientId === clientId);
    }
}
exports.ClientController = ClientController;
ClientController.clients = [];
ClientController.nextId = 1;
