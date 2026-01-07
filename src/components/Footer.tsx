"use client";

import Link from "next/link";
import { useState } from "react";

const discoverLinks = [
  { label: "World", href: "/category/world" },
  { label: "Culture", href: "/category/culture" },
  { label: "Science", href: "/category/science" },
  { label: "Sports", href: "/category/sports" },
  { label: "Fun", href: "/category/fun" },
];

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "For Teachers", href: "/teachers" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-cream-dark border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Newsletter Signup */}
          <div>
            <h3 className="font-display text-xl italic text-gray-900 mb-4">
              Stay connected to Layered
            </h3>
            {subscribed ? (
              <p className="text-sm text-correct font-ui">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-ui focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                  aria-label="Subscribe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-xs font-ui font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Discover
            </h4>
            <ul className="space-y-2">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-ui text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-ui font-semibold uppercase tracking-wider text-gray-500 mb-4">
              About
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-ui text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500 font-ui text-center">
            © {new Date().getFullYear()} Layered · Learn English through the news
          </p>
        </div>
      </div>
    </footer>
  );
}
