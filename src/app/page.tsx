import { AppShell } from "@/components/layout/app-shell";
import { ArchitectureSection } from "@/components/sections/architecture";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { ContactSection } from "@/components/sections/contact-cta";
import { HeroSection } from "@/components/sections/hero";
import { ValuePropsSection } from "@/components/sections/value-props";
import { getPlatformSnapshot } from "@/lib/services/status-feed";

export const revalidate = 3600;

export default async function HomePage() {
  const snapshot = await getPlatformSnapshot();

  return (
    <AppShell statusBanner={snapshot.statusBanner}>
      <HeroSection />
      <ValuePropsSection />
      <CapabilitiesSection />
      <ArchitectureSection />
      <ContactSection />
    </AppShell>
  );
}
