import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import classicCoffee from "@/assets/classic-coffee.png";
import aromaCoffee from "@/assets/aroma-coffee.png";
import blackCoffee from "@/assets/black-coffee.png";
import creamCoffee from "@/assets/cream-coffee.png";

const Index = () => {
  const products = [
    {
      id: 1,
      name: "GALLA CLASSIC",
      subtitle: "Espresso Italiano",
      image: classicCoffee,
      description: "A perfectly balanced blend with rich, full-bodied flavor and a smooth finish. Perfect for traditional espresso lovers.",
      accentColor: "hsl(var(--classic-blue))",
    },
    {
      id: 2,
      name: "GALLA AROMA",
      subtitle: "Espresso Italiano",
      image: aromaCoffee,
      description: "Premium Colombian beans create an aromatic experience with subtle notes of caramel and chocolate. Indulgent and sophisticated.",
      accentColor: "hsl(var(--aroma-gold))",
    },
    {
      id: 3,
      name: "GALLA PREMIUM BLACK",
      subtitle: "Espresso Italiano",
      image: blackCoffee,
      description: "The ultimate dark roast with intense, bold flavors. For those who demand the strongest, most distinctive coffee experience.",
      accentColor: "hsl(var(--black-premium))",
    },
    {
      id: 4,
      name: "GALLA CREAM",
      subtitle: "Espresso Italiano",
      image: creamCoffee,
      description: "Smooth and creamy profile with delicate sweetness. Expertly crafted for cappuccino and latte preparations.",
      accentColor: "hsl(var(--cream-green))",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-foreground">Coffee Products</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                subtitle={product.subtitle}
                description={product.description}
                accentColor={product.accentColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section - keeping placeholder for other sections */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-foreground">About Galla Espresso</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Galla espresso presents eleven years experience in producing mixed coffee from selected, top quality varieties of raw coffee.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With application of high standards of quality control and the latest technology in the production and roasting process, through mixture of seven different types of green coffee, we have achieved a distinctive recipe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
