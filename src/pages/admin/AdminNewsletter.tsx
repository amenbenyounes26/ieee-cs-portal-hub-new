import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Trash2, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletterSubscribers, useDeleteNewsletterSubscriber } from "@/hooks/use-newsletter";
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

export default function AdminNewsletter() {
  const [search, setSearch] = useState("");
  const { data: subscribers, isLoading } = useNewsletterSubscribers();
  const { mutate: deleteSubscriber } = useDeleteNewsletterSubscriber();
  const { toast } = useToast();

  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];
    if (!search) return subscribers;

    const searchLower = search.toLowerCase();
    return subscribers.filter((sub) =>
      sub.email.toLowerCase().includes(searchLower)
    );
  }, [subscribers, search]);

  const handleDelete = (id: string) => {
    deleteSubscriber(id, {
      onSuccess: () => {
        toast({ title: "Subscriber removed" });
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const exportToCSV = () => {
    if (!subscribers) return;

    const headers = ["Email", "Subscribed Date"];
    const rows = subscribers.map((sub) => [
      sub.email,
      format(new Date(sub.created_at), "yyyy-MM-dd HH:mm"),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Newsletter Subscribers">
      {/* Stats */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="text-3xl font-bold text-foreground">
          {subscribers?.length || 0}
        </div>
        <div className="text-muted-foreground">Total Subscribers</div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={!subscribers?.length}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Subscribed</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><div className="h-5 bg-muted rounded w-48 animate-pulse" /></td>
                    <td className="p-4"><div className="h-5 bg-muted rounded w-24 animate-pulse" /></td>
                    <td className="p-4"><div className="h-5 bg-muted rounded w-8 ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">
                      {subscriber.email}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {format(new Date(subscriber.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove subscriber?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove {subscriber.email} from the newsletter list.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(subscriber.id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
