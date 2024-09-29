export type TSiteInfo = typeof siteInfo
export type TNavItem = typeof siteInfo.navItems
export const siteInfo = {
  name: 'Capture Web Content',
  description: 'Capture web content as image, PDF, or HTML.',
  authors: {
    url: 'https://fb.com/wildan',
    name: 'Mohammad Wildan',
  },
  generator: 'Capture Web Content',
  navItems: [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact', href: '/contact' },
    { name: 'Others', href: '/others' },
  ],
}
