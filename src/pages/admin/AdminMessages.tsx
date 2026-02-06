import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Mail, MailOpen, Trash2, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useContactMessages, useUpdateMessageStatus, useDeleteContactMessage } from "@/hooks/use-contact-messages";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessages() {
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const { data: messages, isLoading } = useContactMessages();
  const { mutate: updateStatus } = useUpdateMessageStatus();
  const { mutate: deleteMessage } = useDeleteContactMessage();
  const { toast } = useToast();

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    if (!search) return messages;

    const searchLower = search.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchLower) ||
        msg.email.toLowerCase().includes(searchLower) ||
        msg.subject.toLowerCase().includes(searchLower)
    );
  }, [messages, search]);

  const selectedMessageData = messages?.find((m) => m.id === selectedMessage);

  const handleToggleStatus = (id: string, currentStatus: "read" | "unread") => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast({ title: `Marked as ${newStatus}` });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMessage(id, {
      onSuccess: () => {
        toast({ title: "Message deleted" });
        if (selectedMessage === id) {
          setSelectedMessage(null);
        }
      },
    });
  };

  const handleOpenMessage = (id: string) => {
    setSelectedMessage(id);
    const msg = messages?.find((m) => m.id === id);
    if (msg && msg.status === "unread") {
      updateStatus({ id, status: "read" });
    }
  };

  const exportToCSV = () => {
    if (!messages) return;

    const headers = ["Name", "Email", "Subject", "Message", "Status", "Date"];
    const rows = messages.map((msg) => [
      msg.name,
      msg.email,
      msg.subject,
      msg.message.replace(/"/g, '""'),
      msg.status,
      format(new Date(msg.created_at), "yyyy-MM-dd HH:mm"),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Messages">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={!messages?.length}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Messages List */}
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded w-48 mb-2" />
                  <div className="h-4 bg-muted rounded w-64" />
                </div>
              </div>
            </div>
          ))
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => handleOpenMessage(message.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.status === "unread"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.status === "unread" ? (
                    <Mail className="w-5 h-5" />
                  ) : (
                    <MailOpen className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-medium ${
                        message.status === "unread"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.name}
                    </span>
                    {message.status === "unread" && (
                      <Badge className="bg-primary/10 text-primary border-0">New</Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm truncate ${
                      message.status === "unread"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.email} • {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(message.id, message.status)}
                    title={message.status === "read" ? "Mark as unread" : "Mark as read"}
                  >
                    {message.status === "read" ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(message.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No messages found.
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          {selectedMessageData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessageData.subject}</DialogTitle>
                <DialogDescription>
                  From {selectedMessageData.name} ({selectedMessageData.email})
                  <br />
                  {format(new Date(selectedMessageData.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-foreground whitespace-pre-wrap">
                  {selectedMessageData.message}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleToggleStatus(
                      selectedMessageData.id,
                      selectedMessageData.status
                    )
                  }
                >
                  {selectedMessageData.status === "read"
                    ? "Mark as unread"
                    : "Mark as read"}
                </Button>
                <Button asChild>
                  <a href={`mailto:${selectedMessageData.email}`}>Reply</a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
