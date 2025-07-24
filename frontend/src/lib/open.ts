import { goto } from "$app/navigation";

export default async function editImage(path: string) {
  await goto(`/${encodeURIComponent(path)}`);
}

