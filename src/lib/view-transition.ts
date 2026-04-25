"use client";

import { useRouter } from "next/navigation";

/**
 * Wrap router.push in document.startViewTransition() so that elements with
 * matching `view-transition-name` styles animate between their old and new
 * positions/sizes.
 *
 * The callback returns a promise that resolves after a small fixed delay,
 * giving React time to render the new route before the browser captures the
 * "after" snapshot. If the resolve takes too long, the browser aborts with a
 * "timeout in DOM update" error — so we keep this short and bounded.
 */
export function useNavigateWithTransition() {
  const router = useRouter();

  return (href: string) => {
    if (typeof document === "undefined") {
      router.push(href);
      return;
    }

    type DocWithVT = Document & {
      startViewTransition?: (cb: () => void | Promise<void>) => unknown;
    };
    const doc = document as DocWithVT;

    if (typeof doc.startViewTransition !== "function") {
      router.push(href);
      return;
    }

    doc.startViewTransition(() => {
      router.push(href);
      // 80ms is enough for Next.js client navigation + React render in dev.
      // Bounded by setTimeout so the browser never times out waiting on us.
      return new Promise<void>((resolve) => {
        window.setTimeout(resolve, 80);
      });
    });
  };
}
