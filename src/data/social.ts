export interface SocialLink {
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  { label: "Facebook", url: "https://www.facebook.com/labske.nabrezi/" },
  { label: "Instagram", url: "" },
];

export const activeSocialLinks = socialLinks.filter(
  (l) => l.url.trim().length > 0,
);