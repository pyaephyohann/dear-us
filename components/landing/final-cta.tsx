"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32">
      {/* Decorative soft background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"
      />

      <div className="relative mx-auto max-w-lg text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="font-handwritten text-lg text-primary"
        >
          let&apos;s make something 💌
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.08 }}
          className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl"
        >
          Ready to make something little?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.16 }}
          className="mt-4 text-base text-foreground-muted sm:text-lg"
        >
          Sometimes the smallest things mean the most. 💌
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.24 }}
          className="mt-8"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
          >
            Create Your Little Thing 💕
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
