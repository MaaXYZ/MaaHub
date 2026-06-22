import React from 'react';
import hljs from 'highlight.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { FileCode, Check, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { parseFrontmatter } from '../lib/markdown';

export type DownloadFile = {
  path: string;
  content: string;
};

type FileViewerProps = {
  files?: DownloadFile[];
  emptyLabel: string;
};

const README_CANDIDATES = new Set(['readme.md', 'readme.mdx', 'index.md', 'index.mdx']);

function sortFiles(files: DownloadFile[]) {
  return [...files].sort((a, b) => {
    const aName = a.path.split('/').pop()?.toLowerCase() ?? a.path.toLowerCase();
    const bName = b.path.split('/').pop()?.toLowerCase() ?? b.path.toLowerCase();
    const aIsSkillDefinition = aName === 'skill.md';
    const bIsSkillDefinition = bName === 'skill.md';
    const aIsReadme = README_CANDIDATES.has(aName);
    const bIsReadme = README_CANDIDATES.has(bName);

    if (aIsReadme !== bIsReadme) return aIsReadme ? -1 : 1;
    if (aIsSkillDefinition !== bIsSkillDefinition) return aIsSkillDefinition ? -1 : 1;
    return a.path.localeCompare(b.path);
  });
}

function shouldPreviewFile(path: string) {
  const fileName = path.split('/').pop()?.toLowerCase() ?? path.toLowerCase();
  return fileName !== 'maahub_meta.json';
}

function getLanguage(path: string) {
  const extension = path.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'astro':
      return 'xml';
    case 'cjs':
    case 'mjs':
      return 'javascript';
    case 'jsonc':
      return 'json';
    case 'mdx':
      return 'markdown';
    case 'ps1':
      return 'powershell';
    case 'py':
      return 'python';
    case 'sh':
      return 'bash';
    case 'tsx':
      return 'typescript';
    default:
      return extension ?? 'plaintext';
  }
}

function isMarkdown(path: string) {
  return /\.(md|mdx)$/i.test(path);
}

function MarkdownWithMeta({ content }: { content: string }) {
  const { meta, body } = parseFrontmatter(content);
  return (
    <div className="space-y-4">
      {meta && (
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {Object.entries(meta).map(([key, val]) => (
              <React.Fragment key={key}>
                <dt className="text-muted-foreground font-medium">{key}</dt>
                <dd className="text-foreground break-words">{val}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      )}
      {body.trim() && (
        <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {body}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export function FileViewer({ files = [], emptyLabel }: FileViewerProps) {
  const orderedFiles = React.useMemo(
    () => sortFiles(files.filter((file) => shouldPreviewFile(file.path))),
    [files]
  );
  const initialTab = orderedFiles[0]?.path ?? '';
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const codeRef = React.useRef<HTMLElement | null>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = () => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  React.useEffect(() => {
    updateScrollState();
    const el = tabsRef.current;
    el?.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el?.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [orderedFiles]);

  const scrollTabs = (dir: 'left' | 'right') => {
    tabsRef.current?.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
  };

  const handleCopy = async () => {
    if (!activeFile?.content) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  React.useEffect(() => {
    if (!orderedFiles.some((file) => file.path === activeTab)) {
      setActiveTab(initialTab);
    }
  }, [activeTab, initialTab, orderedFiles]);

  if (!orderedFiles.length) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        {emptyLabel}
      </div>
    );
  }

  const activeFile = orderedFiles.find((file) => file.path === activeTab) ?? orderedFiles[0];
  const language = getLanguage(activeFile.path);

  React.useEffect(() => {
    if (isMarkdown(activeFile.path) || !codeRef.current) {
      return;
    }

    codeRef.current.removeAttribute('data-highlighted');
    hljs.highlightElement(codeRef.current);
  }, [activeFile.content, activeFile.path]);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="flex border-b bg-muted/40">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="flex-shrink-0 px-1.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div ref={tabsRef} className="flex flex-1 min-w-0 overflow-x-auto scrollbar-hide px-4">
          {orderedFiles.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setActiveTab(file.path)}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeFile.path === file.path
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
              title={file.path}
            >
              <FileCode className="h-4 w-4 flex-shrink-0" />
              <span>{file.path}</span>
            </button>
          ))}
        </div>
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="flex-shrink-0 px-1.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-6 relative group">
        {isMarkdown(activeFile.path) ? (
          <MarkdownWithMeta content={activeFile.content} />
        ) : (
          <>
            <button
              onClick={handleCopy}
              className={cn(
                "absolute top-8 right-8 p-2 rounded-md bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all opacity-0 group-hover:opacity-100",
                copied && "text-green-400 hover:text-green-400 opacity-100"
              )}
              title="Copy code"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-[0.875rem] leading-relaxed text-slate-100">
              <code ref={codeRef} className={`language-${language}`}>
                {activeFile.content}
              </code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
