import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

type Currency = 'EUR' | 'USD' | 'CHF';
const CurrencyContext = createContext<{ 
  currency: Currency; 
  setCurrency: (c: Currency) => void;
  rates: Record<Currency, number>;
}>({ 
  currency: 'EUR', 
  setCurrency: () => {},
  rates: { EUR: 1, USD: 1.08, CHF: 0.95 }
});

const formatCurrency = (value: number, currency: Currency, rates: Record<Currency, number>) => {
  const converted = value * rates[currency];
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(converted);
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const TiltWrapper = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
import { 
  Compass, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  PencilRuler, 
  ThumbsUp, 
  TrendingUp, 
  TrendingDown,
  Smartphone,
  ShieldCheck,
  LineChart,
  Play,
  Apple,
  Twitter,
  Send,
  MessageSquare,
  BookOpen,
  Zap,
  Lock,
  Gift,
  Search,
  Unlock,
  Users
} from 'lucide-react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-200/40 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-200/40 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-blue-200/30 blur-[90px]"
      />
    </div>
  );
};

const TopBanner = () => {
  return (
    <div className="bg-brand-600 text-white text-sm font-medium py-2 px-4 text-center relative z-[60]">
      <span className="mr-2">🎁</span>
      Neu: Sichere dir unseren 50-seitigen Krypto-Starter-Guide 2026 – absolut kostenlos.
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { currency, setCurrency } = useContext(CurrencyContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    if (href.startsWith('#')) {
      return (
        <a href={isHome ? href : `/${href}`} className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
        {children}
      </Link>
    );
  };

  const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    if (href.startsWith('#')) {
      return (
        <a href={isHome ? href : `/${href}`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 py-2 border-b border-slate-50">
          {children}
        </a>
      );
    }
    return (
      <Link to={href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 py-2 border-b border-slate-50">
        {children}
      </Link>
    );
  };

  return (
    <>
    <TopBanner />
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6 mt-9'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-heading text-slate-900"><span className="font-bold">Krypto</span><span className="font-light">kompass</span></span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#kryptos">Kryptos</NavLink>
          <NavLink href="#akademie">Gratis Akademie</NavLink>
          <NavLink href="#vorteile">Premium Vorteile</NavLink>
          <NavLink href="#abonnements">Preise</NavLink>
          <NavLink href="/ueber-uns">Über Uns</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-full p-1">
            {(['EUR', 'USD', 'CHF'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${currency === c ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative group">
            <button className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors px-4 py-2">
              Einloggen
            </button>
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
              <p className="text-sm text-slate-600 mb-3">Noch kein Konto? Hol dir deinen kostenlosen Basic-Zugang.</p>
              <button className="w-full bg-brand-50 text-brand-700 font-medium py-2 rounded-xl hover:bg-brand-100 transition-colors">
                Kostenlos registrieren
              </button>
            </div>
          </div>
          <button className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-brand-500/30 active:scale-95">
            Jetzt starten
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-slate-100 overflow-hidden md:hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              <MobileNavLink href="#kryptos">Kryptos</MobileNavLink>
              <MobileNavLink href="#akademie">Gratis Akademie</MobileNavLink>
              <MobileNavLink href="#vorteile">Premium Vorteile</MobileNavLink>
              <MobileNavLink href="#abonnements">Preise</MobileNavLink>
              <MobileNavLink href="/ueber-uns">Über Uns</MobileNavLink>
              
              <div className="flex items-center justify-center bg-slate-100 rounded-full p-1 mt-4 mb-2">
                {(['EUR', 'USD', 'CHF'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setMobileMenuOpen(false); }}
                    className={`flex-1 text-sm font-bold px-4 py-2 rounded-full transition-all ${currency === c ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button className="w-full text-center text-brand-600 font-medium py-3.5 rounded-xl border-2 border-brand-100 hover:bg-brand-50 transition-colors">
                  Einloggen
                </button>
                <button className="w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-500/20">
                  Jetzt starten
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-brand-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-6 md:mb-8 shadow-sm"
            >
              <div className="bg-brand-100 text-brand-600 p-1 rounded-full">
                <Gift className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-xs md:text-sm font-medium text-slate-700">Lerne die Basics und schalte deinen ersten gratis Guide frei</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6"
            >
              Endlich ist Krypto für <span className="text-brand-600">alle</span> verständlich.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg"
            >
              Dein sicherer Einstieg in die Welt der digitalen Währungen. Von den ersten Schritten über sichere Aufbewahrung bis hin zu profitablen Trading-Strategien.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-base md:text-lg font-medium px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-brand-500/30 active:scale-95 flex items-center justify-center gap-2">
                  Kostenlos starten
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-medium pl-2 md:pl-4 text-center sm:text-left">100% kostenlos. Keine Kreditkarte erforderlich.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium max-w-[250px]">
                Schließe dich <span className="text-brand-600 font-bold">50.000+</span> Nutzern an, die unsere kostenlose Akademie bereits nutzen.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden md:block"
          >
            <TiltWrapper>
              <div className="relative aspect-[4/3] lg:aspect-square flex items-center justify-center">
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src="https://s1.directupload.eu/images/260224/9kyxkqja.png"
                  alt="Kryptokompass Hero"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </TiltWrapper>
            
            {/* Decorative elements */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Organic Curve Bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[100px] lg:h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.5,192.39,101.4,236.4,88.75,279.16,71.4,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

const CryptoTicker = () => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'handelbar' | 'topgewinner' | 'neu'>('handelbar');
  const { currency, rates } = useContext(CurrencyContext);

  const baseCryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
    { id: 'tether', symbol: 'USDT', name: 'Tether', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg' },
    { id: 'usd-coin', symbol: 'USDC', name: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg' },
  ];

  const top10Cryptos = [
    ...baseCryptos,
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg' },
    { id: 'tron', symbol: 'TRX', name: 'TRON', icon: 'https://cryptologos.cc/logos/tron-trx-logo.svg' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = top10Cryptos.map(c => c.id).join(',');
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur&include_24hr_change=true`);
        const data = await res.json();
        
        const formattedData = top10Cryptos.map(c => {
          const coinData = data[c.id];
          // Static fallback data to prevent jumping percentages if API fails
          const staticMockPrice = c.id === 'bitcoin' ? 62450.20 : c.id === 'ethereum' ? 3450.80 : c.id === 'solana' ? 145.20 : 1.00;
          const staticMockChange = c.id === 'bitcoin' ? 2.45 : c.id === 'ethereum' ? -1.20 : c.id === 'solana' ? 5.60 : 0.50;
          
          return {
            ...c,
            price: coinData?.eur || staticMockPrice,
            change: coinData?.eur_24h_change !== undefined ? coinData.eur_24h_change : staticMockChange
          };
        });
        
        setCryptoData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch crypto prices", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getDisplayData = () => {
    if (activeTab === 'handelbar') {
      return cryptoData.slice(0, 6);
    } else if (activeTab === 'topgewinner') {
      return [...cryptoData].sort((a, b) => b.change - a.change).slice(0, 6);
    } else if (activeTab === 'neu') {
      return cryptoData.slice(0, 6);
    }
    return [];
  };

  return (
    <section id="kryptos" className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Entdecken Sie Kryptos wie Bitcoin, Ethereum und Dogecoin
            </h2>
            <p className="text-base md:text-lg text-slate-600 mb-8">
              Einfach und sicher Hunderte von Kryptos kaufen, verkaufen und verwalten.
            </p>
            <button 
              onClick={() => window.open('https://www.coinbase.com/de/explore', '_blank')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white text-base md:text-lg font-medium px-8 py-4 rounded-full transition-all hover:shadow-xl active:scale-95"
            >
              Mehr Kryptos anzeigen
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full w-full"
          >
            <TiltWrapper>
              <div className="bg-[#0A0A0A] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/5 h-full flex flex-col w-full overflow-hidden">
                
                <div className="flex gap-2 sm:gap-6 border-b border-white/10 pb-4 md:pb-6 mb-4 md:mb-6 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setActiveTab('handelbar')}
                    className={`${activeTab === 'handelbar' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'} px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors`}
                  >
                    Handelbar
                  </button>
                  <button 
                    onClick={() => setActiveTab('topgewinner')}
                    className={`${activeTab === 'topgewinner' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'} px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors`}
                  >
                    Topgewinner
                  </button>
                  <button 
                    onClick={() => setActiveTab('neu')}
                    className={`${activeTab === 'neu' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'} px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors`}
                  >
                    Neu bei uns
                  </button>
                </div>

                <div className="space-y-4 md:space-y-6 flex-1 w-full">
                  {loading ? (
                    <div className="text-white/50 text-center py-10 animate-pulse">Kurse werden geladen...</div>
                  ) : (
                    getDisplayData().map((crypto, idx) => (
                      <motion.div 
                        key={crypto.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between group cursor-pointer w-full"
                      >
                        <div className="flex items-center gap-3 md:gap-4 truncate">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 p-1.5 md:p-2 flex items-center justify-center shrink-0">
                            <img src={crypto.icon} alt={crypto.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-base md:text-xl font-medium text-white group-hover:text-brand-400 transition-colors truncate">{crypto.name}</span>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <div className="text-base md:text-xl font-medium text-white">
                            {formatCurrency(crypto.price, currency, rates)}
                          </div>
                          <div className={`text-xs md:text-sm font-medium flex items-center justify-end gap-1 ${crypto.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {crypto.change >= 0 ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
                            {Math.abs(crypto.change).toFixed(2)}%
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </TiltWrapper>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CryptoGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setResult('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Erkläre den Krypto-Begriff "${searchTerm}" kurz, einfach und verständlich für einen Anfänger in maximal 3 Sätzen.`,
      });
      setResult(response.text || 'Keine Erklärung gefunden.');
    } catch (error) {
      console.error("Error fetching glossary term:", error);
      setResult('Es gab einen Fehler bei der Suche. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Krypto-Jargon unverständlich?</h2>
            <p className="text-lg text-slate-300 mb-10">Nutze unser kostenloses Web3-Lexikon und verstehe endlich, worüber alle reden.</p>
            
            <div className="relative max-w-xl mx-auto mb-8">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Suchbegriff eingeben (z.B. Blockchain, DeFi, Staking...)" 
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 text-white px-6 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Suchen
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left backdrop-blur-sm"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{searchTerm}</h3>
                  <p className="text-slate-300 leading-relaxed">{result}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Curriculum = () => {
  const sections = [
    {
      id: "kauf",
      title: "Bitcoin & Co. sicher einkaufen.",
      text: "Keine komplizierten Fachbegriffe. Wir zeigen dir Schritt für Schritt, wie du seriöse Börsen nutzt und deine ersten Kryptowährungen kaufst, ohne versteckte Gebühren.",
      image: "https://s1.directupload.eu/images/260223/2sge3uyt.webp",
      icon: <Smartphone className="w-6 h-6 text-brand-600" />,
      reverse: false
    },
    {
      id: "storage",
      title: "Deine Coins in absoluter Sicherheit.",
      text: "Not your keys, not your coins. Lerne alles über Cold Storage und wie du deine Assets auf Hardware Wallets (wie z.B. Ledger) einrichtest, um 100% Kontrolle über dein Portfolio zu behalten.",
      image: "https://s1.directupload.eu/images/260223/c4giabsn.webp",
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      reverse: true
    },
    {
      id: "trading",
      title: "Clever traden statt nur hoffen.",
      text: "Verstehe die Märkte. Wir bringen dir Chartanalyse bei und zeigen dir, wie du automatisierte Trading-Bots aufsetzt, die für dich arbeiten, während du schläfst.",
      image: "https://s1.directupload.eu/images/260223/lu625vzf.webp",
      icon: <LineChart className="w-6 h-6 text-brand-600" />,
      reverse: false
    }
  ];

  return (
    <section id="akademie" className="py-24 bg-white/60 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Dein Weg zum Krypto-Profi</h2>
          <p className="text-lg text-slate-600">Unser Curriculum ist so aufgebaut, dass du sicher und mit vollem Verständnis in den Markt einsteigst.</p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {sections.map((section, idx) => (
            <div key={section.id} className={`flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-6"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{section.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{section.text}</p>
                <a href="#abonnements" className="inline-block">
                  <button className="text-brand-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    Mehr erfahren <ArrowRight className="w-5 h-5" />
                  </button>
                </a>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 w-full"
              >
                <TiltWrapper>
                  <div className={`relative aspect-[4/3] overflow-hidden ${section.reverse ? 'rounded-tl-[100px] rounded-br-[100px] rounded-tr-3xl rounded-bl-3xl' : 'rounded-tr-[100px] rounded-bl-[100px] rounded-tl-3xl rounded-br-3xl'} shadow-2xl shadow-slate-200`}>
                    <img 
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay pointer-events-none"></div>
                  </div>
                </TiltWrapper>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <PencilRuler className="w-8 h-8 text-white" />,
      title: "Grundlagen lernen.",
      text: "Baue dir ein solides Fundament an Krypto-Wissen auf."
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-white" />,
      title: "Strategie wählen.",
      text: "Finde deinen Stil – vom langfristigen Investor bis zum aktiven Trader."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Signale nutzen.",
      text: "Profitiere von unseren exklusiven Marktanalysen."
    }
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative large circle */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-brand-100/50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">So einfach geht's</h2>
          <p className="text-lg text-slate-600">In drei simplen Schritten vom Anfänger zum souveränen Krypto-Anleger.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <TiltWrapper>
                <div className="bg-brand-600 rounded-[2rem] p-8 text-white relative overflow-hidden group h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                  
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 relative z-10"
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">{step.title}</h3>
                  <p className="text-brand-100 text-lg relative z-10 leading-relaxed">{step.text}</p>
                  
                  <div className="absolute bottom-6 right-6 text-white/20 font-heading font-bold text-6xl">
                    0{idx + 1}
                  </div>
                </div>
              </TiltWrapper>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PremiumFeatures = () => {
  const features = [
    {
      icon: <LineChart className="w-6 h-6 text-brand-600" />,
      title: "Präzise Trading-Signale",
      text: "Erhalte genaue Einstiegs-, Ausstiegs- und Stop-Loss-Ziele direkt auf dein Handy. Optimiere deine Gewinne mit unseren erprobten Strategien."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-600" />,
      title: "Tägliche Marktanalysen",
      text: "Verstehe, warum sich der Markt bewegt. Wir liefern dir tiefgehende Analysen zu Bitcoin, Ethereum und vielversprechenden Altcoins."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-brand-600" />,
      title: "Automatisierte Bots",
      text: "Lerne, wie du Trading-Bots einrichtest, die unsere Signale automatisch 24/7 für dich umsetzen – auch wenn du schläfst."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      title: "1-on-1 Mentoring",
      text: "Du steckst fest? Unsere Experten stehen dir in exklusiven Q&A-Sessions zur Seite und prüfen dein Portfolio."
    }
  ];

  return (
    <section id="vorteile" className="py-24 bg-brand-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-brand-100 text-brand-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">Warum kostenlos?</div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Wir glauben an finanzielle Bildung für alle.</h2>
          <p className="text-lg text-slate-600">Unsere Grundlagen-Akademie ist und bleibt zu 100% kostenlos. Wir finanzieren uns ausschließlich über unsere Profi-Tools und Premium-Signale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const { currency, rates } = useContext(CurrencyContext);
  
  return (
    <section id="abonnements" className="py-24 bg-white/60 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Dein Kompass für den Markt. Wähle deinen Plan.</h2>
          <p className="text-lg text-slate-600">Transparente Preise, keine versteckten Kosten. Starte kostenlos oder wähle das Premium-Paket für maximale Ergebnisse.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Basic Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <TiltWrapper>
              <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Akademie Basic</h3>
                <p className="text-slate-500 mb-8">Für den perfekten Start</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-slate-900">{formatCurrency(0, currency, rates)}</span>
                  <span className="text-slate-500"> / dauerhaft</span>
                </div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  {['Alle Grundlagen-Kurse', 'Wallet-Setup Guide', 'Community-Zugang', 'Wöchentlicher Newsletter'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-4 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:border-brand-600 hover:text-brand-600 transition-colors mt-auto">
                  Basic wählen
                </button>
              </div>
            </TiltWrapper>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <TiltWrapper>
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border-2 border-brand-500 shadow-2xl shadow-brand-500/20 relative h-full flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                  Beliebt
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium Signale</h3>
                <p className="text-slate-500 mb-8">Für ambitionierte Anleger</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-slate-900">{formatCurrency(49, currency, rates)}</span>
                  <span className="text-slate-500"> / Monat</span>
                </div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  {['Live Trading-Signale per App/Telegram', 'Tiefgehende Marktanalysen', 'Setup für automatisierte Bots', '1-on-1 Mentoring Q&A', 'Alles aus dem Basic Plan'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-4 rounded-full bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 mt-auto">
                  Premium freischalten
                </button>
              </div>
            </TiltWrapper>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Trust = () => {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full bg-slate-300"
              />
            </div>
            {/* Floating badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 md:bottom-8 md:-right-8 bg-white p-6 rounded-3xl shadow-xl max-w-xs"
            >
              <div className="flex gap-1 mb-2 text-amber-400">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <p className="text-slate-800 font-medium">"Ich konnte nicht glauben, wie viel tiefgreifendes Wissen hier völlig gratis geteilt wird."</p>
              <p className="text-sm text-slate-500 mt-2">— Michael S., Krypto-Anfänger</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Von Experten, für deinen Erfolg.</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Wir filtern den Lärm des Krypto-Marktes. Unser Ziel ist es, dir das nötige Werkzeug an die Hand zu geben, um eigenständige und sichere finanzielle Entscheidungen zu treffen.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Keine falschen Versprechungen, keine "Get Rich Quick" Schemata. Nur fundiertes Wissen, erprobte Strategien und eine Community, die sich gegenseitig unterstützt.
            </p>
            <button className="text-brand-600 font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all">
              Lerne unser Team kennen <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const GatedPreview = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">
            <Lock className="w-4 h-4" />
            Premium Deep-Dive
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">On-Chain Analyse: Wal-Bewegungen verstehen</h2>
        </div>

        <div className="relative">
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl leading-relaxed text-slate-700 font-medium">
              In dieser fortgeschrittenen Analyse werfen wir einen Blick hinter die Kulissen der Blockchain. Wir zeigen dir, wie du die Bewegungen der größten Marktteilnehmer (Wale) in Echtzeit verfolgst und für deine Trading-Entscheidungen nutzt.
            </p>
            <p className="text-lg leading-relaxed text-slate-600 mt-6">
              Die Grundlagen der On-Chain-Analyse basieren auf der Transparenz öffentlicher Ledger. Jeder Transfer, egal wie groß, ist für jeden sichtbar. Der Schlüssel liegt darin, das Rauschen herauszufiltern und die wirklich relevanten Transaktionen zu identifizieren...
            </p>
          </div>
          
          {/* Fade Out Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-8">
            <div className="bg-white shadow-xl border border-slate-100 rounded-2xl p-6 text-center max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Die Grundlagen schenken wir dir.</h3>
              <p className="text-slate-600 text-sm mb-4">Für die Deep-Dive-Analyse werde Premium-Mitglied und schalte alle fortgeschrittenen Strategien frei.</p>
              <a href="#abonnements">
                <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-xl transition-all">
                  Jetzt Premium freischalten
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Articles = () => {
  const articles = [
    {
      id: "bitcoin-bullrun",
      title: "Ist Bitcoin bereit für den nächsten Bullrun?",
      category: "Marktanalyse",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "hardware-wallets",
      title: "Hardware Wallets im Vergleich: Ledger vs. Trezor",
      category: "Sicherheit",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "trading-fehler",
      title: "Die 5 häufigsten Anfängerfehler beim Trading",
      category: "Trading",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="magazin" className="py-24 bg-white/60 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Neues aus dem Magazin</h2>
            <p className="text-lg text-slate-600">Aktuelle Insights, Analysen und Guides für deinen Krypto-Alltag.</p>
          </div>
          <button className="text-brand-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all whitespace-nowrap">
            Alle Artikel ansehen <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <Link to={`/artikel/${article.id}`} key={idx}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer h-full"
              >
                <TiltWrapper>
                  <div className="h-full flex flex-col">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative shrink-0">
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-brand-600">
                        {article.category}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-auto pt-4">
                      Artikel lesen <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </p>
                  </div>
                </TiltWrapper>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArticlePage = () => {
  const { id } = useParams();
  
  const articlesData: Record<string, any> = {
    'bitcoin-bullrun': {
      title: "Ist Bitcoin bereit für den nächsten Bullrun?",
      category: "Marktanalyse",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "24. Februar 2026",
      author: "Christian",
      content: (
        <>
          <p className="text-xl leading-relaxed text-slate-700 mb-6">
            Die Krypto-Märkte zeigen aktuell starke Anzeichen für eine bevorstehende Aufwärtsbewegung. Historische Daten und aktuelle makroökonomische Entwicklungen deuten darauf hin, dass Bitcoin sich in einer entscheidenden Akkumulationsphase befindet.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 mb-6">
            Nach dem letzten Halving hat sich das Angebot an neuen Bitcoins halbiert, während die Nachfrage durch institutionelle Investoren und ETFs stetig steigt. Dieser Angebotsschock hat in der Vergangenheit stets zu signifikanten Preissteigerungen geführt. Analysten beobachten zudem ein sinkendes Angebot auf den Börsen, da immer mehr Investoren ihre Coins in Cold Wallets verschieben.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Wichtige Erkenntnisse</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Das sinkende Angebot auf Börsen deutet auf eine langfristige Haltestrategie der Investoren hin.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Institutionelles Interesse durch ETFs stabilisiert den Markt zunehmend.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Makroökonomische Faktoren wie Zinssenkungen könnten als Katalysator wirken.</span>
            </li>
          </ul>
        </>
      )
    },
    'hardware-wallets': {
      title: "Hardware Wallets im Vergleich: Ledger vs. Trezor",
      category: "Sicherheit",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "20. Februar 2026",
      author: "Sarah",
      content: (
        <>
          <p className="text-xl leading-relaxed text-slate-700 mb-6">
            "Not your keys, not your coins" – dieses Mantra ist in der Krypto-Welt allgegenwärtig. Wer seine Kryptowährungen sicher aufbewahren möchte, kommt an einer Hardware Wallet nicht vorbei. Doch welches Modell ist das richtige für dich?
          </p>
          <p className="text-lg leading-relaxed text-slate-600 mb-6">
            In diesem Vergleich schauen wir uns die beiden Marktführer Ledger und Trezor genauer an. Beide bieten höchste Sicherheitsstandards, unterscheiden sich jedoch in der Bedienung, den unterstützten Coins und der Open-Source-Philosophie. Während Trezor komplett auf Open-Source-Software setzt, punktet Ledger mit einem proprietären Secure Element Chip, der auch in Kreditkarten verwendet wird.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Wichtige Erkenntnisse</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Hardware Wallets schützen deine Private Keys vor Online-Angriffen.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Trezor punktet mit Open-Source-Transparenz, Ledger mit breiterer Coin-Unterstützung.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Kaufe Hardware Wallets immer direkt beim Hersteller, niemals gebraucht.</span>
            </li>
          </ul>
        </>
      )
    },
    'trading-fehler': {
      title: "Die 5 häufigsten Anfängerfehler beim Trading",
      category: "Trading",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "15. Februar 2026",
      author: "Michael",
      content: (
        <>
          <p className="text-xl leading-relaxed text-slate-700 mb-6">
            Der Krypto-Markt lockt mit hohen Renditen, doch viele Anfänger verlieren ihr Geld schneller, als sie es investiert haben. Emotionen, fehlendes Wissen und Gier sind die größten Feinde eines erfolgreichen Traders.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 mb-6">
            FOMO (Fear of Missing Out) treibt viele dazu, am absoluten Hochpunkt zu kaufen, während Panikverkäufe am Tiefpunkt realisierte Verluste bedeuten. Ein weiterer klassischer Fehler ist das Trading ohne Stop-Loss. Wer sein Risiko nicht managt, setzt sein gesamtes Portfolio aufs Spiel. In diesem Artikel zeigen wir dir, wie du diese typischen Fallen vermeidest und eine rationale Trading-Strategie entwickelst.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Wichtige Erkenntnisse</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Nutze immer einen Stop-Loss, um dein Kapital zu schützen.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Lass dich nicht von FOMO leiten – ein verpasster Trade ist besser als ein verlorener.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Führe ein Trading-Tagebuch, um aus deinen Fehlern zu lernen.</span>
            </li>
          </ul>
        </>
      )
    }
  };

  const article = id && articlesData[id] ? articlesData[id] : articlesData['bitcoin-bullrun'];

  return (
    <div className="pt-32 pb-24 bg-transparent relative overflow-hidden min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-8 transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180" /> Zurück zur Startseite
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-brand-100 text-brand-700 px-4 py-1 rounded-full text-sm font-semibold">{article.category}</span>
            <span className="text-slate-500 text-sm">{article.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://i.pravatar.cc/100?img=11" alt={article.author} className="w-full h-full object-cover" />
            </div>
            <span className="font-medium text-slate-700">{article.author}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl"
        >
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-slate max-w-none"
        >
          {article.content}
        </motion.div>
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="pt-32 pb-24 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">Über Kryptokompass</h1>
          <p className="text-xl text-brand-600 font-medium">Unsere Mission: Krypto-Wissen, das dich unabhängig macht.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg prose-slate max-w-none mb-20"
        >
          <p className="text-xl leading-relaxed text-slate-700">
            Kryptowährungen bieten die einmalige Chance auf finanzielle Souveränität – doch der Einstieg ist oft von komplexem Fachjargon, unübersichtlichen Tools und unnötigen Risiken geprägt. Die Mission von Kryptokompass ist es, genau diese Hürden abzubauen. Wir übersetzen die komplexe Web3-Welt in klare, umsetzbare Strategien.
          </p>
          <p className="text-xl leading-relaxed text-slate-700 mt-6">
            Wir glauben daran, dass jeder das Werkzeug haben sollte, um eigenständige finanzielle Entscheidungen zu treffen. Deshalb bieten wir eine vertrauenswürdige Plattform, die dir genau zeigt, wie du sicher in Bitcoin & Co. investierst, automatisierte Trading-Bots aufsetzt, Premium-Signale nutzt und deine digitalen Werte absolut sicher verwahrst.
          </p>
        </motion.div>

        <div className="mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center"
          >
            Der Motor deines Krypto-Erfolgs
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto"
          >
            Tausende steigen täglich in den Krypto-Markt ein – doch nur die wenigsten haben einen klaren Plan. Wir ersetzen Hoffnung durch Strategie und Halbwissen durch echte Expertise.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8 text-brand-600" />,
                title: "Praxisnahe Akademie",
                text: "Von den absoluten Grundlagen bis zum fortgeschrittenen Chart-Reading."
              },
              {
                icon: <Zap className="w-8 h-8 text-brand-600" />,
                title: "Premium Signale",
                text: "Echtzeit-Marktanalysen und konkrete Setups für dein Portfolio."
              },
              {
                icon: <Lock className="w-8 h-8 text-brand-600" />,
                title: "Fokus auf Sicherheit",
                text: "Kompromisslose Aufklärung über Cold Storage, Hardware Wallets und den Schutz deiner Assets."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-600 rounded-[3rem] p-10 md:p-16 text-white mb-24 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Sicherheit & Eigenverantwortung als Fundament</h2>
          <p className="text-lg text-brand-100 leading-relaxed relative z-10 mb-6">
            Vertrauen im Krypto-Space bedeutet vor allem eines: Kontrolle über die eigenen Werte. „Not your keys, not your coins“ ist bei uns nicht nur ein Spruch, sondern die Basis unserer Ausbildung.
          </p>
          <p className="text-lg text-brand-100 leading-relaxed relative z-10">
            Wir legen höchsten Wert darauf, dir zu zeigen, wie du dich unabhängig von zentralen Börsen machst und dein Portfolio vor externen Zugriffen schützt. Anstatt dir nur zu sagen, was du kaufen sollst, bringen wir dir bei, wie du den Markt verstehst und Risiken professionell managst.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Wer wir sind</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Hinter Kryptokompass steht Christian. Aus der eigenen, jahrelangen Praxis an den Krypto-Märkten – vom Aufsetzen effizienter Trading-Bots bis hin zur tiefgehenden Analyse von Marktzyklen – entstand die Vision, eine Plattform zu schaffen, die den Lärm ausblendet.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Keine leeren Hypes, keine falschen Versprechen. Stattdessen echte Strategien, getestete Methoden und eine Community, die sich gegenseitig unterstützt.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <TiltWrapper>
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Christian - Gründer von Kryptokompass" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </TiltWrapper>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-slate-50 rounded-[3rem] p-12 border border-slate-100"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Werde Teil der Community.</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Unser Leitbild ist es, dir die Kontrolle über deine finanzielle Zukunft zurückzugeben. Komm an Bord, nutze unseren Kompass und navigiere sicher durch den Krypto-Markt.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-lg font-medium px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-brand-500/30 active:scale-95">
                Jetzt kostenlos starten
              </button>
            </Link>
            <Link to="/#abonnements">
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 text-lg font-medium px-8 py-4 rounded-full transition-all active:scale-95">
                Zu den Premium-Signalen
              </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-600 relative overflow-hidden pt-24 pb-12">
      {/* Decorative contour lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-tight">
            Hol dir den Kryptokompass direkt aufs Handy.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-colors w-full sm:w-auto justify-center">
              <Apple className="w-8 h-8" />
              <div className="text-left">
                <div className="text-xs text-slate-300">Download on the</div>
                <div className="text-lg font-semibold leading-none">App Store</div>
              </div>
            </button>
            <button className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-colors w-full sm:w-auto justify-center">
              <Play className="w-8 h-8" />
              <div className="text-left">
                <div className="text-xs text-slate-300">GET IT ON</div>
                <div className="text-lg font-semibold leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-white/20 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <Compass className="w-6 h-6" />
              <span className="text-xl font-heading font-bold">Kryptokompass</span>
            </div>
            <div className="flex items-center gap-4 text-brand-200">
              <a href="#" className="hover:text-white transition-colors p-2 bg-brand-700/50 rounded-full hover:bg-brand-500" aria-label="Telegram">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-brand-700/50 rounded-full hover:bg-brand-500" aria-label="Discord">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-brand-700/50 rounded-full hover:bg-brand-500" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-brand-100 text-sm">
            <a href="#" className="hover:text-white transition-colors">Impressum</a>
            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white transition-colors">AGB</a>
            <a href="#" className="hover:text-white transition-colors">Kontakt</a>
          </div>
          
          <div className="text-brand-200 text-sm">
            &copy; {new Date().getFullYear()} Kryptokompass. Alle Rechte vorbehalten.
          </div>
        </div>
      </div>
    </footer>
  );
};

const FearGreedIndex = () => {
  const [value, setValue] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFGI = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/');
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          setValue(parseInt(data.data[0].value, 10));
        }
      } catch (error) {
        console.error("Failed to fetch Fear & Greed Index", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFGI();
  }, []);

  const getStatus = (val: number) => {
    if (val < 25) return { text: "Extreme Fear", color: "text-rose-500", bg: "bg-rose-500" };
    if (val < 45) return { text: "Fear", color: "text-orange-500", bg: "bg-orange-500" };
    if (val < 55) return { text: "Neutral", color: "text-amber-500", bg: "bg-amber-500" };
    if (val < 75) return { text: "Greed", color: "text-emerald-500", bg: "bg-emerald-500" };
    return { text: "Extreme Greed", color: "text-teal-500", bg: "bg-teal-500" };
  };

  const status = getStatus(value);
  const rotation = (value / 100) * 180 - 90;

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="inline-block bg-brand-100 text-brand-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">Marktstimmung</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Fear & Greed Index</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Der Krypto-Markt wird stark von Emotionen getrieben. Unser Echtzeit-Tacho aggregiert Volatilität, Marktmomentum, Social Media und Dominanz, um dir die aktuelle Marktstimmung auf einen Blick zu zeigen.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" />
                <span className="text-slate-700"><strong>Extreme Fear</strong> kann eine Kaufgelegenheit sein.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" />
                <span className="text-slate-700"><strong>Extreme Greed</strong> bedeutet oft, dass eine Korrektur bevorsteht.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center relative"
          >
            <div className="relative w-64 h-32 overflow-hidden mb-8">
              {/* Speedometer Arc */}
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[30px] border-slate-100"></div>
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[30px] border-transparent border-t-rose-500 border-l-orange-500 border-b-emerald-500 border-r-teal-500 rotate-45 opacity-20"></div>
              
              {/* Needle */}
              <motion.div 
                className="absolute bottom-0 left-1/2 w-2 h-32 origin-bottom -ml-1"
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              >
                <div className="w-2 h-24 bg-slate-800 rounded-t-full mx-auto shadow-lg"></div>
                <div className="w-6 h-6 bg-slate-800 rounded-full absolute bottom-[-12px] left-[-8px] border-4 border-white shadow-md"></div>
              </motion.div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 mb-2">{Math.round(value)}</div>
              <div className={`text-2xl font-bold ${status.color}`}>{status.text}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [rates, setRates] = useState<Record<Currency, number>>({ EUR: 1, USD: 1.08, CHF: 0.95 });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await res.json();
        setRates({
          EUR: 1,
          USD: data.rates.USD || 1.08,
          CHF: data.rates.CHF || 0.95
        });
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      }
    };
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates }}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen font-sans text-slate-800 selection:bg-brand-200 selection:text-brand-900">
          <AnimatedBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <CryptoTicker />
                <Curriculum />
                <HowItWorks />
                <FearGreedIndex />
                <CryptoGlossary />
                <PremiumFeatures />
                <GatedPreview />
                <Pricing />
                <Trust />
                <Articles />
              </main>
            } />
            <Route path="/ueber-uns" element={<AboutUs />} />
            <Route path="/artikel/:id" element={<ArticlePage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CurrencyContext.Provider>
  );
}
