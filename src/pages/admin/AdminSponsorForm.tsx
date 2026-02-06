import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSponsors, useCreateSponsor, useUpdateSponsor } from "@/hooks/use-sponsors";
import { uploadFile, deleteFile } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";

export default function AdminSponsorForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: sponsors } = useSponsors(false);
  const { mutateAsync: createSponsor, isPending: isCreating } = useCreateSponsor();
  const { mutateAsync: updateSponsor, isPending: isUpdating } = useUpdateSponsor();

  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    order_index: 0,
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew && sponsors) {
      const sponsor = sponsors.find((s) => s.id === id);
      if (sponsor) {
        setFormData({
          name: sponsor.name,
          logo_url: sponsor.logo_url || "",
          website_url: sponsor.website_url || "",
          order_index: sponsor.order_index,
          is_active: sponsor.is_active,
        });
      }
    }
  }, [id, isNew, sponsors]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile("sponsors", file);
      setFormData((prev) => ({ ...prev, logo_url: url }));
      toast({ title: "Logo uploaded" });
    } catch (error) {
      toast({ title: "Upload failed", description: String(error), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.logo_url) {
      try {
        await deleteFile(formData.logo_url);
      } catch {
        // Ignore
      }
      setFormData((prev) => ({ ...prev, logo_url: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        logo_url: formData.logo_url || null,
        website_url: formData.website_url || null,
        order_index: formData.order_index,
        is_active: formData.is_active,
      };

      if (isNew) {
        await createSponsor(data);
        toast({ title: "Sponsor added" });
      } else {
        await updateSponsor({ id: id!, ...data });
        toast({ title: "Sponsor updated" });
      }
      navigate("/admin/sponsors");
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <AdminLayout title={isNew ? "New Sponsor" : "Edit Sponsor"}>
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/sponsors")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sponsors
      </Button>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        {/* Logo */}
        <div className="space-y-2">
          <Label>Logo</Label>
          {formData.logo_url ? (
            <div className="relative inline-block">
              <img
                src={formData.logo_url}
                alt="Logo"
                className="max-w-[200px] max-h-[100px] object-contain border border-border rounded-lg p-2"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="w-[200px] h-[100px] border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <span className="text-sm text-muted-foreground">Upload logo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_index">Display Order</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            {formData.is_active ? "Active" : "Inactive"}
          </Label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/sponsors")}
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
      </form>
    </AdminLayout>
  );
}
