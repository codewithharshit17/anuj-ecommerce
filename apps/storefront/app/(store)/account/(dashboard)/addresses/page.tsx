/**
 * Addresses Page — `/account/addresses`
 *
 * Displays the user's saved delivery addresses.
 * Supports adding, editing, deleting, and setting a default address.
 */

import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";
import AddressesClient from "./AddressesClient";

export const metadata = {
  title: "My Addresses — Personal Marketing Store",
};

export default async function AddressesPage() {
  const user = await requireAuth("/account/addresses");

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return <AddressesClient initialAddresses={addresses} />;
}
