import { FeatureSection } from "@/components/main/FeatureSection";
import SpaceHeroSection from "@/components/main/HeroSection";

export default function Home() {
  return (
    <>
      <SpaceHeroSection className="h-screen mt-5" />
      <FeatureSection />
    </>
  );
}
