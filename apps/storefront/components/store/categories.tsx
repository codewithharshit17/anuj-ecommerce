import { Card } from "@/components/ui/card";

const categories = [
  "Pens",
  "Notebooks",
  "Art Supplies",
  "Markers",
];

export default function Categories() {
  return (
    <section className="container mx-auto px-4 py-12">

      <h2 className="text-3xl font-bold mb-6">
        Shop By Category
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        {categories.map((category) => (
          <Card
            key={category}
            className="p-8 text-center cursor-pointer hover:shadow-lg"
          >
            {category}
          </Card>
        ))}

      </div>

    </section>
  );
}