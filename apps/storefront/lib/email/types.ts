export interface WelcomeEmailProps {
  firstName: string;
  storeUrl: string;
}

export interface OrderItemPayload {
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddressPayload {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  paymentMethod: "ONLINE" | "COD";
  items: OrderItemPayload[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddressPayload;
}

export interface OrderStatusEmailProps {
  orderNumber: string;
  customerName: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED";
  storeUrl: string;
}

export interface ContactAdminEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactReceivedEmailProps {
  name: string;
  subject: string;
  message: string;
}

