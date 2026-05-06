# Japbar Frontend

React frontend for Japbar e-commerce platform.

## Setup

### Development (Local)
```bash
npm install
npm start
```

The app will run on http://localhost:3000

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

For production, this will be handled by nginx routing.

## API Integration

The backend API is available at `/api/` when running through docker-compose.

Example API calls:
```javascript
// Get products
fetch('/api/catalog/products/')
  .then(res => res.json())
  .then(data => console.log(data));

// Get categories
fetch('/api/catalog/categories/')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Docker

Build and run with docker-compose from the root directory:
```bash
docker-compose up --build frontend
```

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── utils/       # Utility functions
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
├── Dockerfile       # Production build
└── package.json     # Dependencies
```
