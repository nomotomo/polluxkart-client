# API Integration Guide for PolluxKart

This guide explains how to connect PolluxKart frontend to your backend APIs.

## Quick Start

### 1. API Configuration

The API configuration is in `/src/services/apiConfig.js`:

```javascript
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8010/';  // Local development
  } else if (hostname.includes('dev') || hostname.includes('staging')) {
    return 'https://api.dev.com/';     // Staging
  } else {
    return 'https://api.polluxkart.com/'; // Production
  }
};
```

### 2. Available Services

#### Product Service (`/src/services/productService.js`)

```javascript
import ProductService from './services/productService';

// Get all products with pagination, filters, sorting
const { data, count } = await ProductService.getAllProducts(
  page,      // Page number (1-based)
  size,      // Items per page
  brandId,   // Filter by brand ID (optional)
  typeId,    // Filter by type/category ID (optional)
  sort,      // Sort option: 'default', 'priceAsc', 'priceDesc', 'name'
  search     // Search term (optional)
);

// Get all brands
const brands = await ProductService.getAllBrands();

// Get all types/categories
const types = await ProductService.getAllTypes();

// Get single product
const product = await ProductService.getProductById(id);
```

#### Basket Service (`/src/services/basketService.js`)

```javascript
import BasketService from './services/basketService';

// Get user's basket
const basket = await BasketService.getBasket(userName);

// Add item to basket
const updatedBasket = await BasketService.addToBasket(userName, product);

// Remove item from basket
const updatedBasket = await BasketService.removeFromBasket(userName, productId);

// Update item quantity
const updatedBasket = await BasketService.updateBasketItemQuantity(
  userName, 
  productId, 
  newQuantity
);
```

### 3. Enable/Disable API Mode

In `/src/pages/StorePage.jsx`, toggle the `USE_API` flag:

```javascript
// Set to true to use backend API, false for mock data
const USE_API = true;
```

### 4. Expected API Response Formats

#### Products Endpoint
```
GET /Catalog/GetAllProducts?pageIndex=1&pageSize=12&BrandId=xxx&TypeId=xxx&sort=priceAsc&search=keyword
```

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "price": 99.99,
      "originalPrice": 129.99,
      "description": "string",
      "imageFile": "url",
      "type": { "id": "string", "name": "string" },
      "brand": { "id": "string", "name": "string" }
    }
  ],
  "count": 100
}
```

#### Brands Endpoint
```
GET /Catalog/GetAllBrands
```

Response:
```json
[
  { "id": "string", "name": "string" }
]
```

#### Types Endpoint
```
GET /Catalog/GetAllTypes
```

Response:
```json
[
  { "id": "string", "name": "string" }
]
```

#### Basket Endpoints
```
GET /Basket/{userName}
POST /Basket
```

Basket object:
```json
{
  "userName": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "price": 99.99,
      "quantity": 1,
      "imageFile": "url"
    }
  ],
  "totalPrice": 99.99
}
```

### 5. Adding More API Integrations

To add a new API endpoint:

1. Add the endpoint to `apiConfig.js`:
```javascript
endpoints: {
  // ... existing endpoints
  orders: {
    getAll: 'Orders/GetAll',
    getById: (id) => `Orders/${id}`,
    create: 'Orders',
  },
}
```

2. Create a new service file (e.g., `orderService.js`):
```javascript
import API_CONFIG from './apiConfig';

export const getAllOrders = async (userName) => {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders.getAll}?userName=${userName}`;
  const response = await fetch(url);
  return response.json();
};
```

3. Use in your components:
```javascript
import { getAllOrders } from '../services/orderService';

useEffect(() => {
  getAllOrders(user.name).then(setOrders);
}, [user]);
```

### 6. Error Handling

All services include error handling with fallback to mock data:

```javascript
try {
  const data = await ProductService.getAllProducts(...);
} catch (error) {
  console.error('API Error:', error);
  // Falls back to mock data automatically
}
```

### 7. CORS Configuration

Ensure your backend allows requests from the frontend:

```csharp
// In your .NET backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

---

## File Structure

```
/src/services/
├── apiConfig.js      # API URL configuration
├── productService.js # Product/Catalog API calls
└── basketService.js  # Cart/Basket API calls
```

## Testing

1. Start your backend server at `http://localhost:8010`
2. Set `USE_API = true` in StorePage.jsx
3. Refresh the store page
4. Check browser console for API calls and responses

## Troubleshooting

- **CORS errors**: Add frontend URL to backend CORS policy
- **404 errors**: Verify endpoint URLs match your backend routes
- **Empty data**: Check API response format matches expected structure
- **Fallback showing**: Backend not running or returning errors
