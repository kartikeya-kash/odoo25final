import React from 'react';
import Icon from '../AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'QuickCourt',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' }
      ]
    },
    {
      title: 'For Users',
      links: [
        { label: 'Find Venues', href: '/venues-listing' },
        { label: 'My Bookings', href: '/my-bookings' },
        { label: 'User Guide', href: '/user-guide' },
        { label: 'Mobile App', href: '/mobile-app' }
      ]
    },
    {
      title: 'For Venues',
      links: [
        { label: 'List Your Venue', href: '/register' },
        { label: 'Venue Dashboard', href: '/facility-owner-dashboard' },
        { label: 'Pricing Plans', href: '/pricing' },
        { label: 'Venue Guide', href: '/venue-guide' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Report Issue', href: '/report' },
        { label: 'Safety Guidelines', href: '/safety' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' }
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} className="text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">QuickCourt</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                The easiest way to book sports venues. Find, book, and play at your favorite courts instantly.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.name}
                    href={social?.href}
                    className="w-9 h-9 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social?.name}
                  >
                    <Icon name={social?.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections?.map((section) => (
              <div key={section?.title}>
                <h3 className="font-semibold text-foreground mb-4">
                  {section?.title}
                </h3>
                <ul className="space-y-3">
                  {section?.links?.map((link) => (
                    <li key={link?.label}>
                      <a
                        href={link?.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-muted-foreground text-sm">
                Get the latest updates on new venues and special offers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground text-sm mb-4 md:mb-0">
              <span>&copy; {currentYear} QuickCourt. All rights reserved.</span>
              <span className="hidden sm:inline mx-2">•</span>
              <div className="flex space-x-4 mt-2 sm:mt-0">
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="/cookies" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <Icon name="MapPin" size={16} />
              <span>Made with ❤️ for sports enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;