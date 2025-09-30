export enum CardType {
  CLASSIC = 'Classic',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
  BLACK = 'Black',
  WHITE = 'White'
}

export interface ClientRequest {
  name: string;
  country: string;
  monthlyIncome: number;
  viseClub: boolean;
  cardType: CardType;
}

export interface Client {
  clientId: number;
  name: string;
  country: string;
  monthlyIncome: number;
  viseClub: boolean;
  cardType: CardType;
}

export interface PurchaseRequest {
  clientId: number;
  amount: number;
  currency: string;
  purchaseDate: string;
  purchaseCountry: string;
}

export interface PurchaseResponse {
  status: 'Approved' | 'Rejected';
  purchase?: {
    clientId: number;
    originalAmount: number;
    discountApplied: number;
    finalAmount: number;
    benefit: string;
  };
  error?: string;
}

export interface ClientResponse {
  clientId?: number;
  name?: string;
  cardType?: CardType;
  status: 'Registered' | 'Rejected';
  message?: string;
  error?: string;
}
