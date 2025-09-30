"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
const cardService_1 = require("../services/cardService");
const clientController_1 = require("./clientController");
class PurchaseController {
    static processPurchase(req, res) {
        try {
            const purchaseData = req.body;
            // Validate input
            if (!purchaseData.clientId || !purchaseData.amount || !purchaseData.currency ||
                !purchaseData.purchaseDate || !purchaseData.purchaseCountry) {
                res.status(400).json({
                    status: 'Rejected',
                    error: 'Datos de compra incompletos'
                });
                return;
            }
            // Find client
            const client = clientController_1.ClientController.getClient(purchaseData.clientId);
            if (!client) {
                res.status(404).json({
                    status: 'Rejected',
                    error: 'Cliente no encontrado'
                });
                return;
            }
            // Check purchase restrictions
            const restrictionCheck = cardService_1.CardService.validatePurchaseRestrictions(client, purchaseData);
            if (!restrictionCheck.isValid) {
                res.status(403).json({
                    status: 'Rejected',
                    error: restrictionCheck.error
                });
                return;
            }
            // Calculate discount
            const { discount, benefit } = cardService_1.CardService.calculateDiscount(client, purchaseData);
            const discountAmount = purchaseData.amount * discount;
            const finalAmount = purchaseData.amount - discountAmount;
            const response = {
                status: 'Approved',
                purchase: {
                    clientId: purchaseData.clientId,
                    originalAmount: purchaseData.amount,
                    discountApplied: Math.round(discountAmount * 100) / 100,
                    finalAmount: Math.round(finalAmount * 100) / 100,
                    benefit
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({
                status: 'Rejected',
                error: 'Error interno del servidor'
            });
        }
    }
}
exports.PurchaseController = PurchaseController;
