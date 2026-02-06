import { Link } from "react-router-dom";
import {
  Calendar,
  Wrench,
  GraduationCap,
  Users,
  Handshake,
  Mail,
  Plus,
  Clock,
  FileText,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useContentItems } from "@/hooks/use-content-items";
import { useBoardMembers } from "@/hooks/use-board-members";
import { useSponsors } from "@/hooks/use-sponsors";
import { useUnreadMessagesCount } from "@/hooks/use-contact-messages";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: contentItems } = useContentItems();
  const { data: boardMembers } = useBoardMembers(false);
  const { data: sponsors } = useSponsors(false);
  const { data: unreadCount } = useUnreadMessagesCount();

  const events = contentItems?.filter((i) => i.kind === "event") || [];
  const workshops = contentItems?.filter((i) => i.kind === "workshop") || [];
  const bootcamps = contentItems?.filter((i) => i.kind === "bootcamp") || [];
  const drafts = contentItems?.filter((i) => i.status === "draft") || [];
  const upcoming = contentItems?.filter(
    (i) => i.status === "published" && i.start_at && new Date(i.start_at) >= new Date()
  ) || [];

  const recentItems = contentItems
    ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5) || [];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Events"
          value={events.length}
          icon={Calendar}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          title="Workshops"
          value={workshops.length}
          icon={Wrench}
          color="bg-info/10 text-info"
        />
        <StatCard
          title="Bootcamps"
          value={bootcamps.length}
          icon={GraduationCap}
          color="bg-success/10 text-success"
        />
        <StatCard
          title="Upcoming"
          value={upcoming.length}
          icon={Clock}
          color="bg-warning/10 text-warning"
        />
        <StatCard
          title="Drafts"
          value={drafts.length}
          icon={FileText}
          color="bg-muted text-muted-foreground"
        />
        <StatCard
          title="Board Members"
          value={boardMembers?.length || 0}
          icon={Users}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          title="Sponsors"
          value={sponsors?.length || 0}
          icon={Handshake}
          color="bg-success/10 text-success"
        />
        <StatCard
          title="Unread Messages"
          value={unreadCount || 0}
          icon={Mail}
          color="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/events/new">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/workshops/new">
              <Plus className="w-4 h-4 mr-2" />
              New Workshop
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/bootcamps/new">
              <Plus className="w-4 h-4 mr-2" />
              New Bootcamp
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/board/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Board Member
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/sponsors/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsor
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Updates</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {recentItems.length > 0 ? (
            recentItems.map((item) => (
              <Link
                key={item.id}
                to={`/admin/${item.kind}s/${item.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.kind === "event" ? "bg-primary/10 text-primary" :
                  item.kind === "workshop" ? "bg-info/10 text-info" :
                  "bg-success/10 text-success"
                }`}>
                  {item.kind === "event" ? <Calendar className="w-5 h-5" /> :
                   item.kind === "workshop" ? <Wrench className="w-5 h-5" /> :
                   <GraduationCap className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.kind} • {item.status} • Updated {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No content yet. Create your first event, workshop, or bootcamp!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
