"use client";

import { useCartStore } from "@/lib/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="
                  border
                  rounded-lg
                  p-4
                  flex
                  items-center
                  gap-4
                "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-24
                    h-24
                    object-cover
                    rounded
                  "
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {item.name}
                  </h2>

                  <p className="text-red-500 font-bold">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      className="
                        border
                        px-3
                        py-1
                        rounded
                        hover:bg-gray-100
                      "
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      className="
                        border
                        px-3
                        py-1
                        rounded
                        hover:bg-gray-100
                      "
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="
                      mt-3
                      text-red-500
                      hover:text-red-700
                      text-sm
                      font-medium
                    "
                  >
                    Remove Item
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t pt-6">
            <h2 className="text-2xl font-bold">
              Total: ₹{total}
            </h2>

            <button
              className="
                mt-4
                bg-red-500
                hover:bg-red-600
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >
              Proceed To Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}