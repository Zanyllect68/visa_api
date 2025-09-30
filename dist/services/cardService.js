"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const types_1 = require("../types");
class CardService {
    static validateCardEligibility(client) {
        switch (client.cardType) {
            case types_1.CardType.CLASSIC:
                return { isValid: true };
            case types_1.CardType.GOLD:
                if (client.monthlyIncome < 500) {
                    return { isValid: false, error: 'El cliente no cumple con el ingreso mínimo de 500 USD para Gold' };
                }
                return { isValid: true };
            case types_1.CardType.PLATINUM:
                if (client.monthlyIncome < 1000) {
                    return { isValid: false, error: 'El cliente no cumple con el ingreso mínimo de 1000 USD para Platinum' };
                }
                if (!client.viseClub) {
                    return { isValid: false, error: 'El cliente no cumple con la suscripción VISE CLUB requerida para Platinum' };
                }
                return { isValid: true };
            case types_1.CardType.BLACK:
                if (client.monthlyIncome < 2000) {
                    return { isValid: false, error: 'El cliente no cumple con el ingreso mínimo de 2000 USD para Black' };
                }
                if (!client.viseClub) {
                    return { isValid: false, error: 'El cliente no cumple con la suscripción VISE CLUB requerida para Black' };
                }
                if (this.restrictedCountries.includes(client.country)) {
                    return { isValid: false, error: 'El cliente no puede tener tarjeta Black viviendo en países restringidos' };
                }
                return { isValid: true };
            case types_1.CardType.WHITE:
                if (client.monthlyIncome < 2000) {
                    return { isValid: false, error: 'El cliente no cumple con el ingreso mínimo de 2000 USD para White' };
                }
                if (!client.viseClub) {
                    return { isValid: false, error: 'El cliente no cumple con la suscripción VISE CLUB requerida para White' };
                }
                if (this.restrictedCountries.includes(client.country)) {
                    return { isValid: false, error: 'El cliente no puede tener tarjeta White viviendo en países restringidos' };
                }
                return { isValid: true };
            default:
                return { isValid: false, error: 'Tipo de tarjeta no válido' };
        }
    }
    static calculateDiscount(client, purchase) {
        const purchaseDate = new Date(purchase.purchaseDate);
        const dayOfWeek = purchaseDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const isAbroad = client.country !== purchase.purchaseCountry;
        switch (client.cardType) {
            case types_1.CardType.CLASSIC:
                return { discount: 0, benefit: 'Sin beneficios' };
            case types_1.CardType.GOLD:
                if ([1, 2, 3].includes(dayOfWeek) && purchase.amount > 100) {
                    return { discount: 0.15, benefit: 'Lunes a Miércoles - Descuento 15%' };
                }
                return { discount: 0, benefit: 'Sin descuento aplicable' };
            case types_1.CardType.PLATINUM:
                if ([1, 2, 3].includes(dayOfWeek) && purchase.amount > 100) {
                    return { discount: 0.20, benefit: 'Lunes a Miércoles - Descuento 20%' };
                }
                if (dayOfWeek === 6 && purchase.amount > 200) {
                    return { discount: 0.30, benefit: 'Sábado - Descuento 30%' };
                }
                if (isAbroad) {
                    return { discount: 0.05, benefit: 'Compra en el exterior - Descuento 5%' };
                }
                return { discount: 0, benefit: 'Sin descuento aplicable' };
            case types_1.CardType.BLACK:
                if ([1, 2, 3].includes(dayOfWeek) && purchase.amount > 100) {
                    return { discount: 0.25, benefit: 'Lunes a Miércoles - Descuento 25%' };
                }
                if (dayOfWeek === 6 && purchase.amount > 200) {
                    return { discount: 0.35, benefit: 'Sábado - Descuento 35%' };
                }
                if (isAbroad) {
                    return { discount: 0.05, benefit: 'Compra en el exterior - Descuento 5%' };
                }
                return { discount: 0, benefit: 'Sin descuento aplicable' };
            case types_1.CardType.WHITE:
                if ([1, 2, 3, 4, 5].includes(dayOfWeek) && purchase.amount > 100) {
                    return { discount: 0.25, benefit: 'Lunes a Viernes - Descuento 25%' };
                }
                if ([0, 6].includes(dayOfWeek) && purchase.amount > 200) {
                    return { discount: 0.35, benefit: 'Sábado y Domingo - Descuento 35%' };
                }
                if (isAbroad) {
                    return { discount: 0.05, benefit: 'Compra en el exterior - Descuento 5%' };
                }
                return { discount: 0, benefit: 'Sin descuento aplicable' };
            default:
                return { discount: 0, benefit: 'Sin beneficios' };
        }
    }
    static validatePurchaseRestrictions(client, purchase) {
        if (client.cardType === types_1.CardType.BLACK || client.cardType === types_1.CardType.WHITE) {
            if (this.restrictedCountries.includes(purchase.purchaseCountry)) {
                return {
                    isValid: false,
                    error: `El cliente con tarjeta ${client.cardType} no puede realizar compras desde ${purchase.purchaseCountry}`
                };
            }
        }
        return { isValid: true };
    }
}
exports.CardService = CardService;
CardService.restrictedCountries = ['China', 'Vietnam', 'India', 'Iran'];
