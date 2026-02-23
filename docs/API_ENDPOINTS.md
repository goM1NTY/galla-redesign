# API Endpoints

This project includes a backend API in `backend/` (Express + TypeScript).

Base URL (local): `http://localhost:4000`

## Health

### `GET /health`
Purpose: quick server status check.

Response:
```json
{
  "success": true,
  "status": "ok"
}
```

## Products

### `GET /products`
Purpose: return all products (capsules + espresso) for frontend display.

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "capsules-classic",
      "name": "Capsules Classic",
      "category": "capsules",
      "description": "Balanced and smooth cup with soft crema.",
      "priceEur": 6.4,
      "inStock": true
    }
  ]
}
```

## Contact

### `POST /contact`
Purpose: save contact form submissions.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "I want more details."
}
```

Notes:
- `subject` is optional.
- Validation includes required name/email/message.

Success response (`201`):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question",
    "message": "I want more details.",
    "createdAt": "2026-02-23T11:28:59.156Z"
  }
}
```

## Orders

### `POST /orders/capsules`
Purpose: create a capsules order request.

Request body:
```json
{
  "customerName": "Buyer Name",
  "customerEmail": "buyer@example.com",
  "customerPhone": "+38970000000",
  "note": "Deliver after 5pm",
  "items": [
    {
      "productId": "capsules-classic",
      "quantity": 2
    }
  ]
}
```

Notes:
- `customerPhone` and `note` are optional.
- `items` must contain at least one entry.
- `productId` must be a valid capsule product.

Success response (`201`):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerName": "Buyer Name",
    "customerEmail": "buyer@example.com",
    "customerPhone": "+38970000000",
    "note": "Deliver after 5pm",
    "items": [
      {
        "productId": "capsules-classic",
        "quantity": 2
      }
    ],
    "createdAt": "2026-02-23T11:28:59.163Z"
  }
}
```

### `POST /orders/espresso-inquiry`
Purpose: submit inquiry for espresso products (without checkout pricing).

Request body:
```json
{
  "customerName": "Buyer Name",
  "customerEmail": "buyer@example.com",
  "customerPhone": "+38970000000",
  "products": ["espresso-classic", "espresso-black"],
  "message": "Send pricing and delivery options."
}
```

Notes:
- `customerPhone` and `message` are optional.
- `products` must contain valid espresso product IDs.

Success response (`201`):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerName": "Buyer Name",
    "customerEmail": "buyer@example.com",
    "customerPhone": "+38970000000",
    "products": ["espresso-classic", "espresso-black"],
    "message": "Send pricing and delivery options.",
    "createdAt": "2026-02-23T11:28:59.169Z"
  }
}
```

## Error Format

Validation errors return `400`:
```json
{
  "success": false,
  "error": "Invalid ... payload",
  "details": {}
}
```
