"use client";

import type { SVGProps } from "react";

interface Social {
  key: string;
  label: string;
  url: string;
  Icon: (p: SVGProps<SVGSVGElement>) => React.JSX.Element;
}

const SOCIALS: Social[] = [
  {
    key: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/_lucaguidotti_/",
    Icon: InstagramIcon,
  },
  {
    key: "saatchi",
    label: "Saatchi Art",
    url: "https://www.saatchiart.com/en-it/lucaguidotti",
    Icon: SaatchiIcon,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/luca-guidotti-b52769289/",
    Icon: LinkedInIcon,
  },
  {
    key: "mail",
    label: "Mail",
    url: "mailto:lucaguidotti1999@libero.it",
    Icon: MailIcon,
  },
];

interface Props {
  variant?: "dark" | "light";
}

export default function SocialIcons({ variant = "dark" }: Props) {
  const color =
    variant === "light"
      ? "text-white hover:text-white/60"
      : "text-black hover:text-rosso";

  return (
    <ul className="flex gap-4 items-center">
      {SOCIALS.map(({ key, label, url, Icon }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`block ${color} transition-colors`}
          >
            <Icon width={26} height={26} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}

function SaatchiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.84 13.5c-.7.96-1.85 1.5-3.4 1.5-1.62 0-2.92-.6-3.7-1.7l1.34-.96c.5.74 1.3 1.16 2.36 1.16.98 0 1.65-.32 1.65-.96 0-.6-.5-.84-1.92-1.16-1.7-.4-3.13-.94-3.13-2.7 0-1.7 1.5-2.78 3.42-2.78 1.5 0 2.7.56 3.4 1.56l-1.3.94c-.5-.66-1.2-1.02-2.12-1.02-.86 0-1.46.34-1.46.92 0 .56.46.78 1.84 1.1 1.7.4 3.22.92 3.22 2.78 0 .5-.1.96-.3 1.32z" />
    </svg>
  );
}
