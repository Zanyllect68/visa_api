"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const types_1 = require("../types");
const cardService_1 = require("../services/cardService");
class ClientController {
    static registerClient(req, res) {
        try {
            const body = req.body;
            // Validate input exists
            if (!body.name || !body.country || !body.cardType ||
                typeof body.monthlyIncome !== 'number' ||
                typeof body.viseClub !== 'boolean') {
                res.status(400).json({
                    status: 'Rejected',
                    error: 'Datos incompletos'
                });
                return;
            }
            // Map cardType string to CardType enum
            let cardType;
            const cardTypeStr = String(body.cardType);
            switch (cardTypeStr) {
                case 'Classic':
                    cardType = types_1.CardType.CLASSIC;
                    break;
                case 'Gold':
                    cardType = types_1.CardType.GOLD;
                    break;
                case 'Platinum':
                    cardType = types_1.CardType.PLATINUM;
                    break;
                case 'Black':
                    cardType = types_1.CardType.BLACK;
                    break;
                case 'White':
                    cardType = types_1.CardType.WHITE;
                    break;
                default:
                    res.status(400).json({
                        status: 'Rejected',
                        error: 'Tipo de tarjeta no válido'
                    });
                    return;
            }
            const clientData = {
                name: body.name,
                country: body.country,
                monthlyIncome: body.monthlyIncome,
                viseClub: body.viseClub,
                cardType: cardType
            };
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
            res.status(200).json(response); // Changed from 201 to 200
        }
        catch (error) {
            console.error('Error in registerClient:', error);
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
