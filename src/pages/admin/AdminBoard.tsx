import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBoardMembers, useDeleteBoardMember, useUpdateBoardMember } from "@/hooks/use-board-members";
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

export default function AdminBoard() {
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useBoardMembers(false);
  const { mutate: deleteMember } = useDeleteBoardMember();
  const { mutate: updateMember } = useUpdateBoardMember();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!search) return members;

    const searchLower = search.toLowerCase();
    return members.filter(
      (member) =>
        member.full_name.toLowerCase().includes(searchLower) ||
        member.position.toLowerCase().includes(searchLower)
    );
  }, [members, search]);

  const handleDelete = (id: string) => {
    deleteMember(id, {
      onSuccess: () => {
        toast({ title: "Member deleted" });
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateMember(
      { id, is_active: !currentActive },
      {
        onSuccess: () => {
          toast({ title: currentActive ? "Member deactivated" : "Member activated" });
        },
        onError: (error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <AdminLayout title="Board Members">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link to="/admin/board/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground w-8"></th>
                <th className="text-left p-4 font-medium text-muted-foreground">Member</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Position</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><div className="h-5 bg-muted rounded w-4 animate-pulse" /></td>
                    <td className="p-4"><div className="h-10 bg-muted rounded w-48 animate-pulse" /></td>
                    <td className="p-4 hidden md:table-cell"><div className="h-5 bg-muted rounded w-24 animate-pulse" /></td>
                    <td className="p-4"><div className="h-5 bg-muted rounded w-16 animate-pulse" /></td>
                    <td className="p-4"><div className="h-5 bg-muted rounded w-24 ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.photo_url || undefined} alt={member.full_name} />
                          <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{member.full_name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">{member.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">
                      {member.position}
                    </td>
                    <td className="p-4">
                      <Badge variant={member.is_active ? "default" : "secondary"}>
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(member.id, member.is_active)}
                          title={member.is_active ? "Deactivate" : "Activate"}
                        >
                          {member.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/board/${member.id}`)}
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
                              <AlertDialogTitle>Delete {member.full_name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this board member.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(member.id)}>
                                Delete
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
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No board members found.
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
