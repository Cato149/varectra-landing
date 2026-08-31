export interface SectionFile {
  id: string;
  file: string;
  command: string;
  label: string;
  /** Sidebar menu title; kept separate from filesystem-style ids. */
  menu: string;
  menuKey: 'home' | 'about' | 'documentation' | 'projects' | 'events' | 'media' | 'contacts' | 'credits';
  aliases: string[];
  hint?: string;
}

export const sectionFiles: SectionFile[] = [
  {
    id: 'home',
    file: 'greet',
    command: '$ ./greet.sh',
    label: '00 / home',
    menu: 'Home',
    menuKey: 'home',
    aliases: ['', 'connect', 'info', 'home'],
  },
  {
    id: 'whoami',
    file: 'whoami.sh',
    command: '$ ./whoami.sh',
    label: '01 / about',
    menu: 'About',
    menuKey: 'about',
    aliases: ['about', 'whoami'],
  },
  {
    id: 'tech-docs',
    file: 'tech_docs.sh',
    command: '$ ./tech_docs.sh',
    label: '02 / documentation',
    menu: 'Documentation',
    menuKey: 'documentation',
    aliases: ['tech-docs', 'specs', 'documentation', 'documantation'],
    hint: 'tip: one tap = highlight, two = info',
  },
  {
    id: 'exec',
    file: 'exec.sh',
    command: '$ ./exec.sh',
    label: '03 / projects',
    menu: 'Projects',
    menuKey: 'projects',
    aliases: ['exec', 'work'],
  },
  {
    id: 'router',
    file: 'router.sh',
    command: '$ ./router.sh',
    label: '04 / events',
    menu: 'Events',
    menuKey: 'events',
    aliases: ['router', 'events'],
  },
  {
    id: 'static',
    file: 'static',
    command: '$ ls ./static',
    label: '05 / media',
    menu: 'Media',
    menuKey: 'media',
    aliases: ['static', 'gallery', 'media'],
  },
  {
    id: 'protocols',
    file: 'protocols',
    command: '$ tree ./protocols',
    label: '06 / uplinks',
    menu: 'Contacts',
    menuKey: 'contacts',
    aliases: ['protocols', 'socials', 'contacts'],
  },
  {
    id: 'license',
    file: 'LICENSE.md',
    command: '$ cat ./LICENSE.md',
    label: '07 / author',
    menu: 'Credits',
    menuKey: 'credits',
    aliases: ['license', 'credits', 'author'],
  },
];

export const resolveSectionId = (value: string): string => {
  const query = value.replace(/^#/, '').toLowerCase();
  const match = sectionFiles.find((file) =>
    file.id === query || file.aliases.includes(query));
  return match?.id ?? 'home';
};

export const getSectionFile = (id: string): SectionFile =>
  sectionFiles.find((file) => file.id === id) ?? sectionFiles[0]!;

export const desktopSectionHint = (
  id: string,
  hints: { arrows: string; exec: string },
): string | undefined => {
  switch (id) {
    case 'tech-docs':
    case 'static':
    case 'protocols':
    case 'license':
      return hints.arrows;
    case 'exec':
      return hints.exec;
    default:
      return undefined;
  }
};

export const promptPlaceholder = (
  id: string,
  compact: boolean,
  desktopHint?: string,
): string => {
  if (compact) {
    const hint = getSectionFile(id).hint;
    return hint ?? '/help';
  }
  return desktopHint || '/help';
};

export const shiftSectionId = (id: string, direction: 1 | -1): string => {
  const index = sectionFiles.findIndex((file) => file.id === id);
  const current = index < 0 ? 0 : index;
  const next = (current + direction + sectionFiles.length) % sectionFiles.length;
  return sectionFiles[next]?.id ?? 'home';
};
