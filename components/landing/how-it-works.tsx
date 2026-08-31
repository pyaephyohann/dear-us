"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

const steps = [
  {
    number: "01",
    titleKey: "howStep1Title",
    descKey: "howStep1Desc",
    emoji: "✨",
  },
  {
    number: "02",
    titleKey: "howStep2Title",
    descKey: "howStep2Desc",
    emoji: "💌",
  },
  {
    number: "03",
    titleKey: "howStep3Title",
    descKey: "howStep3Desc",
    emoji: "🔗",
  },
  {
    number: "04",
    titleKey: "howStep4Title",
    descKey: "howStep4Desc",
    emoji: "🥰",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          className="font-handwritten text-lg text-primary"
        >
          {t("howItWorksSubtitle")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.05 }}
          className="mt-3 font-roboto text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {t("howItWorksTitle")}
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              className="group relative rounded-2xl border border-border-light bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Number */}
              <span className="font-roboto text-3xl font-bold text-primary/20 transition-colors group-hover:text-primary/40">
                {step.number}
              </span>

              {/* Emoji */}
              <p className="mt-2 text-2xl">{step.emoji}</p>

              {/* Title */}
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {t(step.titleKey)}
              </h3>

              {/* Description */}
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                {t(step.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
