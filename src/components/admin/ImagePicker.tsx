import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, Sparkles, Loader2, X } from "lucide-react";

const TMDB_KEY_STORAGE = "ez:tmdb-api-key";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

/**
 * ImagePicker — supports URL input, file upload (→ base64 data URL),
 * and optional TMDB auto-fetch by film title.
 *
 * To use TMDB auto-fetch, the user pastes their free TMDB v3 API key once
 * (stored in localStorage). Get one at https://www.themoviedb.org/settings/api
 */
export function ImagePicker({
  label,
  value,
  onChange,
  searchTitle,
  placeholder = "https://...",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  searchTitle?: string; // film title — enables TMDB fetch
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTmdb = async () => {
    if (!searchTitle?.trim()) {
      setError("Enter a film title first");
      return;
    }
    let apiKey = localStorage.getItem(TMDB_KEY_STORAGE);
    if (!apiKey) {
      apiKey = window.prompt(
        "Paste your free TMDB v3 API key (get one at themoviedb.org/settings/api). It will be saved locally for next time."
      );
      if (!apiKey) return;
      localStorage.setItem(TMDB_KEY_STORAGE, apiKey.trim());
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(searchTitle)}`
      );
      if (!res.ok) throw new Error(`TMDB ${res.status}`);
      const data = await res.json();
      const first = data.results?.[0];
      if (!first?.poster_path) {
        setError("No poster found");
        return;
      }
      onChange(`${TMDB_IMG}${first.poster_path}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "TMDB error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-1 sm:col-span-2">
      <label className="text-xs text-muted-foreground font-body mb-1 block">{label}</label>

      <div className="flex gap-2 items-stretch">
        {/* Preview */}
        {value ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white hover:bg-destructive">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0">
            <LinkIcon className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div className="relative">
            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="url"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-[11px] font-body hover:bg-accent">
              <Upload className="w-3 h-3" /> Upload from device
            </button>

            {searchTitle !== undefined && (
              <button type="button" onClick={handleTmdb} disabled={loading}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/30 text-[11px] font-body hover:bg-primary/20 disabled:opacity-50">
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Auto-fetch from TMDB
              </button>
            )}
          </div>
          {error && <p className="text-[10px] text-destructive font-body">{error}</p>}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
