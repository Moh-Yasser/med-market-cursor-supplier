import { DashboardContent } from "@/components/supplier-dashboard/dashboard-content"
import { DASHBOARD_KEYS } from "@/lib/dashboard/dashboard-keys";
import { getDashboardData } from "@/lib/dashboard/dashboard.server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: DASHBOARD_KEYS.all,
    queryFn: getDashboardData,
  });
  
  return <HydrationBoundary state={dehydrate(queryClient)}>
    <DashboardContent />
  </HydrationBoundary>
}


