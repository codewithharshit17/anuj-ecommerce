"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export interface AddressFormState {
  success?: boolean;
  error?: string;
  errors?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// ── Add Address ──────────────────────────────────────────────────────
export async function addAddressAction(
  prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    return { error: "You must be logged in to add an address." };
  }

  const line1 = formData.get("line1") as string;
  const line2 = formData.get("line2") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const isDefault = formData.get("isDefault") === "true";

  // Validate
  const errors: AddressFormState["errors"] = {};
  if (!line1 || !line1.trim()) errors.line1 = "Address Line 1 is required.";
  if (!city || !city.trim()) errors.city = "City is required.";
  if (!state || !state.trim()) errors.state = "State is required.";
  if (!pincode || !pincode.trim()) {
    errors.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(pincode.trim())) {
    errors.pincode = "Must be a valid 6-digit Indian PIN code.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const cleanLine1 = line1.trim();
    const cleanLine2 = line2 ? line2.trim() : null;
    const cleanCity = city.trim();
    const cleanState = state.trim();
    const cleanPincode = pincode.trim();

    // Check if user already has addresses
    const existingCount = await prisma.address.count({
      where: { userId: user.id },
    });

    // If first address, it MUST be default
    const shouldBeDefault = existingCount === 0 || isDefault;

    if (shouldBeDefault) {
      // Unset existing defaults
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: user.id,
        line1: cleanLine1,
        line2: cleanLine2,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[addAddressAction] Failed to create address:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// ── Edit Address ─────────────────────────────────────────────────────
export async function editAddressAction(
  addressId: string,
  prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    return { error: "You must be logged in to update an address." };
  }

  const line1 = formData.get("line1") as string;
  const line2 = formData.get("line2") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const isDefault = formData.get("isDefault") === "true";

  // Validate
  const errors: AddressFormState["errors"] = {};
  if (!line1 || !line1.trim()) errors.line1 = "Address Line 1 is required.";
  if (!city || !city.trim()) errors.city = "City is required.";
  if (!state || !state.trim()) errors.state = "State is required.";
  if (!pincode || !pincode.trim()) {
    errors.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(pincode.trim())) {
    errors.pincode = "Must be a valid 6-digit Indian PIN code.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // Check ownership
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return { error: "Address not found or unauthorized." };
    }

    const cleanLine1 = line1.trim();
    const cleanLine2 = line2 ? line2.trim() : null;
    const cleanCity = city.trim();
    const cleanState = state.trim();
    const cleanPincode = pincode.trim();

    if (isDefault && !address.isDefault) {
      // Unset existing defaults
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Keep it default if it was default
    const shouldBeDefault = address.isDefault || isDefault;

    await prisma.address.update({
      where: { id: addressId },
      data: {
        line1: cleanLine1,
        line2: cleanLine2,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[editAddressAction] Failed to update address:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// ── Delete Address ──────────────────────────────────────────────────
export async function deleteAddressAction(addressId: string): Promise<{ success?: boolean; error?: string }> {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    return { error: "You must be logged in to delete an address." };
  }

  try {
    // Check ownership
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return { error: "Address not found or unauthorized." };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set another address as default
    if (address.isDefault) {
      const remainingAddress = await prisma.address.findFirst({
        where: { userId: user.id },
      });
      if (remainingAddress) {
        await prisma.address.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[deleteAddressAction] Failed to delete address:", error);
    return { error: "Failed to delete address." };
  }
}

// ── Set Default Address ──────────────────────────────────────────────
export async function setDefaultAddressAction(addressId: string): Promise<{ success?: boolean; error?: string }> {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    return { error: "You must be logged in to set a default address." };
  }

  try {
    // Check ownership
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return { error: "Address not found or unauthorized." };
    }

    // Unset other defaults
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[setDefaultAddressAction] Failed to set default:", error);
    return { error: "Failed to set default address." };
  }
}
