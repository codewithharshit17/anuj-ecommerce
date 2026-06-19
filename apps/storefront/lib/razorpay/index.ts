import Razorpay from "razorpay";

const REQUIRED_ENV_VARS = [
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
] as const;

type RazorpayEnvVar = (typeof REQUIRED_ENV_VARS)[number];

function getRequiredEnv(name: RazorpayEnvVar): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required Razorpay environment variable: ${name}`);
  }

  return value;
}

function validateRazorpayEnv(): void {
  for (const name of REQUIRED_ENV_VARS) {
    getRequiredEnv(name);
  }
}

function createRazorpayInstance(): Razorpay {
  validateRazorpayEnv();

  // Server-side Razorpay client used by order creation and payment verification flows.
  return new Razorpay({
    key_id: getRequiredEnv("RAZORPAY_KEY_ID"),
    key_secret: getRequiredEnv("RAZORPAY_KEY_SECRET"),
  });
}

const globalForRazorpay = globalThis as typeof globalThis & {
  razorpayInstance?: Razorpay;
};

function getRazorpayInstance(): Razorpay {
  if (!globalForRazorpay.razorpayInstance) {
    globalForRazorpay.razorpayInstance = createRazorpayInstance();
  }

  return globalForRazorpay.razorpayInstance;
}

export const razorpay = new Proxy({} as Razorpay, {
  get(_target, property, receiver) {
    return Reflect.get(getRazorpayInstance(), property, receiver);
  },
});
