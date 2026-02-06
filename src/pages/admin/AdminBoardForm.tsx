import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBoardMembers, useCreateBoardMember, useUpdateBoardMember } from "@/hooks/use-board-members";
import { uploadFile, deleteFile } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";

export default function AdminBoardForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: members } = useBoardMembers(false);
  const { mutateAsync: createMember, isPending: isCreating } = useCreateBoardMember();
  const { mutateAsync: updateMember, isPending: isUpdating } = useUpdateBoardMember();

  const [formData, setFormData] = useState({
    full_name: "",
    position: "",
    bio: "",
    photo_url: "",
    linkedin_url: "",
    order_index: 0,
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew && members) {
      const member = members.find((m) => m.id === id);
      if (member) {
        setFormData({
          full_name: member.full_name,
          position: member.position,
          bio: member.bio || "",
          photo_url: member.photo_url || "",
          linkedin_url: member.linkedin_url || "",
          order_index: member.order_index,
          is_active: member.is_active,
        });
      }
    }
  }, [id, isNew, members]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile("board", file);
      setFormData((prev) => ({ ...prev, photo_url: url }));
      toast({ title: "Photo uploaded" });
    } catch (error) {
      toast({ title: "Upload failed", description: String(error), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.photo_url) {
      try {
        await deleteFile(formData.photo_url);
      } catch {
        // Ignore
      }
      setFormData((prev) => ({ ...prev, photo_url: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        full_name: formData.full_name,
        position: formData.position,
        bio: formData.bio || null,
        photo_url: formData.photo_url || null,
        linkedin_url: formData.linkedin_url || null,
        order_index: formData.order_index,
        is_active: formData.is_active,
      };

      if (isNew) {
        await createMember(data);
        toast({ title: "Board member added" });
      } else {
        await updateMember({ id: id!, ...data });
        toast({ title: "Board member updated" });
      }
      navigate("/admin/board");
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <AdminLayout title={isNew ? "New Board Member" : "Edit Board Member"}>
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/board")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Board Members
      </Button>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Photo */}
        <div className="space-y-2">
          <Label>Photo</Label>
          {formData.photo_url ? (
            <div className="relative inline-block">
              <img
                src={formData.photo_url}
                alt="Photo"
                className="w-32 h-32 rounded-full object-cover border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
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
            onClick={() => navigate("/admin/board")}
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
