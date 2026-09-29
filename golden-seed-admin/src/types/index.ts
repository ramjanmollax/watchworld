export interface Product {
  id: string;
  name: string;
  category: string;
  regularPrice: number;
  salePrice: number;
  discount: number;
  stock: number;
  inStock: boolean;
  featured: boolean;
  displayOrder: number;
  rating: number;
  reviewsCount: number;
  packetInfo: string;
  seedCountWeight: string;
  seedVariety: string;
  sowingSeason: string;
  germinationTime: string;
  germinationRate: string;
  moistureLevel?: string;
  transplantingTime?: string;
  plantSpacing?: string;
  soilType?: string;
  sunlight?: string;
  water?: string;
  fertilizer?: string;
  harvestTime?: string;
  cultivationGuide?: string;
  description: string;
  deliveryInfo?: string;
  images: string[];
  thumbnail: string;
}

export interface Combo {
  id: string;
  name: string;
  badge: string; // e.g. "সেরা অফার", "জনপ্রিয়"
  tag: string; // e.g. "২৫ প্রকার বীজ", "১০ প্রকার বীজ"
  subtitle?: string; // e.g. "বাড়ির ছাদে/উঠানে নিজের সবজি বাগান"
  regularPrice: number;
  salePrice: number;
  discount: number;
  stock: number;
  inStock: boolean;
  featured: boolean;
  displayOrder: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  packageInfo: string;
  deliveryInfo: string;
  importantNotes: string;
  includedProductIds?: string[]; // references Product IDs!
  itemsList?: { no?: string; name: string; qty?: string; emoji?: string; image?: string }[];
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  type: 'product' | 'combo';
  productId?: string;
  comboId?: string;
  name: string;
  image: string;
  regularPrice: number;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface OrderItem {
  id: string;
  type: 'product' | 'combo';
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderCode: string; // e.g. "#GS-20241201-000123"
  createdAt: string;
  customerName: string;
  customerPhone: string;
  district: string;
  upazilaThana: string;
  address: string;
  orderNote?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: string;
  paymentTrxId?: string;
  paymentPhone?: string;
  status: OrderStatus;
}

export interface FooterTrustItem {
  id: string;
  icon: 'sprout' | 'truck' | 'shield' | 'heart' | 'package' | 'award';
  title: string;
  subtitle: string;
  enabled: boolean;
}

export interface FooterQuickLink {
  id: string;
  label: string;
  actionType: 'page' | 'url';
  target: string;
  enabled: boolean;
}

export interface FooterSettings {
  // 1. Top Trust Strip
  showTrustStrip: boolean;
  trustItems: FooterTrustItem[];

  // 2. Brand & Bio
  brandName?: string;
  logoType?: 'icon' | 'image';
  logoImage?: string;
  footerBio: string;
  
  // 3. Social Icons
  showSocialLinks: boolean;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  whatsappNumber: string;

  // 4. Quick Links Column
  quickLinksTitle: string;
  showQuickLinks: boolean;
  quickLinks: FooterQuickLink[];

  // 5. Contact Column
  contactTitle: string;
  showContact: boolean;
  phone: string;
  email: string;
  address: string;
  supportHours?: string;

  // 6. Newsletter / CTA
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterButtonText: string;

  // 7. Copyright & Policies
  copyrightText: string;
  developerCredit?: string;
  showPolicies: boolean;
  privacyPolicyText?: string;
  termsText?: string;
  returnPolicyText?: string;

  // 8. Payment & Trust Badges
  showPaymentBadges: boolean;
}

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  heroBgImage: string;
  heroDisplayMode?: 'contain' | 'split' | 'cover';
  heroOverlay?: 'none' | 'light' | 'medium';
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    instagram: string;
    whatsapp: string;
  };
  deliveryCharges: {
    insideDhaka: number;
    outsideDhaka: number;
    freeDeliveryThreshold: number;
    isFreeDeliveryActive: boolean;
  };
  paymentSettings: {
    codEnabled: boolean;
    codNote: string;
    bkashEnabled: boolean;
    bkashNumber?: string;
    bkashType?: 'personal' | 'merchant';
    bkashInstructions?: string;
    nagadEnabled?: boolean;
    nagadNumber?: string;
    nagadType?: 'personal' | 'merchant';
    nagadInstructions?: string;
  };
  noticeBanner?: {
    enabled: boolean;
    text: string;
  };
  searchEnabled?: boolean;
  footerSettings?: FooterSettings;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}
