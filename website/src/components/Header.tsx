import React from 'react';
import { Search, Moon, Sun, Menu, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { sitePath } from '../lib/routes';
import { ui } from '../i18n/utils';

const Github = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Header({
  lang = 'zh',
  toggleLang,
  searchQuery = '',
}: {
  lang?: 'zh' | 'en',
  toggleLang?: () => void,
  searchQuery?: string,
}) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const homeHref = sitePath();

  const t = (key: keyof typeof ui['zh']) => ui[lang][key];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleToggleLang = () => {
    if (toggleLang) {
      toggleLang();
    } else {
      const newLang = lang === 'zh' ? 'en' : 'zh';
      localStorage.setItem('lang', newLang);
      window.location.reload();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all",
        isScrolled ? "border-b" : "border-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <a href={homeHref} className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-xl tracking-tight">
              <span className="text-primary">Maa</span>Hub
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            <a href={sitePath('/skills')} className="transition-colors hover:text-foreground/80 text-foreground/60">{t('nav.skills')}</a>
            <a href={sitePath('/pipelines')} className="transition-colors hover:text-foreground/80 text-foreground/60">{t('nav.pipelines')}</a>
            <a href={sitePath('/customs')} className="transition-colors hover:text-foreground/80 text-foreground/60">{t('nav.customs')}</a>
            <a href={sitePath('/experiences')} className="transition-colors hover:text-foreground/80 text-foreground/60">{t('nav.experiences')}</a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form action={sitePath('/search')} method="get" className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder={t('search.placeholder')}
                className="flex h-9 w-full md:w-[300px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
              />
            </form>
          </div>
          <nav className="flex items-center space-x-2">
            <button 
              onClick={handleToggleLang}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-2 gap-1"
              title="Switch Language"
            >
              <Globe className="h-4 w-4" />
              <span className="font-bold">{lang === 'zh' ? '中' : 'En'}</span>
            </button>
            <a href="https://github.com/MaaXYZ/MaaHub" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <button 
              onClick={toggleTheme}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 relative"
            >
              <Sun className={cn("h-5 w-5 transition-all absolute", theme === 'dark' ? "rotate-90 scale-0" : "rotate-0 scale-100")} />
              <Moon className={cn("h-5 w-5 transition-all absolute", theme === 'dark' ? "rotate-0 scale-100" : "-rotate-90 scale-0")} />
              <span className="sr-only">Toggle theme</span>
            </button>
            <button className="inline-flex md:hidden items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Menu className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
