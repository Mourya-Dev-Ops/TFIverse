'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Heroes', href: '/heroes' },
    { label: 'Movies', href: '/movies' },
    { label: 'Box Office', href: '/box-office' },
    { label: 'Awards', href: '/awards' },
  ];

  const communityLinks = [
    { label: 'Memes', href: '/memes' },
    { label: 'Games', href: '/games' },
    { label: 'Watch Party', href: '/watchparty' },
    { label: 'Fan Gallery', href: '/fan-gallery' },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-black/50 backdrop-blur-xl px-4 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Grid - CINEMA SILVER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h1 className="text-3xl font-black">
                <span className="text-white">TFi</span>
                <span className="text-white/70">verse</span>
              </h1>
              <motion.div
                className="mt-2 h-1 bg-white/40 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '60px' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Your ultimate destination for Telugu Film Industry content, community, and entertainment.
            </p>
          </motion.div>

          {/* Explore Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-6 text-lg">Explore</h4>
            <div className="space-y-3">
              {footerLinks.map((link, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="block text-white/60 hover:text-white text-sm transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Community Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-6 text-lg">Community</h4>
            <div className="space-y-3">
              {communityLinks.map((link, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="block text-white/60 hover:text-white text-sm transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links - CINEMA SILVER */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-6 text-lg">Follow Us</h4>
            <div className="flex gap-4 flex-wrap">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200 group"
                    >
                      <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider - CINEMA SILVER */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/[0.06] origin-left"
        />

        {/* Bottom Bar - CINEMA SILVER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <motion.p variants={itemVariants} className="text-white/50 text-xs text-center md:text-left font-light">
            © {currentYear} TFiverse. All rights reserved. Made with{' '}
            <span className="text-white/70">❤️</span>
            {' '}for Telugu Cinema
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex gap-6 text-white/50 text-xs font-medium">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Contact', href: '/contact' },
            ].map((link, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
