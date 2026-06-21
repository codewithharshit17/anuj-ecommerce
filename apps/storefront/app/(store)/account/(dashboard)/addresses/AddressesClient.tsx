"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Plus, Home, Star, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import {
  addAddressAction,
  editAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  AddressFormState,
} from "@/lib/actions/address";

interface Address {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressesClientProps {
  initialAddresses: Address[];
}

export default function AddressesClient({ initialAddresses }: AddressesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Form states and handlers
  const [addState, setAddState] = useState<AddressFormState>({});
  const [addIsPending, setAddIsPending] = useState(false);

  const [editState, setEditState] = useState<AddressFormState>({});
  const [editIsPending, setEditIsPending] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await addAddressAction(addState, formData);
      if (result.success) {
        setIsAdding(false);
        setAddState({});
        if (returnTo) {
          router.push(returnTo);
        } else {
          window.location.reload();
        }
      } else {
        setAddState(result);
      }
    } catch (err) {
      console.error(err);
      setAddState({ error: "Failed to add address." });
    } finally {
      setAddIsPending(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    setEditIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await editAddressAction(editingId, editState, formData);
      if (result.success) {
        setEditingId(null);
        setEditState({});
        if (returnTo) {
          router.push(returnTo);
        } else {
          window.location.reload();
        }
      } else {
        setEditState(result);
      }
    } catch (err) {
      console.error(err);
      setEditState({ error: "Failed to edit address." });
    } finally {
      setEditIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setDeletingId(id);
      try {
        const res = await deleteAddressAction(id);
        if (res.success) {
          if (returnTo) {
            router.push(returnTo);
          } else {
            window.location.reload();
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      const res = await setDefaultAddressAction(id);
      if (res.success) {
        if (returnTo) {
          router.push(returnTo);
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-h2 text-[var(--ag-dark)] tracking-tight">
            My Addresses
          </h2>
          <p className="text-sm text-[var(--ag-gray-500)] mt-1">
            Manage your delivery addresses
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Plus size={14} />
            Add Address
          </button>
        )}
      </div>

      {/* Grid of Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ADD ADDRESS CARD FORM */}
        {isAdding && (
          <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-red)]/30 ring-1 ring-[var(--ag-red)]/10 rounded-2xl p-5 shadow-md flex flex-col gap-4 animate-scaleIn">
            <h3 className="font-bold text-sm text-[var(--ag-dark)] border-b border-[var(--ag-gray-200)]/50 pb-2">
              New Address
            </h3>
            
            {addState.error && (
              <div className="text-xs font-semibold text-[var(--ag-red)] bg-[var(--ag-red)]/8 p-2 rounded-lg border border-[var(--ag-red)]/15">
                {addState.error}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <AddressFormFields state={addState} isPending={addIsPending} showDefault={initialAddresses.length > 0} />
              
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={addIsPending}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-xs py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {addIsPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save
                </button>
                <button
                  type="button"
                  disabled={addIsPending}
                  onClick={() => setIsAdding(false)}
                  className="inline-flex items-center justify-center gap-1.5 border border-[var(--ag-gray-200)] dark:border-neutral-800 text-[var(--ag-gray-800)] dark:text-gray-300 font-bold text-xs px-3 py-2 rounded-xl hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <X size={12} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CURRENT ADDRESS CARDS */}
        {initialAddresses.map((address) => {
          const isEditing = editingId === address.id;

          if (isEditing) {
            return (
              <div
                key={address.id}
                className="bg-white dark:bg-[var(--card)] border border-[var(--ag-red)]/35 ring-1 ring-[var(--ag-red)]/10 rounded-2xl p-5 shadow-md flex flex-col gap-4 animate-scaleIn"
              >
                <h3 className="font-bold text-sm text-[var(--ag-dark)] border-b border-[var(--ag-gray-200)]/50 pb-2">
                  Edit Address
                </h3>

                {editState.error && (
                  <div className="text-xs font-semibold text-[var(--ag-red)] bg-[var(--ag-red)]/8 p-2 rounded-lg border border-[var(--ag-red)]/15">
                    {editState.error}
                  </div>
                )}

                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <AddressFormFields
                    state={editState}
                    isPending={editIsPending}
                    address={address}
                    showDefault={!address.isDefault}
                  />

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={editIsPending}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-xs py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {editIsPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={editIsPending}
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center justify-center gap-1.5 border border-[var(--ag-gray-200)] dark:border-neutral-800 text-[var(--ag-gray-800)] dark:text-gray-300 font-bold text-xs px-3 py-2 rounded-xl hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            );
          }

          return (
            <div
              key={address.id}
              className={`bg-white dark:bg-[var(--card)] border rounded-2xl p-5 shadow-sm relative flex flex-col justify-between min-h-[160px] ${
                address.isDefault
                  ? "border-[var(--ag-red)]/30 ring-1 ring-[var(--ag-red)]/10"
                  : "border-[var(--ag-gray-200)] dark:border-neutral-850"
              }`}
            >
              {/* Default badge */}
              {address.isDefault && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold text-[var(--ag-red)] bg-[var(--ag-red)]/8 px-2 py-0.5 rounded-md">
                  <Star size={10} className="fill-current" />
                  Default
                </div>
              )}

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center shrink-0 mt-0.5">
                  <Home size={16} className="text-[var(--ag-gray-500)]" />
                </div>
                <div className="min-w-0 pr-12">
                  <p className="text-sm font-semibold text-[var(--ag-dark)]">
                    {address.line1}
                  </p>
                  {address.line2 && (
                    <p className="text-xs text-[var(--ag-gray-500)] mt-0.5">
                      {address.line2}
                    </p>
                  )}
                  <p className="text-xs text-[var(--ag-gray-500)] mt-0.5">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>
              </div>

              {/* Action buttons row */}
              <div className="flex items-center justify-between border-t border-[var(--ag-gray-200)]/50 dark:border-neutral-800/50 pt-3.5 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(address.id)}
                    className="p-1.5 rounded-lg hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-gray-500)] hover:text-[var(--ag-dark)] transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--ag-gray-500)] hover:text-[var(--ag-red)] transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Address"
                  >
                    {deletingId === address.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={settingDefaultId === address.id}
                    className="text-[10px] font-bold text-[var(--ag-red)] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {settingDefaultId === address.id && (
                      <Loader2 size={10} className="animate-spin" />
                    )}
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {!isAdding && initialAddresses.length === 0 && (
        <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-[var(--ag-gray-500)]" />
          </div>
          <h3 className="font-bold text-base text-[var(--ag-dark)] mb-1">
            No addresses saved
          </h3>
          <p className="text-sm text-[var(--ag-gray-500)] mb-6 max-w-xs mx-auto">
            Add a delivery address to speed up your checkout process.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <Plus size={16} />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
}

// Helper form fields component
function AddressFormFields({
  state,
  isPending,
  address,
  showDefault = true,
}: {
  state: AddressFormState;
  isPending: boolean;
  address?: Address;
  showDefault?: boolean;
}) {
  return (
    <div className="space-y-2 text-left">
      {/* Line 1 */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
          Address Line 1
        </label>
        <input
          name="line1"
          type="text"
          defaultValue={address?.line1 || ""}
          required
          disabled={isPending}
          placeholder="House No, Building, Street"
          className="w-full px-3 py-2 rounded-xl border border-[var(--ag-gray-200)] dark:border-[var(--border)] bg-white dark:bg-transparent text-xs font-semibold text-[var(--ag-dark)] placeholder:text-[var(--ag-gray-500)] focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
        />
        {state.errors?.line1 && (
          <span className="text-[9px] font-semibold text-[var(--ag-red)] mt-0.5">
            {state.errors.line1}
          </span>
        )}
      </div>

      {/* Line 2 */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
          Address Line 2 (Optional)
        </label>
        <input
          name="line2"
          type="text"
          defaultValue={address?.line2 || ""}
          disabled={isPending}
          placeholder="Apartment, Suite, Locality"
          className="w-full px-3 py-2 rounded-xl border border-[var(--ag-gray-200)] dark:border-[var(--border)] bg-white dark:bg-transparent text-xs font-semibold text-[var(--ag-dark)] placeholder:text-[var(--ag-gray-500)] focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* City */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
            City
          </label>
          <input
            name="city"
            type="text"
            defaultValue={address?.city || ""}
            required
            disabled={isPending}
            placeholder="Mumbai"
            className="w-full px-3 py-2 rounded-xl border border-[var(--ag-gray-200)] dark:border-[var(--border)] bg-white dark:bg-transparent text-xs font-semibold text-[var(--ag-dark)] placeholder:text-[var(--ag-gray-500)] focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
          />
          {state.errors?.city && (
            <span className="text-[9px] font-semibold text-[var(--ag-red)] mt-0.5">
              {state.errors.city}
            </span>
          )}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
            State
          </label>
          <input
            name="state"
            type="text"
            defaultValue={address?.state || ""}
            required
            disabled={isPending}
            placeholder="Maharashtra"
            className="w-full px-3 py-2 rounded-xl border border-[var(--ag-gray-200)] dark:border-[var(--border)] bg-white dark:bg-transparent text-xs font-semibold text-[var(--ag-dark)] placeholder:text-[var(--ag-gray-500)] focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
          />
          {state.errors?.state && (
            <span className="text-[9px] font-semibold text-[var(--ag-red)] mt-0.5">
              {state.errors.state}
            </span>
          )}
        </div>
      </div>

      {/* Pincode */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
          Pincode
        </label>
        <input
          name="pincode"
          type="text"
          defaultValue={address?.pincode || ""}
          required
          disabled={isPending}
          placeholder="400001"
          maxLength={6}
          className="w-full px-3 py-2 rounded-xl border border-[var(--ag-gray-200)] dark:border-[var(--border)] bg-white dark:bg-transparent text-xs font-semibold text-[var(--ag-dark)] placeholder:text-[var(--ag-gray-500)] focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
        />
        {state.errors?.pincode && (
          <span className="text-[9px] font-semibold text-[var(--ag-red)] mt-0.5">
            {state.errors.pincode}
          </span>
        )}
      </div>

      {/* Default checkbox */}
      {showDefault && (
        <div className="flex items-center gap-2 pt-1">
          <input
            id={`default-chk-${address?.id || "new"}`}
            name="isDefault"
            type="checkbox"
            value="true"
            defaultChecked={address?.isDefault || false}
            disabled={isPending}
            className="h-3.5 w-3.5 rounded border-[var(--ag-gray-200)] text-[var(--ag-red)] accent-[var(--ag-red)] cursor-pointer disabled:opacity-50"
          />
          <label
            htmlFor={`default-chk-${address?.id || "new"}`}
            className="text-xs text-[var(--ag-gray-500)] font-medium cursor-pointer select-none disabled:opacity-50"
          >
            Set as default delivery address
          </label>
        </div>
      )}
    </div>
  );
}
