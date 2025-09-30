# VISE Payment API

API para procesamiento de pagos y gestión de clientes con tarjetas VISE.

## Autores
- Andres Felipe Galeano Tellez
- Edward Johan Manrique Martínez

## Descripción
Esta API permite registrar clientes, validar elegibilidad de tarjetas y procesar compras según reglas de negocio para diferentes tipos de tarjeta (Classic, Gold, Platinum, Black, White).

## Endpoints principales
- `POST /client`: Registra un cliente y valida su elegibilidad para una tarjeta.
- `POST /purchase`: Procesa una compra para un cliente registrado.
- `GET /health`: Healthcheck del servicio.

## Instalación y uso
1. Clona el repositorio
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Compila el proyecto:
   ```bash
   npm run build
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

## Pruebas
Puedes usar [Hurl](https://hurl.dev/) o curl para probar los endpoints. Ejemplo:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "Alice Classic", "country": "USA", "monthlyIncome": 100, "viseClub": false, "cardType": "Classic"}' http://localhost:3000/client
```

## Licencia
MIT
