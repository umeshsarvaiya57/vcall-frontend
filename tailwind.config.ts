import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#0B0F19",
        bgSurface: "#151D30",
        bgSurfaceHover: "#1F2942",
        primary: "#6366F1",
        primaryHover: "#4F46E5",
        textLight: "#F9FAFB",
        textMuted: "#9CA3AF",
        borderDark: "#1E293B",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} satisfies Config
