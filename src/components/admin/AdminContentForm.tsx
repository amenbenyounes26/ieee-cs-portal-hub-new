import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContentItems, useCreateContentItem, useUpdateContentItem, ContentKind, ContentItem } from "@/hooks/use-content-items";
import { uploadFile, deleteFile } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";

interface ContentFormProps {
  kind: ContentKind;
  title: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminContentForm({ kind, title }: ContentFormProps) {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: items } = useContentItems(kind);
  const { mutateAsync: createItem, isPending: isCreating } = useCreateContentItem();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateContentItem();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    start_at: "",
    end_at: "",
    location: "",
    format: "In-person",
    cover_image_url: "",
    registration_url: "",
    description_md: "",
    status: "draft" as "draft" | "published",
  });
  const [uploading, setUploading] = useState(false);

  // Load existing item
  useEffect(() => {
    if (!isNew && items) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setFormData({
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt || "",
          start_at: item.start_at ? item.start_at.slice(0, 16) : "",
          end_at: item.end_at ? item.end_at.slice(0, 16) : "",
          location: item.location || "",
          format: item.format || "In-person",
          cover_image_url: item.cover_image_url || "",
          registration_url: item.registration_url || "",
          description_md: item.description_md || "",
          status: item.status,
        });
      }
    }
  }, [id, isNew, items]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile("covers", file);
      setFormData((prev) => ({ ...prev, cover_image_url: url }));
      toast({ title: "Image uploaded" });
    } catch (error) {
      toast({ title: "Upload failed", description: String(error), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.cover_image_url) {
      try {
        await deleteFile(formData.cover_image_url);
      } catch {
        // Ignore delete errors
      }
      setFormData((prev) => ({ ...prev, cover_image_url: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        kind,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        start_at: formData.start_at ? new Date(formData.start_at).toISOString() : null,
        end_at: formData.end_at ? new Date(formData.end_at).toISOString() : null,
        location: formData.location || null,
        format: formData.format || null,
        cover_image_url: formData.cover_image_url || null,
        registration_url: formData.registration_url || null,
        description_md: formData.description_md || null,
        status: formData.status,
      };

      if (isNew) {
        await createItem(data);
        toast({ title: `${title.slice(0, -1)} created` });
      } else {
        await updateItem({ id: id!, ...data });
        toast({ title: `${title.slice(0, -1)} updated` });
      }
      navigate(`/admin/${kind}s`);
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <AdminLayout title={isNew ? `New ${title.slice(0, -1)}` : `Edit ${title.slice(0, -1)}`}>
      <Button
        variant="ghost"
        onClick={() => navigate(`/admin/${kind}s`)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {title}
      </Button>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_at">Start Date</Label>
                <Input
                  id="start_at"
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_at">End Date</Label>
                <Input
                  id="end_at"
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={formData.format}
                onValueChange={(v) => setFormData({ ...formData, format: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_url">Registration URL</Label>
              <Input
                id="registration_url"
                type="url"
                value={formData.registration_url}
                onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          {formData.cover_image_url ? (
            <div className="relative inline-block">
              <img
                src={formData.cover_image_url}
                alt="Cover"
                className="max-w-xs rounded-lg border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {uploading ? "Uploading..." : "Upload Image"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description_md">Description (Markdown)</Label>
          <Textarea
            id="description_md"
            value={formData.description_md}
            onChange={(e) => setFormData({ ...formData, description_md: e.target.value })}
            rows={12}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supports Markdown formatting
          </p>
        </div>

        {/* Status & Submit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Switch
              id="status"
              checked={formData.status === "published"}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status: checked ? "published" : "draft" })
              }
            />
            <Label htmlFor="status" className="cursor-pointer">
              {formData.status === "published" ? "Published" : "Draft"}
            </Label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/${kind}s`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="glow-primary">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
