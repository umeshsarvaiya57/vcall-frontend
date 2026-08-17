export const theme = {
  colors: {
    background: "#0B0F19",
    surface: "#151D30",
    surfaceHover: "#1F2942",
    primary: "#6366F1",
    primaryHover: "#4F46E5",
    text: "#F9FAFB",
    textMuted: "#9CA3AF",
    border: "#1E293B",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },

  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    xxl: "3rem",     // 48px
  },

  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  layout: {
    maxWidth: "1200px",
    headerHeight: "4rem",
    controlSize: "3.5rem",
  },

  animation: {
    fast: "150ms ease",
    normal: "300ms ease",
    slow: "500ms ease",
  },
};

export type Theme = typeof theme;
