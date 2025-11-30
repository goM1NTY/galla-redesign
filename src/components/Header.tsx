import { Coffee } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8" />
            <span className="text-3xl font-bold italic tracking-wide">Galla</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#history"
              className="text-sm uppercase tracking-wider font-medium hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-foreground after:transition-all hover:after:w-full"
            >
              History of Coffee
            </a>
            <a
              href="#about"
              className="text-sm uppercase tracking-wider font-medium hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-foreground after:transition-all hover:after:w-full"
            >
              About Us
            </a>
            <a
              href="#products"
              className="text-sm uppercase tracking-wider font-medium hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-foreground after:transition-all hover:after:w-full"
            >
              Galla Espresso
            </a>
            <a
              href="#premium"
              className="text-sm uppercase tracking-wider font-medium hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-foreground after:transition-all hover:after:w-full"
            >
              Black Premium
            </a>
            <a
              href="#maintenance"
              className="text-sm uppercase tracking-wider font-medium hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-foreground after:transition-all hover:after:w-full"
            >
              Maintenance
            </a>
            <a
              href="#contact"
              className="text-sm uppercase tracking-wider font-medium hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-foreground after:transition-all hover:after:w-full"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
