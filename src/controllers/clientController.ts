import { Request, Response } from 'express';
import { ClientRequest, ClientResponse, Client } from '../types';
import { CardService } from '../services/cardService';

export class ClientController {
  private static clients: Client[] = [];
  private static nextId = 1;

  static registerClient(req: Request, res: Response): void {
    try {
      const clientData: ClientRequest = req.body;
      
      // Validate input
      if (!clientData.name || !clientData.country || !clientData.cardType || 
          typeof clientData.monthlyIncome !== 'number' || typeof clientData.viseClub !== 'boolean') {
        res.status(400).json({
          status: 'Rejected',
          error: 'Datos incompletos'
        } as ClientResponse);
        return;
      }

      // Check card eligibility
      const eligibility = CardService.validateCardEligibility(clientData);
      
      if (!eligibility.isValid) {
        res.status(400).json({
          status: 'Rejected',
          error: eligibility.error
        } as ClientResponse);
        return;
      }

      // Register client
      const newClient: Client = {
        clientId: this.nextId++,
        ...clientData
      };

      this.clients.push(newClient);

      const response: ClientResponse = {
        clientId: newClient.clientId,
        name: newClient.name,
        cardType: newClient.cardType,
        status: 'Registered',
        message: `Cliente apto para tarjeta ${newClient.cardType}`
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        status: 'Rejected',
        error: 'Error interno del servidor'
      } as ClientResponse);
    }
  }

  static getClient(clientId: number): Client | undefined {
    return this.clients.find(client => client.clientId === clientId);
  }
}
