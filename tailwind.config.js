/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        '2xl': '1360px',
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        forest: {
          50: "#f2f7f4",
          100: "#e1ede5",
          200: "#c4dcce",
          300: "#9ec2af",
          400: "#70a28b",
          500: "#4d846d",
          600: "#386a55",
          700: "#2d5444",
          800: "#244337",
          900: "#1b372c",
          950: "#0e1f18",
        },
        sand: {
          50: "#faf8f5",
          100: "#f4f0e8",
          200: "#e8e1d5",
          300: "#d9cec0",
          400: "#c2b29e",
          500: "#a9947d",
          600: "#917c67",
          700: "#756252",
          800: "#605044",
          900: "#4f433b",
        },
        clay: {
          50: "#fdf6f3",
          100: "#fbebe5",
          200: "#f6d5ca",
          300: "#eeb5a2",
          400: "#e18a70",
          500: "#d26546",
          600: "#b94d30",
          700: "#973c24",
          800: "#7d3321",
          900: "#662c1e",
        },
        ivory: {
          50: "#ffffff",
          100: "#fdfdfc",
          200: "#faf8f5",
          300: "#f5f1ea",
          400: "#eee7dc",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Newsreader'", "Georgia", "serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(27, 55, 44, 0.04), 0 1px 3px 0 rgba(27, 55, 44, 0.03)",
        card: "0 2px 8px -2px rgba(27, 55, 44, 0.06), 0 1px 4px -1px rgba(27, 55, 44, 0.03)",
        elevated: "0 10px 25px -5px rgba(27, 55, 44, 0.08), 0 8px 10px -6px rgba(27, 55, 44, 0.04)",
      },
    },
  },
  plugins: [],
}
