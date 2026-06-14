"use client";

import { useState } from "react";

export default function ProductQuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-4 mt-8">

      <button
        onClick={() =>
          setQuantity((prev) => Math.max(1, prev - 1))
        }
        className="
          border
          px-4
          py-2
          rounded
          hover:bg-gray-100
        "
      >
        -
      </button>

      <span className="font-semibold text-lg">
        {quantity}
      </span>

      <button
        onClick={() =>
          setQuantity((prev) => prev + 1)
        }
        className="
          border
          px-4
          py-2
          rounded
          hover:bg-gray-100
        "
      >
        +
      </button>

    </div>
  );
}