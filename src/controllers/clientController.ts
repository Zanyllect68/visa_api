import { Request, Response } from 'express';
import { ClientResponse, Client, CardType } from '../types';
import { CardService } from '../services/cardService';

export class ClientController {
  private static clients: Client[] = [];
  private static nextId = 1;

  static registerClient(req: Request, res: Response): void {
    try {
      console.log('=== Received request body:', JSON.stringify(req.body, null, 2));
      
      const body = req.body;
      
      // Validate input exists
      if (!body.name || !body.country || !body.cardType || 
          typeof body.monthlyIncome !== 'number' || 
          typeof body.viseClub !== 'boolean') {
        console.log('Validation failed: incomplete data');
        res.status(400).json({
          status: 'Rejected',
          error: 'Datos incompletos'
        });
        return;
      }

      console.log('Input validation passed');

      // Map cardType string to CardType enum
      let cardType: CardType;
      const cardTypeStr = String(body.cardType);
      
      console.log('Converting cardType:', cardTypeStr);
      
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
          console.log('Invalid card type:', cardTypeStr);
          res.status(400).json({
            status: 'Rejected',
            error: 'Tipo de tarjeta no válido'
          });
          return;
      }

      console.log('CardType converted to:', cardType);

      const clientData: Omit<Client, 'clientId'> = {
        name: body.name,
        country: body.country,
        monthlyIncome: body.monthlyIncome,
        viseClub: body.viseClub,
        cardType: cardType
      };

      console.log('ClientData created:', JSON.stringify(clientData, null, 2));

      // Check card eligibility
      console.log('Checking eligibility...');
      const eligibility = CardService.validateCardEligibility(clientData);
      console.log('Eligibility result:', JSON.stringify(eligibility, null, 2));
      
      if (!eligibility.isValid) {
        console.log('Client not eligible');
        res.status(400).json({
          status: 'Rejected',
          error: eligibility.error
        });
        return;
      }

      console.log('Client is eligible, registering...');

      // Register client
      const newClient: Client = {
        clientId: this.nextId++,
        ...clientData
      };

      this.clients.push(newClient);
      console.log('Client registered with ID:', newClient.clientId);

      const response: ClientResponse = {
        clientId: newClient.clientId,
        name: newClient.name,
        cardType: newClient.cardType,
        status: 'Registered',
        message: `Cliente apto para tarjeta ${newClient.cardType}`
      };

      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.status(200).json(response);
    } catch (error) {
      console.error('=== ERROR in registerClient ===');
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Request body:', JSON.stringify(req.body, null, 2));
      
      res.status(500).json({
        status: 'Rejected',
        error: 'Error interno del servidor',
        debug: error instanceof Error ? error.message : String(error)
      });
    }
  }

  static getClient(clientId: number): Client | undefined {
    return this.clients.find(client => client.clientId === clientId);
  }
}