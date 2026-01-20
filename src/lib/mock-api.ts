import { Product, Supplier } from '@/types';
import { Order } from '@/hooks/api/useOrders';
import { CartAPI } from '@/hooks/api/useCartApi'; // Import cart types
import { sampleProducts, sampleSuppliers, sampleOrders } from './sample-data';

const PRODUCTS_KEY = 'mock_products';
const SUPPLIERS_KEY = 'mock_suppliers';
const ORDERS_KEY = 'mock_orders';
const CART_KEY = 'mock_cart'; // New cart key

// --- Helper Functions ---

const getProductsFromStorage = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const productsJson = localStorage.getItem(PRODUCTS_KEY);
  return productsJson ? JSON.parse(productsJson) : [];
};

const saveProductsToStorage = (products: Product[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
};

const getSuppliersFromStorage = (): Supplier[] => {
  if (typeof window === 'undefined') return [];
  const suppliersJson = localStorage.getItem(SUPPLIERS_KEY);
  return suppliersJson ? JSON.parse(suppliersJson) : [];
};

const saveSuppliersToStorage = (suppliers: Supplier[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
  }
};

const getOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const ordersJson = localStorage.getItem(ORDERS_KEY);
  return ordersJson ? JSON.parse(ordersJson) : [];
};

const saveOrdersToStorage = (orders: Order[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
};

// Cart helpers
const getCartFromStorage = (): CartAPI => {
  if (typeof window === 'undefined') return { id: 1, userId: 1, items: [] }; // Default empty cart
  const cartJson = localStorage.getItem(CART_KEY);
  return cartJson ? JSON.parse(cartJson) : { id: 1, userId: 1, items: [] };
};

const saveCartToStorage = (cart: CartAPI): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};


// --- Initialization ---

const initializeMockData = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(PRODUCTS_KEY)) {
      saveProductsToStorage(sampleProducts);
    }
    if (!localStorage.getItem(SUPPLIERS_KEY)) {
      saveSuppliersToStorage(sampleSuppliers);
    }
    if (!localStorage.getItem(ORDERS_KEY)) {
      saveOrdersToStorage(sampleOrders);
    }
    if (!localStorage.getItem(CART_KEY)) {
      saveCartToStorage({ id: 1, userId: 1, items: [] }); // Initialize with an empty cart
    }
  }
};

// --- Mock API Functions ---

interface ProductFilters {
  sortBy?: string;
  category?: string[] | undefined;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const mockGetProducts = async (filters: ProductFilters): Promise<Product[]> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', 'getProducts called with filters:', filters);
  let products = getProductsFromStorage();

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    products = products.filter(p => p.productName.toLowerCase().includes(searchTerm));
  }

  // Apply price filters
  if (filters.minPrice) {
    products = products.filter(p => p.sellingPriceRetail && p.sellingPriceRetail >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    products = products.filter(p => p.sellingPriceRetail && p.sellingPriceRetail <= filters.maxPrice!);
  }
  
  // Apply category filter
  if (filters.category && filters.category.length > 0) {
      const categoryNames = filters.category.map(c => c.toLowerCase());
      products = products.filter(p => p.category && categoryNames.includes(p.category.categoryName.toLowerCase()));
  }

  // Apply sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        // Assuming higher ID means newer.
        products.sort((a, b) => b.id - a.id);
        break;
      case 'price-asc':
        products.sort((a, b) => (a.sellingPriceRetail || 0) - (b.sellingPriceRetail || 0));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.sellingPriceRetail || 0) - (a.sellingPriceRetail || 0));
        break;
    }
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return products;
};

export const mockGetProductById = async (id: string): Promise<Product | undefined> => {
    console.log('%c MOCK API ', 'background: #222; color: #bada55', `getProductById called with id: ${id}`);
    const products = getProductsFromStorage();
    const numericId = parseInt(id, 10);
    const product = products.find(p => p.id === numericId);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};

export const mockCreateProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    console.log('%c MOCK API ', 'background: #222; color: #bada55', 'createProduct called with data:', productData);
    const products = getProductsFromStorage();
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = { ...productData, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const updatedProducts = [...products, newProduct];
    saveProductsToStorage(updatedProducts);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return newProduct;
}

export const mockGetSuppliers = async (): Promise<Supplier[]> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', 'getSuppliers called');
  const suppliers = getSuppliersFromStorage();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return suppliers;
};

export const mockGetSupplierById = async (id: string): Promise<Supplier | undefined> => {
    console.log('%c MOCK API ', 'background: #222; color: #bada55', `getSupplierById called with id: ${id}`);
    const suppliers = getSuppliersFromStorage();
    const numericId = parseInt(id, 10);
    const supplier = suppliers.find(s => s.id === numericId);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!supplier) {
        throw new Error('Supplier not found');
    }

    return supplier;
};

export const mockGetCart = async (): Promise<CartAPI> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', 'getCart called');
  const cart = getCartFromStorage();
  await new Promise(resolve => setTimeout(resolve, 300));
  return cart;
};

export const mockAddItemToCart = async ({ productId, quantity }: { productId: number; quantity: number }): Promise<CartAPI> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', `addItemToCart called: productId ${productId}, quantity ${quantity}`);
  const cart = getCartFromStorage();
  const products = getProductsFromStorage();
  const productToAdd = products.find(p => p.id === productId);

  if (!productToAdd) {
    throw new Error('Product not found in mock data');
  }

  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    // Update quantity of existing item
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      id: Math.floor(Math.random() * 100000), // Mock item ID
      productId: productToAdd.id,
      quantity: quantity,
      product: productToAdd, // Store full product details
    });
  }

  saveCartToStorage(cart);
  await new Promise(resolve => setTimeout(resolve, 300));
  return cart;
};

export const mockUpdateCartItem = async ({ itemId, quantity }: { itemId: number; quantity: number }): Promise<CartAPI> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', `updateCartItem called: itemId ${itemId}, quantity ${quantity}`);
  const cart = getCartFromStorage();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    // If quantity is 0 or less, remove the item
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  saveCartToStorage(cart);
  await new Promise(resolve => setTimeout(resolve, 300));
  return cart;
};

export const mockRemoveCartItem = async (itemId: number): Promise<CartAPI> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', `removeCartItem called: itemId ${itemId}`);
  const cart = getCartFromStorage();
  cart.items = cart.items.filter(item => item.id !== itemId);
  saveCartToStorage(cart);
  await new Promise(resolve => setTimeout(resolve, 300));
  return cart;
};


// --- Initialize ---
initializeMockData();

export const mockGetOrders = async (): Promise<Order[]> => {
  console.log('%c MOCK API ', 'background: #222; color: #bada55', 'getOrders called');
  const orders = getOrdersFromStorage();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return orders;
};
