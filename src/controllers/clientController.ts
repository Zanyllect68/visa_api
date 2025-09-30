import { Request, Response } from 'express';
import { ClientRequest, ClientResponse, Client, CardType } from '../types';
import { CardService } from '../services/cardService';

export class ClientController {
  private static clients: Client[] = [];
  private static nextId = 1;

  static registerClient(req: Request, res: Response): void {
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
      let cardType: CardType;
      const cardTypeStr = String(body.cardType);
      
      switch (cardTypeStr) {
        case 'Classic':
          cardType = CardType.CLASSIC;
          break;
        case 'Gold':
          cardType = CardType.GOLD;
          break;
        case 'Platinum':
          cardType = CardType.PLATINUM;
          break;
        case 'Black':
          cardType = CardType.BLACK;
          break;
        case 'White':
          cardType = CardType.WHITE;
          break;
        default:
          res.status(400).json({
            status: 'Rejected',
            error: 'Tipo de tarjeta no válido'
          });
          return;
      }

      const clientData: Omit<Client, 'clientId'> = {
        name: body.name,
        country: body.country,
        monthlyIncome: body.monthlyIncome,
        viseClub: body.viseClub,
        cardType: cardType
      };

      // Check card eligibility
      const eligibility = CardService.validateCardEligibility(clientData);
      
      if (!eligibility.isValid) {
        res.status(400).json({
          status: 'Rejected',
          error: eligibility.error
        });
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
      console.error('Error in registerClient:', error);
      res.status(500).json({
        status: 'Rejected',
        error: 'Error interno del servidor'
      });
    }
  }

  static getClient(clientId: number): Client | undefined {
    return this.clients.find(client => client.clientId === clientId);
  }
}