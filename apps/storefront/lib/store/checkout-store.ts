import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CheckoutStep = "contact" | "shipping" | "delivery" | "payment";

export interface ContactInfo {
  fullName: string;
  email: string;
  mobile: string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
}

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

interface CheckoutStore {
  step: CheckoutStep;
  contact: ContactInfo;
  shipping: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  appliedCoupon: {
    code: string;
    discountType: "percentage" | "fixed";
    amount: number;
  } | null;

  setStep: (step: CheckoutStep) => void;
  setContact: (contact: Partial<ContactInfo>) => void;
  setShipping: (shipping: Partial<ShippingAddress>) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAppliedCoupon: (coupon: CheckoutStore["appliedCoupon"]) => void;
  resetCheckout: () => void;
}

const initialContact: ContactInfo = {
  fullName: "",
  email: "",
  mobile: "",
};

const initialShipping: ShippingAddress = {
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pinCode: "",
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      step: "contact",
      contact: initialContact,
      shipping: initialShipping,
      deliveryMethod: "standard",
      paymentMethod: "upi",
      appliedCoupon: null,

      setStep: (step) => set({ step }),
      setContact: (contact) =>
        set((state) => ({ contact: { ...state.contact, ...contact } })),
      setShipping: (shipping) =>
        set((state) => ({ shipping: { ...state.shipping, ...shipping } })),
      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setAppliedCoupon: (appliedCoupon) => set({ appliedCoupon }),
      resetCheckout: () =>
        set({
          step: "contact",
          contact: initialContact,
          shipping: initialShipping,
          deliveryMethod: "standard",
          paymentMethod: "upi",
          appliedCoupon: null,
        }),
    }),
    {
      name: "kapi-checkout",
    }
  )
);
