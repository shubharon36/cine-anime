import { useState } from "react";
import { Palette, Plus, X } from "lucide-react";

export type ThemeValue = {
  themeColor?: string;     // single color hex, e.g. "#FF0000"
  themeGradient?: string;  // CSS gradient string, e.g. "linear-gradient(135deg, #FF0000, #FFD700)"
};

const PRESET_PAIRS: Array<[string, string, string]> = [
  ["Spider-Man", "#E1351A", "#1A4FE0"],
  ["Avengers Doomsday", "#C9A227", "#1B4332"],
  ["Dune", "#D4A155", "#7A4E1F"],
  ["The Batman", "#1A1A1A", "#7A0000"],
  ["Cinema EZ", "#D4AF37", "#B8860B"],
  ["Anime EZ", "#7C3AED", "#22D3EE"],
  ["Sunset", "#FF6B35", "#F7B731"],
  ["Midnight", "#0F2027", "#2C5364"],
];

export function ThemePicker({
  value,
  onChange,
}: {
  value: ThemeValue;
  onChange: (v: ThemeValue) => void;
}) {
  const [mode, setMode] = useState<"solid" | "gradient">(value.themeGradient ? "gradient" : "solid");
  const [c1, setC1] = useState(value.themeColor || "#D4AF37");
  const [c2, setC2] = useState("#7C3AED");
  const [angle, setAngle] = useState(135);

  const applySolid = (color: string) => {
    setC1(color);
    onChange({ themeColor: color, themeGradient: undefined });
  };

  const applyGradient = (color1: string, color2: string, deg: number) => {
    setC1(color1);
    setC2(color2);
    setAngle(deg);
    onChange({
      themeColor: color1,
      themeGradient: `linear-gradient(${deg}deg, ${color1}, ${color2})`,
    });
  };

  const previewBg = mode === "gradient"
    ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
    : c1;

  return (
    <div className="col-span-1 sm:col-span-2 space-y-2 p-3 rounded-xl border border-border bg-background/50">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" /> Theme
        </label>
        <div className="flex gap-1 p-0.5 bg-secondary rounded-lg">
          <button type="button" onClick={() => { setMode("solid"); applySolid(c1); }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-body ${mode === "solid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Solid
          </button>
          <button type="button" onClick={() => { setMode("gradient"); applyGradient(c1, c2, angle); }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-body ${mode === "gradient" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Gradient
          </button>
        </div>
      </div>

      {/* Color wheel inputs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={c1}
            onChange={(e) => mode === "solid" ? applySolid(e.target.value) : applyGradient(e.target.value, c2, angle)}
            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border"
          />
          <span className="text-[10px] font-body uppercase text-muted-foreground">Color 1</span>
        </div>
        {mode === "gradient" && (
          <>
            <Plus className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={c2}
                onChange={(e) => applyGradient(c1, e.target.value, angle)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border"
              />
              <span className="text-[10px] font-body uppercase text-muted-foreground">Color 2</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="range" min={0} max={360} value={angle}
                onChange={(e) => applyGradient(c1, c2, Number(e.target.value))}
                className="w-20"
              />
              <span className="text-[10px] font-body text-muted-foreground w-8">{angle}°</span>
            </div>
          </>
        )}
        {value.themeColor && (
          <button type="button" onClick={() => onChange({ themeColor: undefined, themeGradient: undefined })}
            className="ml-auto p-1.5 rounded-md hover:bg-destructive/20 text-destructive" title="Clear theme">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="h-10 rounded-lg border border-border" style={{ background: previewBg }} />

      {/* Presets */}
      <div>
        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-1.5">Film Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PAIRS.map(([name, a, b]) => (
            <button key={name} type="button"
              onClick={() => { setMode("gradient"); applyGradient(a, b, 135); }}
              className="text-[10px] font-body px-2 py-1 rounded-md border border-border hover:border-primary transition-colors"
              style={{
                background: `linear-gradient(135deg, ${a}, ${b})`,
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              }}
            >{name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
