import { ContentDetailPage } from "@/components/content/ContentDetailPage";

export default function EventDetail() {
  return (
    <ContentDetailPage
      kind="event"
      backLink="/events"
      backLabel="Events"
    />
  );
}
