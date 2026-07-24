// ============================================
// LUTORA — Application Constants
// ============================================

export const APP_NAME = "LUTORA";
export const APP_TAGLINE = "Peri Peri Makhana";
export const APP_DESCRIPTION =
  "Experience the perfect blend of peri peri spice and makhana magic. Bold flavors, made to crave.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/menu" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// Mobile Navigation
export const MOBILE_NAV_LINKS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Products", href: "/menu", icon: "Package" },
  { label: "Orders", href: "/orders", icon: "ClipboardList" },
  { label: "Cart", href: "/cart", icon: "ShoppingBag" },
  { label: "Profile", href: "/profile", icon: "User" },
] as const;

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning-light text-warning",
  confirmed: "bg-info-light text-info",
  preparing: "bg-accent-light text-accent",
  out_for_delivery: "bg-info-light text-info",
  delivered: "bg-success-light text-success",
  cancelled: "bg-danger-light text-danger",
};

// Spice Levels
export const SPICE_LEVELS = [
  { level: 1, label: "Mild" },
  { level: 2, label: "Medium" },
  { level: 3, label: "Hot" },
  { level: 4, label: "Very Hot" },
  { level: 5, label: "Extreme" },
] as const;

// Pricing
export const DELIVERY_FEE = 30;
export const TAX_RATE = 0.05; // 5% GST
export const FREE_DELIVERY_THRESHOLD = 299;

// Categories (Focused strictly on our 2 signature Makhana flavors)
export const CATEGORIES = [
  { id: "all", name: "All Flavors", slug: "all", icon: "Utensils" },
  { id: "spicy", name: "Peri Peri Spicy", slug: "spicy", icon: "Flame" },
  { id: "honey", name: "Honey Sweet", slug: "honey", icon: "Sparkles" },
] as const;

// Seed Products (our 2 main products)
export const SEED_PRODUCTS = [
  {
    id: "makhna-spicy",
    name: "Peri Peri Makhana",
    slug: "peri-peri-makhna",
    description:
      "Our signature spicy peri peri makhana, tossed in a fiery blend of African bird's eye chili, garlic, and hand-picked spices. Crispy on the outside, light and airy inside. The perfect balance of heat and flavor that keeps you coming back.",
    price: 179,
    category: "spicy",
    spice_level: 3,
    ingredients: [
      "Premium Makhana (Fox Nuts)",
      "Peri Peri Spice Blend",
      "Garlic",
      "Olive Oil",
      "Paprika",
      "Oregano",
      "Sea Salt",
    ],
    is_available: true,
    is_bestseller: false,
    rating: 4.8,
    review_count: 230,
    image: "/images/makhna-spicy.png",
  },
  {
    id: "makhna-honey",
    name: "Honey Makhana",
    slug: "honey-makhna",
    description:
      "A sweet twist on our classic makhana. Drizzled with organic honey and a hint of cinnamon, these golden fox nuts deliver a satisfying crunch with every bite. Perfect for when you crave something sweet yet wholesome.",
    price: 199,
    category: "honey",
    spice_level: 1,
    ingredients: [
      "Premium Makhna (Fox Nuts)",
      "Organic Honey",
      "Cinnamon",
      "Butter",
      "Brown Sugar",
      "Vanilla Extract",
      "Sea Salt",
    ],
    is_available: true,
    is_bestseller: false,
    rating: 4.7,
    review_count: 182,
    image: "/images/makhna-honey.jpg",
  },
] as const;

// Trust Badges for Hero
export const TRUST_BADGES = [
  { icon: "Leaf", label: "100%", sublabel: "Fresh Ingredients" },
  { icon: "Clock", label: "30 Min", sublabel: "Delivery" },
  { icon: "Star", label: "4.8", sublabel: "Rating" },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    text: "The Peri Peri Makhana is absolutely addictive! Perfect spice level and incredibly fresh. Best snack I've had in a long time.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Arjun Patel",
    avatar: "AP",
    rating: 5,
    text: "Honey Makhana is my go-to evening snack now. Sweet, crunchy, and guilt-free. The quality is consistently excellent.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Sneha Reddy",
    avatar: "SR",
    rating: 5,
    text: "Fast delivery, amazing packaging, and the taste is out of this world. LUTORA has set a new standard for healthy snacking.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Rahul Gupta",
    avatar: "RG",
    rating: 4,
    text: "Ordered for a house party and everyone loved it. The Peri Peri flavor is authentic and the crunch is perfect.",
    date: "1 week ago",
  },
] as const;

// FAQ
export const FAQ_ITEMS = [
  {
    question: "What is Makhana?",
    answer:
      "Makhana (Fox Nuts or Lotus Seeds) is a popular Indian superfood known for its light, crunchy texture and numerous health benefits. It's naturally gluten-free, low in calories, and high in protein.",
  },
  {
    question: "How spicy is the Peri Peri Makhana?",
    answer:
      "Our Peri Peri Makhana has a medium-hot spice level (3/5). It has a pleasant kick without being overwhelming. Perfect for those who enjoy a good balance of heat and flavor.",
  },
  {
    question: "What areas do you deliver to?",
    answer:
      "We currently deliver across major areas in the city. Enter your delivery address at checkout to check if we deliver to your location. Orders above ₹299 get free delivery!",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We aim to deliver within 30 minutes of order confirmation. During peak hours, delivery might take up to 45 minutes. You can track your order in real-time through your account.",
  },
  {
    question: "Are your products vegetarian?",
    answer:
      "Yes! All our Makhana products are 100% vegetarian and made with premium, natural ingredients. No artificial flavors or preservatives.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order within 5 minutes of placing it. After that, if the order is being prepared, cancellation may not be possible. Contact our support team for assistance.",
  },
] as const;

// Why LUTORA
export const WHY_LUTORA = [
  {
    icon: "Flame",
    title: "Bold Flavors",
    description: "Authentic peri peri spice blend imported and crafted with precision.",
  },
  {
    icon: "Heart",
    title: "Healthy Snacking",
    description: "Makhana is a superfood — low calorie, high protein, naturally gluten-free.",
  },
  {
    icon: "Truck",
    title: "Fast Delivery",
    description: "From our kitchen to your door in under 30 minutes, fresh and hot.",
  },
  {
    icon: "Shield",
    title: "Quality Promise",
    description: "Premium ingredients, no preservatives, no artificial flavors. Ever.",
  },
] as const;

// Admin Sidebar Links
export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Orders", href: "/admin/orders", icon: "ClipboardList" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;
