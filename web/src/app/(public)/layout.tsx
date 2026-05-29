import { PublicAnalyticsScripts } from "@/components/analytics/public-analytics-scripts";
import { PublicShell } from "@/components/layout/public-shell";
import { MotionProvider } from "@/components/motion/motion-provider";
import { PublicRouteTransition } from "@/components/motion/public-route-transition";
import { getCachedPublicNavigation, visibleNavItems } from "@/lib/navigation/public-data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getCachedPublicNavigation();
  return (
    <MotionProvider>
      <PublicShell
        navItems={visibleNavItems(navigation.navItems)}
        footerLinks={visibleNavItems(navigation.footerLinks)}
      >
        <PublicRouteTransition>{children}</PublicRouteTransition>
        <PublicAnalyticsScripts />
      </PublicShell>
    </MotionProvider>
  );
}
