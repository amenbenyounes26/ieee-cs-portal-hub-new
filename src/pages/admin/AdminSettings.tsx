import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    site_name: "",
    footer_text: "",
    contact_email: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    address_text: "",
    home_intro_md: "",
    maps_embed_url: "",
    header_cta_text: "",
    header_cta_url: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || "",
        footer_text: settings.footer_text || "",
        contact_email: settings.contact_email || "",
        facebook_url: settings.facebook_url || "",
        instagram_url: settings.instagram_url || "",
        linkedin_url: settings.linkedin_url || "",
        address_text: settings.address_text || "",
        home_intro_md: settings.home_intro_md || "",
        maps_embed_url: settings.maps_embed_url || "",
        header_cta_text: settings.header_cta_text || "",
        header_cta_url: settings.header_cta_url || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update(formData)
        .eq("id", 1);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Settings saved" });
    } catch (error) {
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="max-w-2xl space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-muted rounded w-24 animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* General */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">General</h2>
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_text">Address</Label>
            <Input
              id="address_text"
              value={formData.address_text}
              onChange={(e) => setFormData({ ...formData, address_text: e.target.value })}
            />
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input
                id="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Header CTA */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Header Call-to-Action</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="header_cta_text">Button Text</Label>
              <Input
                id="header_cta_text"
                value={formData.header_cta_text}
                onChange={(e) => setFormData({ ...formData, header_cta_text: e.target.value })}
                placeholder="e.g., Join IEEE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header_cta_url">Button URL</Label>
              <Input
                id="header_cta_url"
                type="url"
                value={formData.header_cta_url}
                onChange={(e) => setFormData({ ...formData, header_cta_url: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Home Page */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Home Page</h2>
          <div className="space-y-2">
            <Label htmlFor="home_intro_md">Introduction (Markdown)</Label>
            <Textarea
              id="home_intro_md"
              value={formData.home_intro_md}
              onChange={(e) => setFormData({ ...formData, home_intro_md: e.target.value })}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </section>

        {/* Footer */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Footer</h2>
          <div className="space-y-2">
            <Label htmlFor="footer_text">Copyright Text</Label>
            <Input
              id="footer_text"
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maps_embed_url">Google Maps Embed URL</Label>
            <Input
              id="maps_embed_url"
              value={formData.maps_embed_url}
              onChange={(e) => setFormData({ ...formData, maps_embed_url: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-muted-foreground">
              Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-4 border-t border-border">
          <Button type="submit" disabled={saving} className="glow-primary">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
