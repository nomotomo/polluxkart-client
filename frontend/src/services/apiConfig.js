// API Configuration for PolluxKart
// Automatically switches between local, dev, and production environments

const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8010/';
  } else if (hostname.includes('dev') || hostname.includes('staging')) {
    return 'https://api.dev.com/';
  } else {
    return 'https://api.polluxkart.com/';
  }
};

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  endpoints: {
    catalog: {
      getAllProducts: 'Catalog/GetAllProducts',
      getAllBrands: 'Catalog/GetAllBrands',
      getAllTypes: 'Catalog/GetAllTypes',
      getProductById: (id) => `Catalog/${id}`,
    },
    basket: {
      getBasket: (userName) => `Basket/${userName}`,
      updateBasket: 'Basket',
    },
  },
};

export default API_CONFIG;
