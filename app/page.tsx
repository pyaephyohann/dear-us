import { Navbar } from "../components/landing/navbar";
import { Hero } from "../components/landing/hero";
import { HowItWorks } from "../components/landing/how-it-works";
import { Example } from "../components/landing/example";
import { FinalCta } from "../components/landing/final-cta";
import { Footer } from "../components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Example />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
