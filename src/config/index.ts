/**
 * Application configuration.
 * Centralizes application-wide settings and constants.
 */
export const siteConfig = {
  name: 'Hec-e-Portal',
  description:
    'Enterprise Higher Education Commission Student & Administrative Portal',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  links: {
    github: 'https://github.com/example/hec-e-portal',
  },
} as const;

export type SiteConfig = typeof siteConfig;
