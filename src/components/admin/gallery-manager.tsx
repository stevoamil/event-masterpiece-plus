"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, Eye, EyeOff, Upload, FolderPlus, Images, X } from "lucide-react";
import { serviceCategories } from "@/lib/services-data";

export type GalleryItemDTO = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  order: number;
  published: boolean;
};

type Folder = {
  title: string;
  category: string;
  photos: GalleryItemDTO[];
};

// The registered categories, matching the public Services section — always shown in
// the dropdown regardless of whether any photos exist yet for a given category.
const categories = serviceCategories.map((s) => s.en.name);

function groupIntoFolders(items: GalleryItemDTO[]): Folder[] {
  const map = new Map<string, Folder>();
  for (const item of items) {
    if (!map.has(item.title)) {
      map.set(item.title, { title: item.title, category: item.category, photos: [] });
    }
    map.get(item.title)!.photos.push(item);
  }
  return Array.from(map.values())
    .map((f) => ({ ...f, photos: [...f.photos].sort((a, b) => a.order - b.order) }))
    .sort((a, b) => Math.min(...a.photos.map((p) => p.order)) - Math.min(...b.photos.map((p) => p.order)));
}

export default function GalleryManager({ items: initial }: { items: GalleryItemDTO[] }) {
  const [items, setItems] = useState([...initial].sort((a, b) => a.order - b.order));

  const [folderName, setFolderName] = useState("");
  const [folderCategory, setFolderCategory] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderFiles, setFolderFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [savingFolder, setSavingFolder] = useState(false);

  const [openFolderTitle, setOpenFolderTitle] = useState<string | null>(null);
  const [addFiles, setAddFiles] = useState<File[]>([]);
  const [addDragActive, setAddDragActive] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);

  const selectedFolderCategory = folderCategory || categories[0] || "";
  const folders = groupIntoFolders(items);
  const openFolder = folders.find((f) => f.title === openFolderTitle) ?? null;

  const togglePublish = async (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, published: !it.published } : it)));
    const item = items.find((it) => it.id === id);
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item?.published }),
    });
  };

  const removePhoto = async (id: string) => {
    if (!confirm("Remove this photo from the folder?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
  };

  const movePhotoInFolder = async (folder: Folder, index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= folder.photos.length) return;
    const a = folder.photos[index];
    const b = folder.photos[target];
    setItems((prev) => prev.map((it) => (it.id === a.id ? { ...it, order: b.order } : it.id === b.id ? { ...it, order: a.order } : it)));
    await Promise.all([
      fetch(`/api/admin/gallery/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/admin/gallery/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
    ]);
  };

  const deleteFolder = async (folder: Folder) => {
    if (!confirm(`Delete the "${folder.title}" folder and all ${folder.photos.length} photo(s) in it?`)) return;
    const ids = folder.photos.map((p) => p.id);
    setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
    if (openFolderTitle === folder.title) setOpenFolderTitle(null);
    await Promise.all(ids.map((id) => fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })));
  };

  const createFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim() || !selectedFolderCategory) return;
    setFolderOpen(true);
  };

  const addFolderFiles = (fileList: FileList | File[]) => {
    const imagesOnly = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    setFolderFiles((prev) => [...prev, ...imagesOnly]);
  };

  const removeFolderFile = (index: number) => {
    setFolderFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const closeFolder = () => {
    setFolderOpen(false);
    setFolderFiles([]);
    setFolderName("");
  };

  const uploadAndCreate = async (title: string, category: string, files: File[]) => {
    const created: GalleryItemDTO[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/admin/gallery/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error("upload failed");
      const { url } = await uploadRes.json();

      const createRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, imageUrl: url }),
      });
      created.push(await createRes.json());
    }
    return created;
  };

  const saveFolder = async () => {
    if (folderFiles.length === 0) return;
    setSavingFolder(true);
    try {
      const created = await uploadAndCreate(folderName.trim(), selectedFolderCategory, folderFiles);
      setItems((prev) => [...prev, ...created]);
      closeFolder();
    } catch {
      alert("Some photos failed to upload. Please try again.");
    } finally {
      setSavingFolder(false);
    }
  };

  const addFilesToFolder = (fileList: FileList | File[]) => {
    const imagesOnly = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    setAddFiles((prev) => [...prev, ...imagesOnly]);
  };

  const removeAddFile = (index: number) => {
    setAddFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const saveAddedPhotos = async () => {
    if (!openFolder || addFiles.length === 0) return;
    setSavingAdd(true);
    try {
      const created = await uploadAndCreate(openFolder.title, openFolder.category, addFiles);
      setItems((prev) => [...prev, ...created]);
      setAddFiles([]);
    } catch {
      alert("Some photos failed to upload. Please try again.");
    } finally {
      setSavingAdd(false);
    }
  };

  if (openFolder) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => {
            setOpenFolderTitle(null);
            setAddFiles([]);
          }}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-ink-700/70 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to folders
        </button>

        <div>
          <h2 className="font-display text-xl italic text-ink-900">{openFolder.title}</h2>
          <p className="text-sm text-ink-700/50">
            {openFolder.category} · {openFolder.photos.length} photo{openFolder.photos.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {openFolder.photos.map((item, i) => (
            <div key={item.id} className="overflow-hidden rounded-lg border border-ink-900/10 bg-beige-100">
              <div className="relative h-36 w-full">
                <Image src={item.imageUrl} alt={item.title} fill sizes="25vw" className="object-cover" />
                {!item.published && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-900/50 text-[10px] uppercase tracking-wide text-beige-100">
                    Hidden
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="flex gap-1">
                  <button onClick={() => movePhotoInFolder(openFolder, i, -1)} disabled={i === 0} className="rounded border border-ink-900/15 p-1 disabled:opacity-30">
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => movePhotoInFolder(openFolder, i, 1)}
                    disabled={i === openFolder.photos.length - 1}
                    className="rounded border border-ink-900/15 p-1 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => togglePublish(item.id)} className="rounded border border-ink-900/15 p-1">
                    {item.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>
                  <button onClick={() => removePhoto(item.id)} className="rounded border border-ink-900/15 p-1 text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setAddDragActive(true);
          }}
          onDragLeave={() => setAddDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setAddDragActive(false);
            addFilesToFolder(e.dataTransfer.files);
          }}
          className={`rounded-lg border-2 border-dashed p-6 transition ${
            addDragActive ? "border-brass-500 bg-brass-500/5" : "border-ink-900/20 bg-beige-50"
          }`}
        >
          <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-ink-900/10 bg-white py-8 text-center text-sm text-ink-700/60">
            <Upload className="h-5 w-5 text-brass-500" />
            Drag more photos here, or click to browse
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFilesToFolder(e.target.files)}
            />
          </label>

          {addFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {addFiles.map((file, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-ink-900/10">
                  {/* eslint-disable-next-line @next/next/no-img-element -- transient local File objects, not a next/image-managed asset */}
                  <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAddFile(i)}
                    aria-label={`Remove ${file.name}`}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={saveAddedPhotos}
              disabled={savingAdd || addFiles.length === 0}
              className="rounded-full bg-brass-500 px-5 py-2 text-xs font-medium uppercase tracking-widest2 text-ink-900 disabled:opacity-50"
            >
              {savingAdd ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={createFolder} className="flex flex-wrap items-end gap-3 rounded-lg border border-ink-900/15 bg-beige-100 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900">Folder Name</label>
          <input
            required
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="rounded border border-ink-900/20 bg-beige-50 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-700/50">Category</label>
          <select
            value={selectedFolderCategory}
            onChange={(e) => setFolderCategory(e.target.value)}
            className="rounded border border-ink-900/20 bg-beige-50 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full border-2 border-brass-500 px-4 py-2 text-sm font-medium text-brass-500 transition hover:bg-brass-500 hover:text-ink-900"
        >
          <FolderPlus className="h-4 w-4" />
          Create Folder
        </button>
      </form>

      {folderOpen && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            addFolderFiles(e.dataTransfer.files);
          }}
          className={`rounded-lg border-2 border-dashed p-6 transition ${
            dragActive ? "border-brass-500 bg-brass-500/5" : "border-ink-900/20 bg-beige-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-900">
              {folderName} <span className="text-ink-700/50">— {selectedFolderCategory}</span>
            </p>
            <button type="button" onClick={closeFolder} aria-label="Cancel folder" className="text-ink-700/50 hover:text-ink-900">
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="mt-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-ink-900/10 bg-white py-8 text-center text-sm text-ink-700/60">
            <Upload className="h-5 w-5 text-brass-500" />
            Drag photos here, or click to browse
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFolderFiles(e.target.files)}
            />
          </label>

          {folderFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {folderFiles.map((file, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-ink-900/10">
                  {/* eslint-disable-next-line @next/next/no-img-element -- transient local File objects, not a next/image-managed asset */}
                  <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFolderFile(i)}
                    aria-label={`Remove ${file.name}`}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={saveFolder}
              disabled={savingFolder || folderFiles.length === 0}
              className="rounded-full bg-brass-500 px-5 py-2 text-xs font-medium uppercase tracking-widest2 text-ink-900 disabled:opacity-50"
            >
              {savingFolder ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {folders.map((folder) => (
          <div
            key={folder.title}
            role="button"
            tabIndex={0}
            onClick={() => setOpenFolderTitle(folder.title)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpenFolderTitle(folder.title);
              }
            }}
            className="group cursor-pointer overflow-hidden rounded-lg border border-ink-900/10 bg-beige-100 text-left"
          >
            <div className="relative h-36 w-full">
              <Image src={folder.photos[0].imageUrl} alt={folder.title} fill sizes="25vw" className="object-cover" />
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-ink-900/70 px-2 py-1 text-[10px] text-beige-100">
                <Images className="h-3 w-3" />
                {folder.photos.length}
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">{folder.title}</p>
                <p className="text-xs text-ink-700/50">{folder.category}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder);
                }}
                aria-label={`Delete ${folder.title} folder`}
                className="flex-none rounded border border-ink-900/15 p-1.5 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {folders.length === 0 && <p className="col-span-full py-8 text-center text-sm text-ink-700/50">No folders yet.</p>}
      </div>
    </div>
  );
}
