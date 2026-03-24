import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apple Design System
        apple: {
          bg: '#FFFFFF',
          'bg-secondary': '#F5F5F7',
          text: '#1D1D1F',
          'text-secondary': '#86868B',
          blue: '#0071E3',
          'blue-hover': '#0077ED',
          green: '#34C759',
          'green-hover': '#30D158',
          orange: '#FF9500',
          red: '#FF3B30',
          border: '#D2D2D7',
        },
        // Legacy colors (for backward compatibility during transition)
        ink: '#1D1D1F',
        sky: '#0071E3',
        mint: '#34C759',
        sand: '#F5F5F7',
        glow: '#FEF3C7',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        apple: '0 4px 16px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(0, 113, 227, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 113, 227, 0.4)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'shake': 'shake 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 113, 227, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 113, 227, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
