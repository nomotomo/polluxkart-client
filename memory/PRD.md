# PolluxKart - E-Commerce Platform PRD

## Original Problem Statement
Build a complete e-commerce platform named "PolluxKart" with:
- Frontend: React with tech-savvy, organic, fresh design
- Backend: Microservice architecture with MongoDB
- Features: Products, Cart, Checkout, Orders, Payments, Reviews, Wishlist, Inventory

## Technical Architecture

### Frontend (React)
- **Stack**: React 19, Tailwind CSS, shadcn/ui
- **State Management**: React Context API with Backend Sync
- **Routing**: React Router DOM v7
- **Testing**: Jest, React Testing Library (28 tests)
- **CI/CD**: GitHub Actions
- **API Integration**: Fully connected to FastAPI backend

### Backend (FastAPI)
- **Stack**: FastAPI, Python 3.11, MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **Payment**: Razorpay integration
- **Testing**: Pytest (40 tests)

### Database (MongoDB)
Collections:
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `carts` - Shopping carts
- `wishlists` - User wishlists
- `orders` - Order records
- `payments` - Payment transactions
- `inventory` - Stock management
- `reviews` - Product reviews
- `stock_movements` - Inventory audit trail

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (email/phone)

### Products
- `GET /api/products` - List products (pagination, filter, sort, search)
- `GET /api/products/{id}` - Get product
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands
- `GET /api/products/{id}/reviews` - Get reviews
- `POST /api/products/{id}/reviews` - Add review (auth)

### Cart
- `GET /api/cart` - Get cart (auth)
- `POST /api/cart/items` - Add to cart (auth)
- `PUT /api/cart/items/{product_id}` - Update quantity (auth)
- `DELETE /api/cart/items/{product_id}` - Remove item (auth)

### Wishlist
- `GET /api/wishlist` - Get wishlist (auth)
- `GET /api/wishlist/products` - Get full product details (auth)
- `POST /api/wishlist/items` - Add item (auth)
- `DELETE /api/wishlist/items/{product_id}` - Remove item (auth)

### Orders
- `GET /api/orders` - Get orders (auth)
- `POST /api/orders` - Create order (auth)
- `GET /api/orders/{id}` - Get order (auth)
- `POST /api/orders/{id}/cancel` - Cancel order (auth)

### Payments
- `POST /api/payments/razorpay/create/{order_id}` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment
- `POST /api/payments/razorpay/webhook` - Webhook handler

### Inventory
- `GET /api/inventory/{product_id}` - Get inventory
- `GET /api/inventory/{product_id}/available` - Get available stock
- `POST /api/inventory/adjust` - Adjust stock (admin)
- `GET /api/inventory/alerts/low-stock` - Low stock alerts (admin)

## Features Implemented

### Frontend (December 2025)
- [x] All pages: Home, Store, Product, Cart, Checkout, Orders, Wishlist, Auth
- [x] INR currency formatting (₹)
- [x] Country code selector for phone auth
- [x] OTP verification flow (MOCKED)
- [x] Categories dropdown in navbar
- [x] **Debounced search (500ms) - FIXED**
- [x] Out-of-stock handling
- [x] Toast notifications with close button
- [x] Unit tests (28 passing)
- [x] GitHub Actions CI/CD
- [x] **Frontend-Backend Integration - COMPLETED**

### Backend (December 2025)
- [x] JWT Authentication
- [x] Product CRUD with filtering, sorting, search
- [x] Shopping cart management
- [x] Wishlist sync
- [x] Order management
- [x] Razorpay payment integration
- [x] Inventory management with stock movements
- [x] Product reviews & ratings
- [x] Email notifications (templates ready)
- [x] Pytest tests (40 passing)

## Frontend-Backend Integration (December 2025)

### Services Created/Updated
- `apiConfig.js` - Base API configuration with auth token management
- `authService.js` - Login, register, logout with JWT
- `productService.js` - Products, categories, brands, reviews
- `cartService.js` - Cart operations (syncs with backend when authenticated)
- `wishlistService.js` - Wishlist operations (syncs with backend when authenticated)
- `orderService.js` - Order management

### Context Updates
- `AuthContext.js` - Real API login/signup, JWT token storage
- `CartContext.js` - Hybrid approach: localStorage fallback + backend sync
- `WishlistContext.js` - Hybrid approach: localStorage fallback + backend sync

### Key Features
- Products load from MongoDB via backend API
- Search with 500ms debounce (fixed recurring bug)
- Categories and brands dynamically loaded
- Cart syncs to backend when user is authenticated
- Wishlist syncs to backend when user is authenticated
- Guest users can still use cart/wishlist via localStorage

## Test Credentials
- **Email**: test@polluxkart.com
- **Phone**: +919876543210
- **Password**: Test@123

## Seed Data
- 6 Categories
- 21 Products (2 out of stock)
- 20 Brands
- 1 Test user

### Backend (FastAPI)
- **Stack**: FastAPI, Python 3.11, MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **Payment**: Razorpay integration (pending API keys)
- **Services**: Auth, Products, Cart, Wishlist, Orders, Payments, Inventory

### Database (MongoDB)
Collections:
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `carts` - Shopping carts (synced with backend)
- `wishlists` - User wishlists (synced with backend)
- `orders` - Order records
- `payments` - Payment transactions
- `inventory` - Stock management
- `reviews` - Product reviews
- `stock_movements` - Inventory audit trail

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (email/phone)

### Products
- `GET /api/products` - List products (pagination, filter, sort, search)
- `GET /api/products/{id}` - Get product
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands
- `GET /api/products/{id}/reviews` - Get reviews
- `POST /api/products/{id}/reviews` - Add review (auth)

### Cart
- `GET /api/cart` - Get cart (auth)
- `POST /api/cart/items` - Add to cart (auth)
- `PUT /api/cart/items/{product_id}` - Update quantity (auth)
- `DELETE /api/cart/items/{product_id}` - Remove item (auth)

### Wishlist
- `GET /api/wishlist` - Get wishlist (auth)
- `GET /api/wishlist/products` - Get full product details (auth)
- `POST /api/wishlist/items` - Add item (auth)
- `DELETE /api/wishlist/items/{product_id}` - Remove item (auth)

### Orders
- `GET /api/orders` - Get orders (auth)
- `POST /api/orders` - Create order (auth)
- `GET /api/orders/{id}` - Get order (auth)
- `POST /api/orders/{id}/cancel` - Cancel order (auth)

### Payments
- `POST /api/payments/razorpay/create/{order_id}` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment

### Inventory
- `GET /api/inventory/{product_id}` - Get inventory
- `GET /api/inventory/{product_id}/available` - Get available stock
- `POST /api/inventory/adjust` - Adjust stock (admin)

## Features Implemented

### Frontend (January 2026)
- [x] All pages: Home, Store, Product, Cart, Checkout, Orders, Wishlist, Auth
- [x] INR currency formatting (₹)
- [x] Country code selector for phone auth
- [x] OTP verification flow (MOCKED)
- [x] Categories dropdown in navbar
- [x] Debounced search (500ms)
- [x] Out-of-stock handling
- [x] Toast notifications with close button
- [x] Unit tests
- [x] GitHub Actions CI/CD

### Backend (January 2026)
- [x] JWT Authentication
- [x] Product CRUD with filtering, sorting, search
- [x] Shopping cart management
- [x] Wishlist sync
- [x] Order management
- [x] Razorpay payment integration (MOCKED - awaiting keys)
- [x] Inventory management with stock movements
- [x] Product reviews & ratings
- [x] Email notifications (templates ready)

### Frontend-Backend Integration (February 2026)
- [x] Connected Store page to /api/products
- [x] Connected Product Detail page to /api/products/{id}
- [x] Connected Auth to /api/auth/login and /api/auth/register
- [x] CartContext syncs with /api/cart when authenticated
- [x] WishlistContext syncs with /api/wishlist when authenticated
- [x] All API services created (productService, authService, cartService, wishlistService, orderService)

## Test Credentials
- **Email**: test@polluxkart.com
- **Phone**: +919876543210
- **Password**: Test@123

## Seed Data
- 6 Categories
- 21 Products (2 out of stock)
- 1 Test user

## Known Mocked Elements
- **OTP Verification**: Frontend mock - any 6-digit code works (123456 recommended)
- **Razorpay**: Mock order IDs generated when API keys not configured
- **Email Notifications**: SMTP not configured - logs to console

### New Features (This Session)
1. **INR Currency**: formatPrice utility showing ₹ symbol with Indian number formatting
2. **Country Code Selector**: 20 countries with flags in Auth page
3. **Categories Navigation**: Full dropdown in header with subcategories
4. **Out-of-Stock Handling**: Disabled buttons and indicator on ProductPage
5. **Wishlist Integration**: Working add/remove on ProductPage
6. **OTP Verification (MOCKED)**: Phone verification flow with:
   - Send OTP button
   - 6-digit OTP input boxes
   - Verify OTP button
   - Resend timer (30s countdown)
   - Mock OTP: 123456 (any 6-digit code works)
7. **Debounced Search**: Store search waits 500ms before filtering (prevents search on every keystroke)
8. **Unit Tests**: 28 tests covering currency, products, country codes, debounce hook
9. **GitHub Actions CI**: Runs tests, lint, build on PR to main/dev

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=polluxkart
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxx  # Optional
RAZORPAY_KEY_SECRET=xxx  # Optional
SMTP_HOST=smtp.gmail.com  # Optional
SMTP_USER=xxx  # Optional
SMTP_PASSWORD=xxx  # Optional
```

## Testing Status
- ✅ Unit Tests: 28/28 passing
- ✅ Frontend E2E: All features tested and working
- ✅ Out-of-stock: Properly disables purchase buttons
- ✅ OTP Flow: Send OTP, Enter OTP, Verify works
- ✅ Search Debounce: 500ms delay before filtering

## Known Mocked Elements
- **Backend API**: All API calls fallback to local mock data
- **Authentication**: Mocked - any credentials work
- **OTP Verification**: MOCKED - Test OTP is 123456, but any 6-digit code works
- **Payment**: UI only - no real transactions
- **Orders**: Stored in localStorage, not persistent

## P0/P1/P2 Features Status

### P0 (Critical) - COMPLETE
- [x] All main pages functional
- [x] INR currency display
- [x] Basic cart/checkout flow
- [x] Product browsing and filtering

### P1 (Important) - COMPLETE
- [x] Wishlist functionality
- [x] Country code selector
- [x] Categories in navbar
- [x] Out-of-stock handling
- [x] Unit testing setup

### P1 - Important
- [ ] Configure SMTP for email notifications
- [ ] Add real OTP service (Twilio/AWS SNS)
- [ ] Add order tracking with status updates
- [ ] Add user profile/settings page

### P2 - Nice to Have
- [ ] Add product image upload
- [ ] Add coupon/discount codes
- [ ] Add order invoice PDF generation
- [ ] Add social login (Google/Facebook)

## File Structure
```
/app/
├── .github/workflows/ci.yml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/ (AuthContext, CartContext, WishlistContext)
│   │   ├── pages/
│   │   ├── services/ (apiConfig, authService, productService, cartService, wishlistService, orderService)
│   │   └── utils/
│   └── tests/
└── backend/
    ├── config/
    ├── models/
    ├── routes/
    ├── services/
    └── utils/
```
