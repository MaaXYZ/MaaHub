import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './Header';
import { ArrowLeft, BookOpen, Clock, Tag, FileText, List } from 'lucide-react';
import { ui } from '../i18n/utils';
import { cn } from '../lib/utils';
import { sitePath } from '../lib/routes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';
import 'highlight.js/styles/github-dark.css';
import { parseFrontmatter } from '../lib/markdown';

type DownloadFile = {
  path: string;
  content: string;
};

type ExperienceDetailData = {
  id: string;
  title?: string;
  description?: string;
  author?: string;
  status?: string;
  updatedAt?: string;
  version?: string;
  tags?: string[];
  readme?: string;
  chapters?: Array<{
    title: string;
    path: string;
  }>;
  downloadFiles?: DownloadFile[];
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  // Clone string to avoid mutability issues with regex
  const str = String(markdown);
  while ((match = headingRegex.exec(str)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Basic link text extraction
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }
  return headings;
}

function ExperienceMarkdown({ content }: { content: string }) {
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
        <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeSlug]}
          >
            {body}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

// In a real app, this data would come from the astro page props (fetched from getCollection)
export function ExperienceDetailApp({ experienceId, experienceData, lang = 'zh' }: { experienceId: string, experienceData: ExperienceDetailData, lang?: 'zh' | 'en' }) {
  const [currentLang, setCurrentLang] = useState(lang);
  const [isClient, setIsClient] = useState(false);
  const [activeFile, setActiveFile] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setCurrentLang(savedLang);
    }
  }, []);

  // Determine initial active file
  useEffect(() => {
    if (!experienceData.downloadFiles || experienceData.downloadFiles.length === 0) {
      return;
    }

    const chapters = experienceData.chapters?.length
      ? experienceData.chapters
      : [{ title: 'README', path: experienceData.readme ? experienceData.readme.replace(/^\.\//, '') : 'index.md' }];

    const defaultFile = chapters
      .map((chapter) => chapter.path.replace(/^\.\//, ''))
      .map((chapter) => experienceData.downloadFiles?.find((file) => file.path === chapter || file.path.endsWith(chapter)))
      .find((file): file is DownloadFile => Boolean(file));

    if (defaultFile) {
      setActiveFile(defaultFile.path);
    } else {
      setActiveFile(experienceData.downloadFiles[0].path);
    }
  }, [experienceData.chapters, experienceData.downloadFiles, experienceData.readme]);

  const orderedChapters = useMemo(() => {
    const files = experienceData.downloadFiles ?? [];
    const chapters = experienceData.chapters?.length
      ? experienceData.chapters
      : files.map((file) => ({ title: file.path.split('/').pop() ?? file.path, path: file.path }));

    return chapters
      .map((chapter) => ({
        title: chapter.title,
        file: files.find((file) => file.path === chapter.path.replace(/^\.\//, '') || file.path.endsWith(chapter.path.replace(/^\.\//, ''))),
      }))
      .filter((chapter): chapter is { title: string; file: DownloadFile } => Boolean(chapter.file));
  }, [experienceData.chapters, experienceData.downloadFiles]);

  const currentFileContent = experienceData.downloadFiles?.find(f => f.path === activeFile)?.content || '*No content found.*';
  
  // Extract headings from the current markdown file
  const headings = useMemo(() => {
    if (activeFile.endsWith('.md') || activeFile.endsWith('.mdx')) {
      return extractHeadings(currentFileContent);
    }
    return [];
  }, [currentFileContent, activeFile]);

  if (!isClient) return <div className="min-h-screen" />;

  const toggleLang = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof ui['zh']) => ui[currentLang][key as keyof typeof ui['zh']] || key;

  // Handle smooth scrolling for headings
  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <>
      <Header lang={currentLang} toggleLang={toggleLang} />
      
      <main className="flex-1 bg-muted/10 pb-20">
        {/* Breadcrumb & Header Banner */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-8 md:px-8">
            <a href={sitePath('/experiences')} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </a>
            
            <div className="flex flex-col gap-6 md:items-start justify-between">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{experienceData.title}</h1>
                  <span className={cn(
                    "ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    experienceData.status === 'stable' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {experienceData.status}
                  </span>
                </div>
                
                <p className="text-xl text-muted-foreground mb-4 max-w-3xl">
                  {experienceData.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                      {experienceData.author?.charAt(0) || '?'}
                    </div>
                    <span className="font-medium text-foreground">{experienceData.author || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t('common.updated')} {experienceData.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>v{experienceData.version || '1.0.0'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {experienceData.tags?.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area with Sidebar Layout */}
        <div className="container mx-auto px-4 py-8 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Main Content */}
            <div className="flex-1 w-full order-2 lg:order-1 min-w-0">
              <div className="bg-card rounded-xl border shadow-sm p-6 md:p-10">
                {(activeFile.endsWith('.md') || activeFile.endsWith('.mdx')) ? (
                  <ExperienceMarkdown content={currentFileContent} />
                ) : (
                  <pre className="overflow-x-auto p-4 bg-muted/50 rounded-lg text-[0.875rem] leading-relaxed font-mono whitespace-pre-wrap">
                    <code>{currentFileContent}</code>
                  </pre>
                )}
              </div>
            </div>

            {/* Right Sidebar - Sticky */}
            <div className="w-full lg:w-72 shrink-0 order-1 lg:order-2 space-y-6 lg:sticky lg:top-20">
              
              {/* Chapter List */}
              {orderedChapters.length > 1 && (
                <div className="bg-card rounded-xl border shadow-sm p-5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {currentLang === 'zh' ? '章节' : 'Chapters'}
                  </h3>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {orderedChapters.map((chapter, index) => (
                      <button
                        key={chapter.file.path}
                        onClick={() => setActiveFile(chapter.file.path)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-md transition-colors truncate",
                          activeFile === chapter.file.path 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        title={chapter.title}
                      >
                        <span className="mr-2 text-xs text-muted-foreground">{index + 1}.</span>
                        {chapter.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Table of Contents (Outline) */}
              {headings.length > 0 && (
                <div className="bg-card rounded-xl border shadow-sm p-5 hidden lg:block">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <List className="h-4 w-4 text-muted-foreground" />
                    {currentLang === 'zh' ? '本章大纲' : 'On This Chapter'}
                  </h3>
                  <nav className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-2.5 text-sm">
                      {headings.map((heading) => {
                        // Indent based on heading level (H1 = 0, H2 = 2, H3 = 4, etc.)
                        const paddingLeft = `${(heading.level - 1) * 1}rem`;
                        return (
                          <li key={`${heading.id}-${heading.level}`} style={{ paddingLeft }}>
                            <a
                              href={`#${heading.id}`}
                              onClick={(e) => handleHeadingClick(e, heading.id)}
                              className="text-muted-foreground hover:text-primary transition-colors block truncate"
                              title={heading.text}
                            >
                              {heading.text}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </>
  );
}
