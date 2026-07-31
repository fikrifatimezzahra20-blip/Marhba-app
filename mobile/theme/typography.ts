export const typography = {
  fontFamily: "System", // Hanken Grotesk / System fallback
  fontSize: {
    xs: 12,
    sm: 14, // label-md
    md: 16, // body-md
    lg: 18, // body-lg
    xl: 24, // headline-md
    xxl: 28, // headline-lg-mobile
    hero: 32, // headline-lg
    display: 36,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    labelMd: 20,
    bodyMd: 24,
    bodyLg: 28,
    headlineMd: 32,
    headlineLgMobile: 36,
    headlineLg: 40,
  },
};

