import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from './Header';
import { sitePath } from '../lib/routes';

type SearchItemType = 'skill' | 'pipeline' | 'custom' | 'experience';

type SearchItem = {
  id: string;
  title?: string;
  description?: string;
  author?: string;
  tags?: string[];
  updatedAt?: string;
  type: SearchItemType;
};

const typeRouteMap: Record<SearchItemType, string> = {
  skill: 'skills',
  pipeline: 'pipelines',
  custom: 'customs',
  experience: 'experiences',
};

const typeLabelMap = {
  zh: {
    skill: 'Skill',
    pipeline: 'Pipeline',
    custom: 'Custom',
    experience: '经验',
  },
  en: {
    skill: 'Skill',
    pipeline: 'Pipeline',
    custom: 'Custom',
    experience: 'Experience',
  },
} as const;

type SearchAppProps = {
  skillsData?: SearchItem[];
  pipelinesData?: SearchItem[];
  customsData?: SearchItem[];
  experiencesData?: SearchItem[];
};

function normalizeText(value?: string) {
  return value?.toLowerCase().trim() ?? '';
}

export function SearchApp({
  skillsData = [],
  pipelinesData = [],
  customsData = [],
  experiencesData = [],
}: SearchAppProps) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isClient, setIsClient] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setIsClient(true);

    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setLang(savedLang);
    } else {
      const docLang = document.documentElement.lang;
      if (docLang === 'en' || docLang === 'zh') {
        setLang(docLang);
      }
    }

    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q')?.trim() ?? '');
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
  };

  const allItems = useMemo(
    () => [
      ...skillsData.map((item) => ({ ...item, type: 'skill' as const })),
      ...pipelinesData.map((item) => ({ ...item, type: 'pipeline' as const })),
      ...customsData.map((item) => ({ ...item, type: 'custom' as const })),
      ...experiencesData.map((item) => ({ ...item, type: 'experience' as const })),
    ],
    [skillsData, pipelinesData, customsData, experiencesData]
  );

  const normalizedQuery = normalizeText(query);
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return allItems.slice(0, 24);
    }

    return allItems.filter((item) => {
      const haystacks = [
        item.title,
        item.description,
        item.author,
        ...(item.tags ?? []),
      ];

      return haystacks.some((value) => normalizeText(value).includes(normalizedQuery));
    });
  }, [allItems, normalizedQuery]);

  if (!isClient) return <div className="min-h-screen" />;

  const labels = typeLabelMap[lang];
  const title = lang === 'zh' ? '站内搜索' : 'Search';
  const subtitle = normalizedQuery
    ? (lang === 'zh' ? `共找到 ${results.length} 条与 “${query}” 相关的结果` : `${results.length} result(s) for "${query}"`)
    : (lang === 'zh' ? '输入关键词搜索 Skills、Pipelines、Customs 和经验内容。' : 'Search across skills, pipelines, customs, and experience content.');
  const emptyText = lang === 'zh' ? '没有找到匹配结果。' : 'No matching results found.';
  const hintText = lang === 'zh' ? '可尝试标题、作者、标签或描述中的关键词。' : 'Try keywords from titles, authors, tags, or descriptions.';

  return (
    <>
      <Header lang={lang} toggleLang={toggleLang} searchQuery={query} />
      <main className="flex-1">
        <section className="border-b border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 py-14 md:px-8">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Search className="h-4 w-4" />
                <span>{title}</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{subtitle}</p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 md:px-8">
            {results.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map((item) => (
                  <a
                    key={`${item.type}-${item.id}`}
                    href={sitePath(`/${typeRouteMap[item.type]}/${item.id}`)}
                    className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/70 p-6 transition-all hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {labels[item.type]}
                      </span>
                      {item.updatedAt ? (
                        <span className="text-xs text-muted-foreground">{item.updatedAt}</span>
                      ) : null}
                    </div>
                    <h2 className="text-lg font-semibold leading-snug">{item.title ?? item.id}</h2>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {item.description || hintText}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags?.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 text-sm text-muted-foreground">
                      {item.author || 'Unknown'}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
                <p className="text-lg font-semibold">{emptyText}</p>
                <p className="mt-2 text-sm text-muted-foreground">{hintText}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
