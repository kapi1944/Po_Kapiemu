export function kluczGlosow(projectSlug: string, userId: string) {
  return `pk-project-polls-v2:${projectSlug}:${userId}`;
}

export function obliczProcent(glosy: number, suma: number) {
  return suma > 0 ? Math.round(glosy / suma * 100) : 0;
}
