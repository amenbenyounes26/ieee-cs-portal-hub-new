import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContentListPage } from "@/components/content/ContentListPage";

export default function Bootcamps() {
  return (
    <PublicLayout>
      <ContentListPage
        kind="bootcamp"
        title="Bootcamps"
        description="Intensive training programs designed to accelerate your learning. Join our bootcamps and master new technologies."
      />
    </PublicLayout>
  );
}
