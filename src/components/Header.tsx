"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LevelSelector, LevelSelectorMobile } from "./LevelSelector";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isNewsActive = pathname === "/" || pathname.startsWith("/article") || pathname.startsWith("/category");
  const isLearnActive = pathname.startsWith("/learn");
  const isTravelActive = pathname.startsWith("/travel");
  const isExploreActive = pathname.startsWith("/explore");
  const isStoriesActive = pathname.startsWith("/stories");

  return (
    <header className="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl md:text-2xl font-semibold text-forest tracking-tight"
          >
            Layered
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isNewsActive ? "text-forest" : "text-muted hover:text-forest"
              }`}
            >
              News
            </Link>
            <Link
              href="/learn"
              className={`text-sm font-medium transition-colors ${
                isLearnActive ? "text-forest" : "text-muted hover:text-forest"
              }`}
            >
              Learn
            </Link>
            <Link
              href="/travel"
              className={`text-sm font-medium transition-colors ${
                isTravelActive ? "text-forest" : "text-muted hover:text-forest"
              }`}
            >
              Travel
            </Link>
            <Link
              href="/explore"
              className={`text-sm font-medium transition-colors ${
                isExploreActive ? "text-forest" : "text-muted hover:text-forest"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/stories"
              className={`text-sm font-medium transition-colors ${
                isStoriesActive ? "text-forest" : "text-muted hover:text-forest"
              }`}
            >
              Stories
            </Link>
          </nav>

          {/* Right side - Level Selector */}
          <div className="flex items-center gap-3">
            {/* Desktop Level Selector */}
            <div className="hidden md:block">
              <LevelSelector />
            </div>

            {/* Mobile Level Selector */}
            <div className="md:hidden">
              <LevelSelectorMobile />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -mr-2 text-muted hover:text-forest"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-100">
            <div className="flex gap-6">
              <Link
                href="/"
                className={`text-sm font-medium py-2 ${
                  isNewsActive ? "text-forest" : "text-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/learn"
                className={`text-sm font-medium py-2 ${
                  isLearnActive ? "text-forest" : "text-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn
              </Link>
              <Link
                href="/travel"
                className={`text-sm font-medium py-2 ${
                  isTravelActive ? "text-forest" : "text-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Travel
              </Link>
              <Link
                href="/explore"
                className={`text-sm font-medium py-2 ${
                  isExploreActive ? "text-forest" : "text-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/stories"
                className={`text-sm font-medium py-2 ${
                  isStoriesActive ? "text-forest" : "text-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Stories
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
