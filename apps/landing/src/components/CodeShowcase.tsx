'use client';

import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

export interface CodeShowcaseItem {
  label: string;
  content: ReactNode;
}

/** Code examples in tabs that advance on their own, with a progress bar below the code. */
export function CodeShowcase({
  items,
  duration = 15_000,
}: {
  items: CodeShowcaseItem[];
  duration?: number;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heights, setHeights] = useState<number[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  // panels can change height when the page resizes and their code wraps differently
  useLayoutEffect(() => {
    const measure = () =>
      setHeights(panels.current.map((panel) => panel?.offsetHeight ?? 0));
    measure();

    const observer = new ResizeObserver(measure);
    for (const panel of panels.current) {
      if (panel) observer.observe(panel);
    }
    return () => observer.disconnect();
  }, [items.length]);

  const activeHeight = heights[active];
  // the space the box doesn't use stays reserved below it, so the page doesn't move when it resizes
  const reserved =
    activeHeight === undefined ? 0 : Math.max(...heights) - activeHeight;

  return (
    <div
      className="transition-[padding] duration-300 ease-out motion-reduce:transition-none"
      style={{ paddingBottom: reserved }}
    >
      <div
        className="overflow-hidden rounded-xl border bg-fd-card text-left shadow-lg"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div role="tablist" className="flex border-b">
          {items.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(index)}
                className={`relative flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${
                  selected
                    ? 'text-fd-foreground'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                {item.label}
                {selected && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-fd-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Every panel shares one grid cell, which is cut to the active one's height once they're measured */}
        <div
          className="grid overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
          style={{ height: activeHeight }}
        >
          {items.map((item, index) => {
            const selected = index === active;
            return (
              <div
                key={item.label}
                ref={(panel) => {
                  panels.current[index] = panel;
                }}
                role="tabpanel"
                aria-hidden={!selected}
                className={`col-start-1 row-start-1 min-w-0 self-start transition-opacity duration-300 ${
                  selected ? 'opacity-100' : 'invisible opacity-0'
                }`}
              >
                {item.content}

                <div aria-hidden className="h-0.5 bg-fd-border">
                  {selected && (
                    <div
                      // re-mount on every switch so the bar starts over
                      key={active}
                      className="code-showcase-progress h-full bg-fd-primary motion-reduce:w-full motion-reduce:animate-none"
                      style={{
                        animationDuration: `${duration}ms`,
                        animationPlayState: paused ? 'paused' : 'running',
                      }}
                      onAnimationEnd={() =>
                        setActive((current) => (current + 1) % items.length)
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
