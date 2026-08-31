import { prisma } from "@/lib/prisma";
import GalleryManager from "@/components/admin/gallery-manager";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Gallery / Portfolio Manager</h1>
        <p className="text-sm text-ink-700/60">Upload, reorder, tag, and publish photos to the public portfolio section.</p>
      </div>
      <GalleryManager items={items} />
    </div>
  );
}
