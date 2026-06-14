import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>

        <p className="text-red-500 font-bold mt-2">
          ₹{price}
        </p>

        <Button className="w-full mt-4">
          Add To Cart
        </Button>
      </div>
    </Card>
  );
}