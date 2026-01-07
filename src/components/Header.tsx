"use client";

import Link from "next/link";
import { LevelSelector, LevelSelectorMobile } from "./LevelSelector";
import { useState } from "react";

const categories = ["World", "Culture", "Science", "Sports", "Fun"];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2 text-muted hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-ui text-xl md:text-2xl font-bold text-primary tracking-tight hover:text-primary-light transition-colors uppercase"
            style={{ letterSpacing: "0.08em" }}
          >
            Layered
          </Link>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="text-sm font-ui text-muted hover:text-primary transition-colors uppercase tracking-wider"
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Desktop Level Selector */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-muted font-ui hidden lg:inline uppercase tracking-wide">
              Level
            </span>
            <LevelSelector />
          </div>

          {/* Mobile Level Selector */}
          <div className="md:hidden">
            <LevelSelectorMobile />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    className="block px-2 py-3 text-muted hover:text-primary font-ui uppercase tracking-wider text-sm transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
