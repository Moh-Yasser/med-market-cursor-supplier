export const DASHBOARD_KEYS={
     all:['dashboard'] as const,
     specific:(id:number)=>['dashboard',id] as const,
} as const;
