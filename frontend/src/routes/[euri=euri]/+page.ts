import type { PageLoad, PageData } from "./$types";
import Engine from "$lib/engine";

export const load: PageLoad = async ({ params }): Promise<{
  error: string | null, enginePromise: Promise<number> | null
}> => {
  try {
    var file = decodeURIComponent(params.euri);
  } catch (e: any) {
    return {
      error: e.toString(),
      enginePromise: null,
    };
  }
  const enginePromise = Engine.getOrCreate(file);
  return {
    error: null,
    enginePromise,
  };
}

