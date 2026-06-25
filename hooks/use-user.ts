import { getMe } from "@/lib/api/auth";
import { MeApiResponse } from "@/types/auth";
import { SupplierApiResponse } from "@/types/company";
import { useQuery } from "@tanstack/react-query";


export function  useUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: Infinity,
    retry: false,
  });
 
}