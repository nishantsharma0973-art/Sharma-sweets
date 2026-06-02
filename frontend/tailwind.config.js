/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                fontFamily: {
                    heading: ['"Cormorant Garamond"', 'serif'],
                    body: ['Outfit', 'sans-serif'],
                },
                colors: {
                        cream: { DEFAULT: '#FDFBF7', alt: '#FAF8F5' },
                        saffron: { DEFAULT: '#E87A00', hover: '#CC6B00' },
                        maroon: { DEFAULT: '#800000', hover: '#660000', deep: '#3E0F15' },
                        gold: { DEFAULT: '#D4AF37', soft: 'rgba(212, 175, 55, 0.3)' },
                        ink: '#2C2C2C',
                        muted2: '#7A7A7A',
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
                        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
                        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
                        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
                        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
                        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
                        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                },
                borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
                keyframes: {
                    'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
                    'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
                    'fade-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                    'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
                },
                animation: {
                    'accordion-down': 'accordion-down 0.2s ease-out',
                    'accordion-up': 'accordion-up 0.2s ease-out',
                    'fade-up': 'fade-up 0.7s ease-out forwards',
                    'shimmer': 'shimmer 3s linear infinite',
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
