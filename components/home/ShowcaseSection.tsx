"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const showcaseItems = [
  {
    image: "/images/showcase-webapp.jpg",
    label: "Web Application",
  },
  {
    image: "/images/showcase-mobileapp.jpg",
    label: "Mobile App",
  },
  {
    image: "/images/showcase-business.jpg",
    label: "Business System",
  },
];

export const ShowcaseSection: React.FC = () => {
  return (
    <section className="relative py-6 md:py-10 overflow-hidden">
      {/* Subtle ambient glow behind the cards */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full -z-10" />

      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.4 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden border border-border bg-smoke-dark transition-all duration-500 group-hover:border-brand-orange/40 group-hover:shadow-[0_20px_60px_-15px_rgba(255,106,0,0.2)] group-hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index === 0}
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>

                {/* Bottom label bar */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/90 font-mono tracking-wide">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-400 font-mono">
                        Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
