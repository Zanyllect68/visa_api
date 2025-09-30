import { Request, Response } from 'express';
import { PurchaseRequest, PurchaseResponse } from '../types';
import { CardService } from '../services/cardService';
import { ClientController } from './clientController';

export class PurchaseController {
  static processPurchase(req: Request, res: Response): void {
    try {
      const purchaseData: PurchaseRequest = req.body;

      // Validate input
      if (!purchaseData.clientId || !purchaseData.amount || !purchaseData.currency || 
          !purchaseData.purchaseDate || !purchaseData.purchaseCountry) {
        res.status(400).json({
          status: 'Rejected',
          error: 'Datos de compra incompletos'
        } as PurchaseResponse);
        return;
      }

      // Find client
      const client = ClientController.getClient(purchaseData.clientId);
      if (!client) {
        res.status(404).json({
          status: 'Rejected',
          error: 'Cliente no encontrado'
        } as PurchaseResponse);
        return;
      }

      // Check purchase restrictions
      const restrictionCheck = CardService.validatePurchaseRestrictions(client, purchaseData);
      if (!restrictionCheck.isValid) {
        res.status(403).json({
          status: 'Rejected',
          error: restrictionCheck.error
        } as PurchaseResponse);
        return;
      }

      // Calculate discount
      const { discount, benefit } = CardService.calculateDiscount(client, purchaseData);
      const discountAmount = purchaseData.amount * discount;
      const finalAmount = purchaseData.amount - discountAmount;

      const response: PurchaseResponse = {
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
    } catch (error) {
      res.status(500).json({
        status: 'Rejected',
        error: 'Error interno del servidor'
      } as PurchaseResponse);
    }
  }
}
