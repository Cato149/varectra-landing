<script lang="ts">
  import { onMount } from 'svelte';
  import { cycleIndex, routeShortcut } from '../../lib/keyboard/router';
  import { treeAffix } from '../../lib/sections/tree';
  import TuiBox from '../tui/TuiBox.svelte';
  import { messages } from '../../lib/i18n/store';
  import { publicUrl } from '../../lib/paths';

  interface ProjectImage {
    src: string;
    alt: string;
    width: number;
    height: number;
  }

  interface Project {
    id: string;
    title: string;
    directory: string;
    summary: string;
    body: string;
    images: ProjectImage[];
    technologies: string[];
    links: Array<{ label: string; url: string }>;
  }

  type TreeRow =
    | { kind: 'file'; id: string }
    | { kind: 'directory'; directory: string };

  export let projects: Project[] = [];
  export let telegramUrl = '';

  $: copy = $messages;

  let selectedId = projects.find((project) => project.directory === 'root')?.id ?? projects[0]?.id;
  let expanded: Record<string, boolean> = Object.fromEntries(
    [...new Set(projects.map((project) => project.directory))].map((directory) => [directory, true]),
  );

  $: selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  $: directories = [...new Set(projects
    .map((project) => project.directory)
    .filter((directory) => directory !== 'root'))];
  $: rootProjects = projects.filter((project) => project.directory === 'root');
  $: directoryNodes = directories.map((directory, directoryIndex) => ({
    directory,
    isLast: directoryIndex === directories.length - 1,
    files: projects.filter((project) => project.directory === directory),
  }));

  $: treeRows = [
    ...rootProjects.map((project): TreeRow => ({ kind: 'file', id: project.id })),
    ...directoryNodes.flatMap((node): TreeRow[] => [
      { kind: 'directory', directory: node.directory },
      ...(expanded[node.directory]
        ? node.files.map((project): TreeRow => ({ kind: 'file', id: project.id }))
        : []),
    ]),
  ];

  let focusIndex = 0;

  $: if (focusIndex >= treeRows.length) focusIndex = Math.max(0, treeRows.length - 1);

  const rowFocused = (row: TreeRow): boolean => {
    const current = treeRows[focusIndex];
    if (!current) return false;
    if (row.kind === 'file' && current.kind === 'file') return row.id === current.id;
    if (row.kind === 'directory' && current.kind === 'directory') {
      return row.directory === current.directory;
    }
    return false;
  };

  const toggleDirectory = (directory: string) => {
    expanded = { ...expanded, [directory]: !expanded[directory] };
  };

  const activateRow = (row: TreeRow | undefined) => {
    if (!row) return;
    if (row.kind === 'directory') {
      toggleDirectory(row.directory);
      return;
    }
    selectedId = row.id;
  };

  const placeOrder = () => {
    if (!telegramUrl) return;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  onMount(() => {
    const selectedRow = treeRows.findIndex((row) => row.kind === 'file' && row.id === selectedId);
    if (selectedRow >= 0) focusIndex = selectedRow;

    const onKeydown = (event: KeyboardEvent) => {
      const action = routeShortcut(event.key, {
        target: event.target,
        dialogOpen: false,
        sectionActive: true,
      });
      switch (action) {
        case 'focus-next':
        case 'focus-previous':
          event.preventDefault();
          focusIndex = cycleIndex(focusIndex, treeRows.length, action === 'focus-next' ? 1 : -1);
          return;
        case 'activate':
          event.preventDefault();
          activateRow(treeRows[focusIndex]);
          return;
        case 'order':
          event.preventDefault();
          placeOrder();
          return;
        case 'next':
        case 'previous':
        case 'next-file':
        case 'previous-file':
        case 'close':
        case 'download':
        case 'open-terminal':
        case 'none':
          return;
        default: {
          const _never: never = action;
          return _never;
        }
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });
</script>

<div class="project-shell">
  <nav class="file-tree" aria-label="Project filesystem">
    <TuiBox title="varectra/work" meta="tree">
    <ul role="tree">
      {#each rootProjects as project, fileIndex}
        {@const affix = treeAffix(fileIndex === rootProjects.length - 1 && directoryNodes.length === 0, false)}
        <li role="treeitem" aria-selected={selectedId === project.id}>
          <button
            class="tree-row project-file"
            class:selected={selectedId === project.id}
            class:focused={rowFocused({ kind: 'file', id: project.id })}
            type="button"
            aria-current={selectedId === project.id ? 'page' : undefined}
            on:click={() => selectedId = project.id}
          >
            <span class="tree-stem" class:tree-stem--pipe={affix.stemPipe} aria-hidden="true">{affix.stem}</span>
            <span class="tree-branch" aria-hidden="true">{affix.branch}</span>
            <span class="tree-name">{project.title}</span>
          </button>
        </li>
      {/each}
      {#each directoryNodes as node}
        {@const dirAffix = treeAffix(node.isLast, false)}
        <li role="treeitem" aria-expanded={expanded[node.directory]} aria-selected="false">
          <button
            class="tree-row directory-button"
            class:focused={rowFocused({ kind: 'directory', directory: node.directory })}
            type="button"
            on:click={() => toggleDirectory(node.directory)}
          >
            <span class="tree-stem" class:tree-stem--pipe={dirAffix.stemPipe} aria-hidden="true">{dirAffix.stem}</span>
            <span class="tree-branch" aria-hidden="true">{dirAffix.branch}</span>
            <span class="tree-name">{expanded[node.directory] ? '▾' : '▸'} {node.directory}/</span>
          </button>
          {#if expanded[node.directory]}
            <ul role="group">
              {#each node.files as project, projectIndex}
                {@const fileAffix = treeAffix(projectIndex === node.files.length - 1, true, node.isLast)}
                <li role="treeitem" aria-selected={selectedId === project.id}>
                  <button
                    class="tree-row project-file"
                    class:selected={selectedId === project.id}
                    class:focused={rowFocused({ kind: 'file', id: project.id })}
                    type="button"
                    aria-current={selectedId === project.id ? 'page' : undefined}
                    on:click={() => selectedId = project.id}
                  >
                    <span class="tree-stem" class:tree-stem--pipe={fileAffix.stemPipe} aria-hidden="true">{fileAffix.stem}</span>
                    <span
                      class="tree-branch"
                      class:tree-branch--pipe={fileAffix.branchPipe}
                      aria-hidden="true"
                    >{fileAffix.branch}</span>
                    <span class="tree-name">{project.title}</span>
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
    </TuiBox>
  </nav>

  {#if selected}
    <article class="project-viewer" aria-live="polite">
      <TuiBox title={`${selected.directory}/${selected.title}`} meta="UTF-8">
      <div class:has-media={selected.images.length > 0} class="project-content">
        <div>
          <p class="project-summary">{selected.summary}</p>
          <div class="prose">{@html selected.body}</div>
          {#if selected.technologies.length}
            <ul class="technology-list" aria-label="Technologies">
              {#each selected.technologies as technology}
                <li>[{technology}]</li>
              {/each}
            </ul>
          {/if}
          {#if selected.links.length}
            <div class="project-links">
              {#each selected.links as link}
                <a href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>
              {/each}
            </div>
          {/if}
        </div>
        {#if selected.images[0]}
          <figure>
            <img
              src={publicUrl(selected.images[0].src)}
              alt={selected.images[0].alt}
              width={selected.images[0].width}
              height={selected.images[0].height}
              loading="lazy"
              decoding="async"
            />
          </figure>
        {/if}
      </div>
      <svelte:fragment slot="bar">
        <div class="project-bar">
          <span>{selected.title === 'README.md' ? copy.exec.requestsOpen : copy.exec.projectRecord}</span>
          <a class="order-button" href={telegramUrl} target="_blank" rel="noreferrer">
            <span class="key">[O]</span> {copy.exec.order} ↗
            <span class="sr-only">{copy.exec.orderHint}</span>
          </a>
        </div>
      </svelte:fragment>
      </TuiBox>
    </article>
  {/if}
</div>

<style>
  .project-shell {
    display: grid;
    grid-template-columns: minmax(16rem, 0.7fr) minmax(0, 1.7fr);
    align-items: start;
    gap: 1rem;
    width: 100%;
  }

  .file-tree,
  .project-viewer {
    min-width: 0;
  }

  .file-tree ul {
    margin: 0;
    padding: 0.15rem 0.2rem;
    list-style: none;
    line-height: 1.15;
  }

  .file-tree ul ul {
    padding: 0;
  }

  .file-tree li {
    margin: 0;
  }

  .tree-row {
    display: grid;
    grid-template-columns: 4ch max-content minmax(0, 1fr);
    align-items: stretch;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    line-height: 1.15;
    color: var(--fg-muted);
    text-align: left;
  }

  .tree-stem,
  .tree-branch {
    position: relative;
    overflow: hidden;
    white-space: pre;
    user-select: none;
  }

  /* Stretch │ through wrapped rows so box-drawing stays one path. */
  .tree-stem--pipe::before,
  .tree-branch--pipe::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    content: '│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A';
    line-height: inherit;
    white-space: pre;
  }

  .tree-name {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .project-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .project-file:hover,
  .directory-button:hover,
  .project-file.selected,
  .tree-row.focused {
    color: var(--fg);
  }

  .project-file.selected .tree-name::after {
    float: right;
    margin-left: 0.4rem;
    color: var(--accent-secondary);
    content: '<';
  }

  .project-content {
    min-height: 12rem;
    padding: clamp(1rem, 3vw, 2rem);
  }

  .project-content.has-media {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(14rem, 2fr);
    gap: 2rem;
  }

  .project-summary {
    margin-top: 0;
    color: var(--accent-secondary);
  }

  figure {
    margin: 0;
  }

  figure img {
    display: block;
    width: 100%;
    height: auto;
  }

  .technology-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin: 1.5rem 0 0;
    padding: 0;
    color: var(--accent);
    list-style: none;
    font-size: 0.8rem;
  }

  .project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 800px) {
    .project-shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-content.has-media {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
