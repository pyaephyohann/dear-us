"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LittleThingPreview } from "./little-thing-preview";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
      {/* Decorative soft blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left — copy */}
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-handwritten text-xl text-primary sm:text-2xl"
          >
            for you, for us 💕
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            A tiny little thing
            <br />
            for someone you love.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 max-w-md text-base leading-relaxed text-foreground-muted sm:text-lg lg:mx-0 mx-auto"
          >
            Create a sweet little experience, fill it with questions only they
            can answer, and send it their way. 💌
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center"
          >
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
            >
              Create Your Little Thing 💕
            </Link>

            <Link
              href="#example"
              className="text-sm text-foreground-subtle transition-colors hover:text-primary"
            >
              Already have one? Open it
            </Link>
          </motion.div>
        </div>

        {/* Right — preview card */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex-shrink-0"
        >
          <div className="relative">
            {/* Subtle floating animation wrapper */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LittleThingPreview currentQuestion={0} />
            </motion.div>

            {/* Decorative floating heart */}
            <motion.span
              aria-hidden
              className="absolute -top-4 -right-3 text-2xl"
              animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              💕
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
