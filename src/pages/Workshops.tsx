import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContentListPage } from "@/components/content/ContentListPage";

export default function Workshops() {
  return (
    <PublicLayout>
      <ContentListPage
        kind="workshop"
        title="Workshops"
        description="Hands-on learning experiences to build practical skills. From coding to design, enhance your expertise with us."
      />
    </PublicLayout>
  );
}
