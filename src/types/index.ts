// ============================================
// LUTORA — TypeScript Type Definitions
// ============================================

// --- User & Auth ---
export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// --- Products ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  category?: Category;
  spice_level: number;
  ingredients: string[];
  is_available: boolean;
  is_bestseller: boolean;
  stock_quantity?: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  sort_order: number;
}

// --- Cart ---
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

// --- Addresses ---
export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line: string;
  city: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

// --- Orders ---
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  address_id: string;
  address?: Address;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  phone: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  timestamp: string | null;
  completed: boolean;
  current: boolean;
}

// --- Reviews ---
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  profile?: Profile;
  created_at: string;
}

// --- Favorites ---
export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
}

// --- Notifications ---
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// --- Admin Dashboard ---
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

// --- API ---
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// --- Form Types ---
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface CheckoutFormData {
  address_id: string;
  phone: string;
  notes: string;
}

export interface AddressFormData {
  label: string;
  address_line: string;
  city: string;
  pincode: string;
  is_default: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  spice_level: number;
  ingredients: string[];
  is_available: boolean;
  is_bestseller: boolean;
}
