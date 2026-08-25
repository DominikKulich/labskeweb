import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  beforeAlt: string;
  afterAlt: string;
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  beforeAlt,
  afterAlt,
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <figure className="m-0">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden bg-sand sm:aspect-[3/2]"
        onPointerDown={(e) => {
          dragging.current = true;
          setFromClientX(e.clientX);
        }}
      >
        <img
          src={afterSrc}
          alt={afterAlt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            loading="lazy"
            className="archival absolute inset-0 size-full object-cover"
            draggable={false}
          />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 bg-ink/85 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-background">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 bg-background/90 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ink">
          {afterLabel}
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-background"
          style={{ left: `${position}%` }}
        />

        <div
          role="slider"
          tabIndex={0}
          aria-label="Porovnání historické a současné fotografie"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)} % historického snímku`}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            e.stopPropagation();
            dragging.current = true;
          }}
          className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-ink/20 bg-background shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
          style={{ left: `${position}%` }}
        >
          <span aria-hidden className="text-xs tracking-tight text-ink">
            ◀ ▶
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">
        Táhněte posuvníkem, nebo použijte šipky na klávesnici.
      </figcaption>
    </figure>
  );
}
