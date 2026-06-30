import { useEffect, useState } from "react";
import { getSignedUrl } from "@/lib/vehicle-images";
import { Car } from "lucide-react";

export function SignedImage({
  path,
  alt,
  className,
  loading = "lazy",
}: {
  path?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!path) {
      setUrl(null);
      return;
    }
    getSignedUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!path || errored) {
    return (
      <div className={`flex items-center justify-center bg-muted text-muted-foreground ${className ?? ""}`}>
        <Car className="size-12 opacity-30" />
      </div>
    );
  }
  if (!url) {
    return <div className={`bg-muted animate-pulse ${className ?? ""}`} />;
  }
  return <img src={url} alt={alt} loading={loading} onError={() => setErrored(true)} className={className} />;
}
