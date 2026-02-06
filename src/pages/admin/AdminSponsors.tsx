import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, GripVertical, ExternalLink } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSponsors, useDeleteSponsor, useUpdateSponsor } from "@/hooks/use-sponsors";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminSponsors() {
  const [search, setSearch] = useState("");
  const { data: sponsors, isLoading } = useSponsors(false);
  const { mutate: deleteSponsor } = useDeleteSponsor();
  const { mutate: updateSponsor } = useUpdateSponsor();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredSponsors = useMemo(() => {
    if (!sponsors) return [];
    if (!search) return sponsors;

    const searchLower = search.toLowerCase();
    return sponsors.filter((sponsor) =>
      sponsor.name.toLowerCase().includes(searchLower)
    );
  }, [sponsors, search]);

  const handleDelete = (id: string) => {
    deleteSponsor(id, {
      onSuccess: () => {
        toast({ title: "Sponsor deleted" });
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateSponsor(
      { id, is_active: !currentActive },
      {
        onSuccess: () => {
          toast({ title: currentActive ? "Sponsor deactivated" : "Sponsor activated" });
        },
        onError: (error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <AdminLayout title="Sponsors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sponsors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link to="/admin/sponsors/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Sponsor
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
              <div className="h-16 bg-muted rounded mb-4" />
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))
        ) : filteredSponsors.length > 0 ? (
          filteredSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
            >
              {/* Logo */}
              <div className="h-16 mb-4 flex items-center justify-center">
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-xl font-bold text-muted-foreground">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center mb-4">
                <h3 className="font-semibold text-foreground">{sponsor.name}</h3>
                {sponsor.website_url && (
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Status */}
              <div className="flex justify-center mb-4">
                <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                  {sponsor.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleActive(sponsor.id, sponsor.is_active)}
                  title={sponsor.is_active ? "Deactivate" : "Activate"}
                >
                  {sponsor.is_active ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/sponsors/${sponsor.id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {sponsor.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(sponsor.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
            No sponsors found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
