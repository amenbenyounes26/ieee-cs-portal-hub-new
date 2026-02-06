import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContentListPage } from "@/components/content/ContentListPage";

export default function Events() {
  return (
    <PublicLayout>
      <ContentListPage
        kind="event"
        title="Events"
        description="Discover our upcoming and past events. From tech talks to networking sessions, there's something for everyone."
      />
    </PublicLayout>
  );
}
