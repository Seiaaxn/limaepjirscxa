import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../lib/i18n";

export function BackButton({ fallback = "/" }: { fallback?: string }) {
  const { t } = useI18n();

  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  };

  return (
    <Link
      to={fallback}
      onClick={handleClick}
      className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3.5 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {t.common.back}
    </Link>
  );
}
