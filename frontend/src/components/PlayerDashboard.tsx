import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Server, Play, Search, SlidersHorizontal, X, 
  Clock, ExternalLink, CheckCircle2, Shield, ChevronLeft, ChevronRight,
  Volume2, VolumeX, CreditCard, Smartphone, Building2, Wallet, ChevronDown, Lock, Globe, Coins
} from 'lucide-react';

interface Game {
  id: number;
  appId: number;
  title: string;
  genre: string;
  status: string;
  played: string;
  hours: string;
  image: string;
  banner: string;
  active?: boolean;
  synopsis: string;
  reviewSentiment: string;
  ratingScore: number;
  steamTags: string[];
  videoUrl?: string | null;
}

export default function PlayerDashboard({ onLaunchGame }: { onLaunchGame?: (title: string, steamUri?: string) => void }) {
  const [filter, setFilter] = useState('All Games');
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Search Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<string | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isFilterOpen]);

  // Multi-Currency & Global Regional State
  type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'IDR';
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'APAC' | 'Americas' | 'Europe'>('ALL');

  const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; decimals: number; label: string; flag: string }> = {
    USD: { symbol: '$', rate: 1.0, decimals: 2, label: 'USD', flag: '🇺🇸' },
    EUR: { symbol: '€', rate: 0.92, decimals: 2, label: 'EUR', flag: '🇪🇺' },
    GBP: { symbol: '£', rate: 0.79, decimals: 2, label: 'GBP', flag: '🇬🇧' },
    JPY: { symbol: '¥', rate: 152, decimals: 0, label: 'JPY', flag: '🇯🇵' },
    IDR: { symbol: 'Rp ', rate: 15800, decimals: 0, label: 'IDR', flag: '🇮🇩' },
  };

  const formatPrice = (usdAmount: number, code: CurrencyCode = selectedCurrency) => {
    const config = CURRENCIES[code] || CURRENCIES.USD;
    const value = usdAmount * config.rate;
    if (config.decimals === 0) {
      return `${config.symbol}${Math.round(value).toLocaleString('id-ID')}`;
    }
    return `${config.symbol}${value.toFixed(config.decimals)}`;
  };

  // Rent-to-Play Universal State
  const [rentalHours, setRentalHours] = useState(2);
  const [selectedNode, setSelectedNode] = useState('JK-01');
  const [isRentSuccess, setIsRentSuccess] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [expandedSection, setExpandedSection] = useState<string>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Standardized Worldwide Cloud Node Tiers (Worldwide Edge Network)
  const nodes = [
    { 
      id: 'JK-01', 
      tier: 'Tier 1', 
      region: 'APAC',
      location: 'Jakarta', 
      name: 'Jakarta Edge (JK-01)', 
      flag: '🇮🇩',
      gpu: 'RTX 4070 Ti', 
      latency: '2ms', 
      ratePerHour: 0.85 
    },
    { 
      id: 'SG-01', 
      tier: 'Tier 2', 
      region: 'APAC',
      location: 'Singapore', 
      name: 'Singapore Premium (SG-01)', 
      flag: '🇸🇬',
      gpu: 'RTX 4080', 
      latency: '15ms', 
      ratePerHour: 1.25 
    },
    { 
      id: 'TY-01', 
      tier: 'Tier 3', 
      region: 'APAC',
      location: 'Tokyo', 
      name: 'Tokyo Ultra (TY-01)', 
      flag: '🇯🇵',
      gpu: 'RTX 4090', 
      latency: '22ms', 
      ratePerHour: 1.75 
    },
    { 
      id: 'US-01', 
      tier: 'Tier 3', 
      region: 'Americas',
      location: 'Silicon Valley', 
      name: 'California Ultra (US-01)', 
      flag: '🇺🇸',
      gpu: 'RTX 4090', 
      latency: '10ms', 
      ratePerHour: 1.75 
    },
    { 
      id: 'EU-01', 
      tier: 'Tier 3', 
      region: 'Europe',
      location: 'London', 
      name: 'London Ultra (EU-01)', 
      flag: '🇬🇧',
      gpu: 'RTX 4090', 
      latency: '15ms', 
      ratePerHour: 1.75 
    },
    { 
      id: 'EU-02', 
      tier: 'Tier 2', 
      region: 'Europe',
      location: 'Frankfurt', 
      name: 'Frankfurt Central (EU-02)', 
      flag: '🇩🇪',
      gpu: 'RTX 4080 Super', 
      latency: '12ms', 
      ratePerHour: 1.30 
    },
  ];

  const filteredNodes = nodes.filter(n => selectedRegion === 'ALL' || n.region === selectedRegion);

  const games: Game[] = [
    { 
      id: 101, 
      appId: 2581700, 
      title: 'MotoGP 24', 
      genre: 'Racing', 
      status: 'Ready', 
      active: true, 
      played: 'Today', 
      hours: '18 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2581700/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2581700/library_hero.jpg',
      synopsis: 'Unleash your passion for the official 2024 MotoGP™ season. Experience the dynamic Riders Market, full weather variability, and realistic physics across all official tracks and riders with instant Steam Cloud connection.',
      reviewSentiment: 'Very Positive (86%)',
      ratingScore: 86,
      steamTags: ['Racing', 'Bikes', 'Simulation', 'Motorbike', 'Multiplayer'],
      videoUrl: null
    },
    { 
      id: 102, 
      appId: 3405690, 
      title: 'EA FC 26', 
      genre: 'Sports', 
      status: 'Playing Now', 
      active: true, 
      played: 'Today', 
      hours: '64 hrs', 
      image: '/eafc26_beranda.jpg', 
      banner: '/eafc26hd_details.jpeg',
      synopsis: 'The next evolution of the World’s Game. EA SPORTS FC™ 26 delivers cutting edge volumetric animations, enhanced tactical IQ, and connected cross-platform Ultimate Team with direct Steam Cloud launch.',
      reviewSentiment: 'Very Positive (85%)',
      ratingScore: 85,
      steamTags: ['Football', 'Sports', 'Simulation', 'Soccer', 'Multiplayer'],
      videoUrl: '/videos/eafc25.mp4'
    },
    { 
      id: 103, 
      appId: 460930, 
      title: "Tom Clancy's Ghost Recon Wildlands", 
      genre: 'Shooter', 
      status: 'Ready', 
      active: true, 
      played: 'Yesterday', 
      hours: '95 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/460930/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/460930/library_hero.jpg',
      synopsis: 'Create a team with up to 3 friends in Tom Clancy’s Ghost Recon® Wildlands and enjoy the ultimate military shooter experience set in a massive, responsive open world.',
      reviewSentiment: 'Very Positive (82%)',
      ratingScore: 82,
      steamTags: ['Open World', 'Coop', 'Action', 'Shooter', 'Tactical', 'Military'],
      videoUrl: null
    },
    { 
      id: 2, 
      appId: 2669320, 
      title: 'EA FC 25', 
      genre: 'Sports', 
      status: 'Playing Now', 
      active: true, 
      played: 'Today', 
      hours: '124 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/library_hero.jpg',
      synopsis: 'Experience unrivaled realism in EA SPORTS FC™ 25, featuring 19,000+ players across 700+ teams powered by HyperMotionV and volumetric motion capture.',
      reviewSentiment: 'Very Positive (82%)',
      ratingScore: 82,
      steamTags: ['Football', 'Sports', 'Simulation', 'Multiplayer'],
      videoUrl: '/videos/eafc25.mp4'
    },
    { 
      id: 1, 
      appId: 1091500, 
      title: 'Cyberpunk 2077', 
      genre: 'RPG', 
      status: 'Ready', 
      played: 'Yesterday', 
      hours: '86 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg',
      synopsis: 'Cyberpunk 2077 is an open world, action adventure RPG set in the dark future of Night City, an immense metropolis obsessed with power, glamour, and body modding.',
      reviewSentiment: 'Overwhelmingly Positive (92%)',
      ratingScore: 92,
      steamTags: ['Cyberpunk', 'Open World', 'RPG', 'Story Rich'],
      videoUrl: '/videos/cyberpunk.mp4'
    },
    { 
      id: 7, 
      appId: 2215430, 
      title: 'Ghost of Tsushima', 
      genre: 'Action', 
      status: 'Ready', 
      played: 'Oct 2', 
      hours: '40 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_hero.jpg',
      synopsis: 'Forge a new path and wage an unconventional war for the freedom of Tsushima in this critically acclaimed open world action adventure masterpiece.',
      reviewSentiment: 'Overwhelmingly Positive (93%)',
      ratingScore: 93,
      steamTags: ['Open World', 'Action', 'Historical', 'Swordplay'],
      videoUrl: null
    },
    { 
      id: 8, 
      appId: 1086940, 
      title: "Baldur's Gate 3", 
      genre: 'RPG', 
      status: 'Ready', 
      played: 'Sep 28', 
      hours: '150 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_hero.jpg',
      synopsis: 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
      reviewSentiment: 'Overwhelmingly Positive (96%)',
      ratingScore: 96,
      steamTags: ['RPG', 'D&D', 'Choices Matter', 'Turn-Based'],
      videoUrl: null
    },
    { 
      id: 9, 
      appId: 1245620, 
      title: 'Elden Ring', 
      genre: 'Action RPG', 
      status: 'Ready', 
      played: 'Sep 15', 
      hours: '220 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg',
      synopsis: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
      reviewSentiment: 'Very Positive (91%)',
      ratingScore: 91,
      steamTags: ['Souls like', 'Dark Fantasy', 'Open World', 'RPG'],
      videoUrl: null
    },
    { 
      id: 5, 
      appId: 2358720, 
      title: 'Black Myth: Wukong', 
      genre: 'Action RPG', 
      status: 'Ready', 
      played: '1 week ago', 
      hours: '32 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_hero.jpg',
      synopsis: 'You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend.',
      reviewSentiment: 'Overwhelmingly Positive (95%)',
      ratingScore: 95,
      steamTags: ['Mythology', 'Action RPG', 'Souls like', 'Difficult'],
      videoUrl: '/videos/wukong.mp4'
    },
    { 
      id: 3, 
      appId: 553850, 
      title: 'Helldivers 2', 
      genre: 'Shooter', 
      status: 'Ready', 
      played: '2 days ago', 
      hours: '45 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/library_hero.jpg',
      synopsis: 'Join the Helldivers and fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third person shooter.',
      reviewSentiment: 'Mostly Positive (78%)',
      ratingScore: 78,
      steamTags: ['Coop', 'Shooter', 'Action', 'Sci Fi'],
      videoUrl: null
    },
    { 
      id: 4, 
      appId: 1551360, 
      title: 'Forza Horizon 5', 
      genre: 'Racing', 
      status: 'Update Available', 
      played: '5 days ago', 
      hours: '210 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/library_hero.jpg',
      synopsis: 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.',
      reviewSentiment: 'Very Positive (88%)',
      ratingScore: 88,
      steamTags: ['Racing', 'Open World', 'Automobile Sim', 'Multiplayer'],
      videoUrl: null
    },
    { 
      id: 6, 
      appId: 1174180, 
      title: 'Red Dead Redemption 2', 
      genre: 'Action', 
      status: 'Cloud Syncing...', 
      played: '2 weeks ago', 
      hours: '180 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_hero.jpg',
      synopsis: 'Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America.',
      reviewSentiment: 'Very Positive (91%)',
      ratingScore: 91,
      steamTags: ['Western', 'Open World', 'Story Rich', 'Masterpiece'],
      videoUrl: null
    },
    { 
      id: 10, 
      appId: 271590, 
      title: 'Grand Theft Auto V', 
      genre: 'Action', 
      status: 'Ready', 
      played: 'Sep 10', 
      hours: '800 hrs', 
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg', 
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_hero.jpg',
      synopsis: 'When a young street hustler, a retired bank robber and a terrifying psychopath land themselves in trouble, they must pull off a series of dangerous heists to survive.',
      reviewSentiment: 'Very Positive (86%)',
      ratingScore: 86,
      steamTags: ['Action', 'Open World', 'Multiplayer', 'Crime'],
      videoUrl: null
    },
    { 
      id: 11, 
      appId: 2182340, 
      title: 'Valorant', 
      genre: 'Tactical Shooter', 
      status: 'Ready', 
      played: '3 days ago', 
      hours: '340 hrs', 
      image: '/valorant.jpg', 
      banner: '/valorant.jpg',
      synopsis: 'A 5v5 character based tactical shooter where precise gunplay meets unique agent abilities. Stream with under 2ms input latency via OmniPlay Jakarta Edge and official Steam Cloud integration.',
      reviewSentiment: 'Very Positive (94%)',
      ratingScore: 94,
      steamTags: ['Tactical', 'FPS', 'Competitive', 'Multiplayer'],
      videoUrl: '/videos/valorant.mp4'
    },
    {
      id: 12,
      appId: 1234567,
      title: 'Meccha Chameleon',
      genre: 'Indie / Action',
      status: 'Trending #1',
      played: '2026 Viral Hit',
      hours: '18 hrs',
      image: '/meccha_chameleon.jpg',
      banner: '/meccha_chameleon.jpg',
      synopsis: 'The breakout viral sensation of 2026! Play as an ultra adaptive robotic chameleon with high speed color camouflaging and tongue grapple physics across chaotic neon arenas.',
      reviewSentiment: 'Overwhelmingly Positive (98%)',
      ratingScore: 98,
      steamTags: ['Viral Sensation', 'Action', 'Indie', 'Physics', 'Multiplayer'],
      videoUrl: null
    },
    {
      id: 13,
      appId: 1623730,
      title: 'Palworld',
      genre: 'Action RPG / Multiplayer',
      status: 'Ready',
      played: 'Yesterday',
      hours: '164 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_hero.jpg',
      synopsis: 'Fight, farm, build and work alongside mysterious creatures called "Pals" in this completely new multiplayer, open world survival crafting game.',
      reviewSentiment: 'Very Positive (93%)',
      ratingScore: 93,
      steamTags: ['Open World', 'Creature Collector', 'Survival', 'Crafting', 'Multiplayer'],
      videoUrl: null
    },
    {
      id: 14,
      appId: 1085660,
      title: 'Destiny 2',
      genre: 'Action MMO',
      status: 'Ready',
      played: '2 days ago',
      hours: '420 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_hero.jpg',
      synopsis: 'Dive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first person shooter combat in the Final Shape expansion era.',
      reviewSentiment: 'Very Positive (84%)',
      ratingScore: 84,
      steamTags: ['Action MMO', 'FPS', 'Looter Shooter', 'Coop', 'Sci Fi'],
      videoUrl: null
    },
    {
      id: 15,
      appId: 292030,
      title: 'The Witcher 3: Wild Hunt',
      genre: 'RPG',
      status: 'Ready',
      played: 'Last week',
      hours: '280 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_hero.jpg',
      synopsis: 'You are Geralt of Rivia, mercenary monster slayer. As war rages, track down the Child of Prophecy in the enhanced Next Gen visual update.',
      reviewSentiment: 'Overwhelmingly Positive (97%)',
      ratingScore: 97,
      steamTags: ['RPG', 'Open World', 'Story Rich', 'Masterpiece', 'Fantasy'],
      videoUrl: null
    },
    {
      id: 16,
      appId: 814380,
      title: 'Sekiro: Shadows Die Twice',
      genre: 'Action',
      status: 'Ready',
      played: '3 days ago',
      hours: '95 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_hero.jpg',
      synopsis: 'Carve your own clever path to vengeance in this critically acclaimed adventure from developer FromSoftware, creators of Bloodborne and Dark Souls.',
      reviewSentiment: 'Overwhelmingly Positive (95%)',
      ratingScore: 95,
      steamTags: ['Souls like', 'Action', 'Difficult', 'Ninja', 'Singleplayer'],
      videoUrl: null
    },
    {
      id: 17,
      appId: 9999992,
      title: 'Windrose',
      genre: 'Indie RPG',
      status: '2026 Hit',
      played: '3 days ago',
      hours: '38 hrs',
      image: '/windrose.jpg',
      banner: '/windrose.jpg',
      synopsis: 'The critically acclaimed 2026 breakout indie RPG. Sail across the windswept celestial archipelagos, master elemental navigation spells, and forge a living legacy.',
      reviewSentiment: 'Overwhelmingly Positive (96%)',
      ratingScore: 96,
      steamTags: ['Indie RPG', 'Exploration', 'Story Rich', 'Atmospheric', 'Magic'],
      videoUrl: null
    },
    {
      id: 18,
      appId: 641990,
      title: 'The Escapists 2',
      genre: 'Strategy',
      status: 'Ready',
      played: '5 days ago',
      hours: '72 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/library_hero.jpg',
      synopsis: 'Risk it all to breakout from the toughest prisons in the world. Explore the biggest prisons yet, with multiple floors, roofs, vents and underground tunnels!',
      reviewSentiment: 'Very Positive (90%)',
      ratingScore: 90,
      steamTags: ['Strategy', 'Multiplayer', 'Pixel Graphics', 'Coop', 'Funny'],
      videoUrl: null
    },
    {
      id: 20,
      appId: 730,
      title: 'Counter-Strike 2',
      genre: 'Competitive FPS',
      status: 'Ready',
      played: 'Today',
      hours: '512 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_hero.jpg',
      synopsis: 'The biggest technical leap in Counter-Strike history. CS2 delivers a complete overhaul with Source 2 engine, subtick architecture for ultra precise hit registration, and volumetric smoke grenades.',
      reviewSentiment: 'Very Positive (89%)',
      ratingScore: 89,
      steamTags: ['FPS', 'Competitive', 'Tactical', 'Multiplayer', 'Free to Play'],
      videoUrl: null
    },
    {
      id: 21,
      appId: 9000001,
      title: 'Ace Combat 8: Wings of Theve',
      genre: 'Flight / Action',
      status: 'Ready',
      played: '2 days ago',
      hours: '28 hrs',
      image: '/acecombat8beranda.png',
      banner: '/acecombat8detail.png',
      synopsis: 'Soar into the next era of aerial combat in Ace Combat 8: Wings of Theve. Experience hypersonic dogfights over breathtaking skyscapes with next gen flight physics and fully orchestrated cinematic storytelling.',
      reviewSentiment: 'Very Positive (90%)',
      ratingScore: 90,
      steamTags: ['Flight', 'Action', 'Arcade', 'Cinematic', 'Singleplayer'],
      videoUrl: null
    },
    {
      id: 22,
      appId: 9000002,
      title: "Gears of War: E-Day",
      genre: 'Cover Shooter',
      status: 'Ready',
      played: 'Yesterday',
      hours: '19 hrs',
      image: '/gearofwarberandahd.jpeg',
      banner: '/gearofwardetailhd.jpeg',
      synopsis: 'The harrowing origin story of E-Day — the day the Locust first emerged from underground and changed humanity forever. Play as young Marcus Fenix and Dom Santiago in this gripping prequel built on Unreal Engine 5.',
      reviewSentiment: 'Very Positive (91%)',
      ratingScore: 91,
      steamTags: ['Cover Shooter', 'Action', 'Sci Fi', 'Coop', 'Story Rich'],
      videoUrl: null
    },
    {
      id: 23,
      appId: 9000003,
      title: 'WARDOGS',
      genre: 'Tactical Shooter',
      status: 'Ready',
      played: '3 days ago',
      hours: '44 hrs',
      image: '/wardogsberandahd.png',
      banner: '/wardogsdetailhd.png',
      synopsis: 'An intense squad based tactical shooter set in near future conflict zones. Build your squad of elite mercenaries, manage resources under fire, and survive brutal asymmetric warfare across global hot zones.',
      reviewSentiment: 'Mostly Positive (81%)',
      ratingScore: 81,
      steamTags: ['Tactical', 'Military', 'Shooter', 'Multiplayer', 'Strategy'],
      videoUrl: null
    },
    {
      id: 24,
      appId: 570,
      title: 'Dota 2',
      genre: 'MOBA',
      status: 'Ready',
      played: 'Today',
      hours: '1,240 hrs',
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/header.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/library_hero.jpg',
      synopsis: 'Every day, millions of players worldwide enter the battle as one of over a hundred Dota heroes. No matter if it is your first time in the game or you\'re a veteran, there\'s always something new to discover.',
      reviewSentiment: 'Very Positive (83%)',
      ratingScore: 83,
      steamTags: ['MOBA', 'Strategy', 'Competitive', 'Multiplayer', 'Free to Play'],
      videoUrl: null
    },
    {
      id: 25,
      appId: 9000004,
      title: 'Control: Resonant',
      genre: 'Action / Supernatural',
      status: 'Ready',
      played: '4 days ago',
      hours: '36 hrs',
      image: '/controlresonantberanda.png',
      banner: '/controlresonantdetail.png',
      synopsis: 'Return to the Oldest House in this direct sequel to the award winning Control. Jesse Faden faces a new supernatural resonance threat that rewrites reality itself, powered by Northlight Engine 2 with full ray tracing.',
      reviewSentiment: 'Overwhelmingly Positive (94%)',
      ratingScore: 94,
      steamTags: ['Action', 'Supernatural', 'Story Rich', 'Ray Tracing', 'Third Person'],
      videoUrl: null
    },
    {
      id: 26,
      appId: 9000005,
      title: 'Forza Horizon 6',
      genre: 'Racing',
      status: 'Ready',
      played: 'Yesterday',
      hours: '87 hrs',
      image: '/forzahorizon6beranda.png',
      banner: '/forzahorizon6detail.png',
      synopsis: 'The Horizon Festival roars across the stunning landscapes of Japan. Race through neon soaked cities, mountain passes, and coastal highways in hundreds of the world\'s finest cars with 8K visual fidelity.',
      reviewSentiment: 'Overwhelmingly Positive (95%)',
      ratingScore: 95,
      steamTags: ['Racing', 'Open World', 'Automobile Sim', 'Multiplayer', 'Beautiful'],
      videoUrl: null
    },
    {
      id: 27,
      appId: 2369170,
      title: "Marvel's Spider-Man 2",
      genre: 'Action / Adventure',
      status: 'Ready',
      played: '2 days ago',
      hours: '52 hrs',
      image: '/marvelspiderman2beranda.png',
      banner: '/marvelspiderman2detail.png',
      synopsis: 'Swing through Marvel\'s New York as both Peter Parker and Miles Morales against Kraven the Hunter and the alien symbiote in this exhilarating action adventure sequel with seamless world traversal.',
      reviewSentiment: 'Very Positive (90%)',
      ratingScore: 90,
      steamTags: ['Action', 'Superhero', 'Open World', 'Story Rich', 'Marvel'],
      videoUrl: null
    },
    {
      id: 28,
      appId: 9000006,
      title: 'Resident Evil: Requiem',
      genre: 'Survival Horror',
      status: 'Ready',
      played: '5 days ago',
      hours: '24 hrs',
      image: '/residentevilrequiemberanda.png',
      banner: '/residentevilrequiemdetail.png',
      synopsis: 'A new chapter of survival horror unfolds in Resident Evil: Requiem. Face a terrifying new bioweapon outbreak with evolved stealth mechanics, adaptive enemy AI, and the most immersive photorealistic environments in the franchise.',
      reviewSentiment: 'Very Positive (89%)',
      ratingScore: 89,
      steamTags: ['Horror', 'Survival', 'Action', 'Atmospheric', 'Singleplayer'],
      videoUrl: null
    },
    {
      id: 29,
      appId: 9000007,
      title: 'NBA 2K27',
      genre: 'Sports / Basketball',
      status: 'Ready',
      played: '3 days ago',
      hours: '63 hrs',
      image: '/nba2k27beranda.png',
      banner: '/nba2k27detail.png',
      synopsis: 'The most authentic NBA experience ever. NBA 2K27 delivers next level player motion with ProPlay AI, an immersive MyCAREER story mode, and the ultimate MyTEAM card collecting competition.',
      reviewSentiment: 'Mostly Positive (78%)',
      ratingScore: 78,
      steamTags: ['Sports', 'Basketball', 'Simulation', 'Multiplayer', 'Career Mode'],
      videoUrl: null
    }
  ];

  // Featured Carousel Showcase Titles
  const featuredGames = [
    {
      id: 102,
      appId: 3405690,
      title: 'EA SPORTS FC™ 26',
      gameTitle: 'EA FC 26',
      genre: 'Sports & Simulation',
      badge: 'Official 2026 Edition',
      nodeBadge: 'Instant Steam Cloud Launch',
      desc: 'Experience unrivaled realism in EA SPORTS FC™ 26 with HyperMotionV and volumetric motion capture. Rent by the hour and stream immediately via official Steam direct link integration.',
      hourlyRate: '$1.25',
      rateUnit: '/ hr',
      ratingScore: '85%',
      ratingSentiment: 'Very Positive',
      nodeSpec: 'RTX 4090',
      nodeSub: '4K 120FPS',
      banner: '/eafc26hd_details.jpeg',
      themeColor: 'var(--neon-emerald)',
      glowColor: 'rgba(0, 240, 255, 0.4)',
      videoUrl: '/videos/eafc25.mp4'
    },
    {
      id: 1,
      appId: 1091500,
      title: 'Cyberpunk 2077: Phantom Liberty',
      gameTitle: 'Cyberpunk 2077',
      genre: 'Sci Fi Action RPG',
      badge: 'Ray Tracing Overdrive',
      nodeBadge: 'Path Tracing & DLSS 3.5',
      desc: 'Enter the neon soaked underworld of Night City. Rent high performance cloud compute with full path tracing, DLSS 3.5 ray reconstruction, and ultra low input latency.',
      hourlyRate: '$1.50',
      rateUnit: '/ hr',
      ratingScore: '92%',
      ratingSentiment: 'Overwhelmingly Positive',
      nodeSpec: 'RTX 4090',
      nodeSub: 'Full Path Tracing',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg',
      themeColor: '#fcee0a',
      glowColor: 'rgba(252, 238, 10, 0.35)',
      videoUrl: '/videos/cyberpunk.mp4'
    },
    {
      id: 11,
      appId: 2182340,
      title: 'Valorant',
      gameTitle: 'Valorant',
      genre: 'Tactical 5v5 Shooter',
      badge: 'Esports Ready',
      nodeBadge: 'Instant Steam Cloud Launch • 2ms',
      desc: 'Blend pinpoint gunplay with tactical agent abilities. Stream direct from Jakarta Edge with under 2ms network routing, NVIDIA Reflex 360Hz tuning, and Steam Cloud synchronization.',
      hourlyRate: '$0.99',
      rateUnit: '/ hr',
      ratingScore: '94%',
      ratingSentiment: 'Very Positive',
      nodeSpec: 'RTX 4080',
      nodeSub: '360Hz Reflex Edge',
      banner: '/valorant.jpg',
      themeColor: 'var(--neon-rose)',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      videoUrl: '/videos/valorant.mp4'
    },
    {
      id: 5,
      appId: 2358720,
      title: 'Black Myth: Wukong',
      gameTitle: 'Black Myth: Wukong',
      genre: 'Mythological Action RPG',
      badge: 'Global Blockbuster',
      nodeBadge: 'Unreal Engine 5 Nanite',
      desc: 'Set out as the Destined One to venture into the marvels and perils of ancient Chinese mythology. Powered by cutting edge Nanite geometry and Lumen lighting on cloud nodes.',
      hourlyRate: '$1.40',
      rateUnit: '/ hr',
      ratingScore: '95%',
      ratingSentiment: 'Overwhelmingly Positive',
      nodeSpec: 'RTX 4090',
      nodeSub: 'Cinematic UE5 Preset',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_hero.jpg',
      themeColor: 'var(--neon-amber)',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      videoUrl: '/videos/wukong.mp4'
    }
  ];

  // Carousel State & Navigation
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Video & Audio States for Hero Section (100% Click-to-Play System)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // GSAP Animation Refs
  const heroContentRef = useRef<HTMLDivElement>(null);
  const gameGridRef = useRef<HTMLDivElement>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const paymentModalRef = useRef<HTMLDivElement>(null);

  // GSAP Smooth Hero Slide Choreography
  useGSAP(() => {
    if (heroContentRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(heroContentRef.current.querySelector('.hero-title'),
        { opacity: 0, x: slideDirection === 'next' ? 25 : -25 },
        { opacity: 1, x: 0, duration: 0.45 }
      )
      .fromTo(heroContentRef.current.querySelector('.hero-desc'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35 },
        '-=0.3'
      )
      .fromTo(heroContentRef.current.querySelector('.hero-stats-row'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35 },
        '-=0.25'
      )
      .fromTo(heroContentRef.current.querySelector('.hero-actions'),
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.3 },
        '-=0.2'
      );
    }
  }, [currentHeroIndex]);

  // GSAP Smooth Game Grid Stagger Reveal
  useGSAP(() => {
    if (gameGridRef.current) {
      const cards = gameGridRef.current.querySelectorAll('.game-card-wrapper');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 16, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.025, ease: 'power2.out' }
        );
      }
    }
  }, [filter, activeSort, search]);

  // GSAP Details Modal Pop-in
  useGSAP(() => {
    if (selectedGame && detailsModalRef.current) {
      gsap.fromTo(detailsModalRef.current,
        { opacity: 0, scale: 0.94, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [selectedGame]);

  // GSAP Payment Modal Pop-in
  useGSAP(() => {
    if (showPaymentModal && paymentModalRef.current) {
      gsap.fromTo(paymentModalRef.current,
        { opacity: 0, scale: 0.94, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [showPaymentModal]);

  const handleNextHero = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setIsMuted(false);
    setSlideDirection('next');
    setCurrentHeroIndex((prev) => (prev + 1) % featuredGames.length);
  };

  const handlePrevHero = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setIsMuted(false);
    setSlideDirection('prev');
    setCurrentHeroIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  const handleSelectHero = (index: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setIsMuted(false);
    setSlideDirection(index > currentHeroIndex ? 'next' : 'prev');
    setCurrentHeroIndex(index);
  };

  // Auto-play effect: transitions every 6 seconds, pauses while video is playing
  useEffect(() => {
    if (isHeroPaused || isVideoPlaying) return;
    const timer = setInterval(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoPlaying(false);
      setIsMuted(false);
      setSlideDirection('next');
      setCurrentHeroIndex((prev) => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHeroPaused, isVideoPlaying, currentHeroIndex, featuredGames.length]);

  const currentFeatured = featuredGames[currentHeroIndex];
  const activeGameObj = games.find(g => g.title.toLowerCase().includes(currentFeatured.gameTitle.toLowerCase())) || games[0];
  const activeGame = {
    ...activeGameObj,
    ...currentFeatured,
    image: currentFeatured.banner || activeGameObj.banner || activeGameObj.image,
    videoUrl: currentFeatured.videoUrl || activeGameObj.videoUrl || null,
  };

  useEffect(() => {
    setIsVideoPlaying(false);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [activeGame.id]);

  const filteredGames = games
    .filter(g => {
      if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'All Games' || filter === 'Recent') return true; 
      if (filter === 'Action') return g.genre.includes('Action');
      if (filter === 'RPG') return g.genre.includes('RPG');
      if (filter === 'Shooter') return g.genre.includes('Shooter');
      return true;
    })
    .sort((a, b) => {
      if (activeSort === 'Most Popular') return b.id - a.id;
      if (activeSort === 'Highest Rated') return b.ratingScore - a.ratingScore;
      if (activeSort === 'Most Played') {
        const hA = parseFloat(a.hours) || 0;
        const hB = parseFloat(b.hours) || 0;
        return hB - hA;
      }
      return 0;
    });

  // Calculate dynamic price per PRD formula
  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[0];
  const subtotalPrice = currentNode.ratePerHour * rentalHours;
  const platformFee = 0.25;
  const totalPrice = subtotalPrice + platformFee;
  const formatUSD = (num: number) => formatPrice(num);

  const handleStartGame = (game: Game) => {
    const steamUri = game.appId > 0 ? `steam://rungameid/${game.appId}` : undefined;
    if (onLaunchGame) {
      onLaunchGame(game.title, steamUri);
    }
    // Direct Steam connection: trigger native Steam client protocol immediately
    if (steamUri) {
      try {
        window.location.assign(steamUri);
      } catch (e) {
        console.log('Steam direct protocol dispatch notice:', steamUri, e);
      }
      try {
        const link = document.createElement('a');
        link.href = steamUri;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 400);
      } catch (e) {
        console.log('Steam deep-link fallback notice:', steamUri, e);
      }
    }
  };

  const handleExecutePayment = () => {
    if (!paymentMethod || isProcessingPayment) return;
    setIsProcessingPayment(true);
    setPaymentSuccess(false);

    // Step 1: Simulate payment processing (1.5 seconds)
    setTimeout(() => {
      setPaymentSuccess(true);

      // Step 2: Show success, close modal, set rent success, and launch game animation (1 second)
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccess(false);
        setShowPaymentModal(false);
        setIsRentSuccess(true);

        // Langsung animasi proses masuk game
        if (selectedGame) {
          handleStartGame(selectedGame);
        }
      }, 1000);
    }, 1500);
  };

  return (
    <div className="game-library-wrap">
      
      {/* 1. HERO SECTION (Dynamic Featured Game Carousel) */}
      <div className="hero-banner-container">
        {/* Layered Crossfade Backgrounds (Static Base Layer) */}
        {featuredGames.map((game, idx) => (
          <div 
            key={game.title}
            className={`hero-banner-bg ${idx === currentHeroIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url('${game.banner}')` }}
            aria-hidden={idx !== currentHeroIndex}
          />
        ))}

        {/* Dynamic Cinematic Video Overlay (100% Click-to-Play, Absolute Layering) */}
        <video
          key={activeGame.id}
          ref={videoRef}
          src={activeGame.videoUrl || ''}
          muted={isMuted}
          loop
          playsInline
          className="hero-banner-video"
          style={{
            opacity: isVideoPlaying ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Cinematic Multi-layer Vignettes */}
        <div className="hero-banner-vignette-bottom" />
        <div className="hero-banner-vignette-left" />

        {/* Left Navigation Control (Glassmorphism + Border Hover) */}
        <button 
          onClick={handlePrevHero} 
          className="hero-nav-btn prev"
          type="button"
          aria-label="Previous Featured Game"
        >
          <ChevronLeft className="hero-nav-icon" />
        </button>

        {/* Right Navigation Control (Glassmorphism + Border Hover) */}
        <button 
          onClick={handleNextHero} 
          className="hero-nav-btn next"
          type="button"
          aria-label="Next Featured Game"
        >
          <ChevronRight className="hero-nav-icon" />
        </button>

        {/* Active Slide Content with Dynamic Transitions */}
        <div 
          key={currentHeroIndex} 
          ref={heroContentRef}
          className={`hero-banner-content slide-${slideDirection}`}
        >
          <h1 className="hero-title">{currentFeatured.title}</h1>
          <p className="hero-desc">{currentFeatured.desc}</p>
          
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <p className="label">Hourly Rate</p>
              <p className="val">{currentFeatured.hourlyRate} <span>{currentFeatured.rateUnit}</span></p>
            </div>
            <div className="hero-stat-item">
              <p className="label">Steam Rating</p>
              <p className="val">{currentFeatured.ratingScore} <span>{currentFeatured.ratingSentiment}</span></p>
            </div>
            <div className="hero-stat-item">
              <p className="label">Cloud Node</p>
              <p className="val">{currentFeatured.nodeSpec} <span>{currentFeatured.nodeSub}</span></p>
            </div>
          </div>

          <div className="hero-actions">
            <button 
              onClick={() => handleStartGame(activeGameObj)} 
              className="hero-btn-primary"
              type="button"
            >
              <span className="hero-btn-content">
                <Play style={{ width: 20, height: 20, fill: '#ffffff' }} />
                <span>Play on {activeGameObj.appId ? 'Steam' : 'Cloud'}</span>
              </span>
            </button>
            <button 
              onClick={() => {
                setSelectedGame(activeGameObj);
                setIsRentSuccess(false);
              }} 
              className="hero-btn-secondary"
              type="button"
            >
              Rent & Details
            </button>
          </div>
        </div>

        {/* Glassmorphic Carousel Indicators & Progress Track */}
        <div className="hero-carousel-pagination">
          <div className="hero-indicators-list">
            {featuredGames.map((game, idx) => {
              const isActive = idx === currentHeroIndex;
              return (
                <button
                  key={game.title}
                  type="button"
                  onClick={() => handleSelectHero(idx)}
                  className={`hero-indicator-dot ${isActive ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}: ${game.title}`}
                >
                  {isActive && (
                    <span 
                      key={`progress-${currentHeroIndex}-${isHeroPaused}`} 
                      className={`hero-progress-fill ${isHeroPaused ? 'paused' : ''}`} 
                    />
                  )}
                </button>
              );
            })}
          </div>
          <span className="hero-slide-counter">
            0{currentHeroIndex + 1} / 0{featuredGames.length}
          </span>
        </div>

        {/* Bottom-Right Cinematic Video Controls (Click-to-Play System) */}
        {activeGame.videoUrl && (
          <div className="hero-video-controls">
            {!isVideoPlaying ? (
              <button
                type="button"
                className="hero-video-btn hero-play-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsVideoPlaying(true);
                  setIsMuted(false);
                  videoRef.current?.play();
                }}
                aria-label="Play Trailer"
                title="Play Trailer"
              >
                <Play style={{ width: 20, height: 20, fill: '#ffffff', marginLeft: 2 }} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="hero-video-btn hero-stop-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsVideoPlaying(false);
                    videoRef.current?.pause();
                  }}
                  aria-label="Close Trailer"
                  title="Close Trailer"
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
                <button
                  type="button"
                  className="hero-video-btn hero-mute-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? (
                    <VolumeX style={{ width: 20, height: 20 }} />
                  ) : (
                    <Volume2 style={{ width: 20, height: 20 }} />
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. GAME CATALOG SECTION */}
      <div className="library-section">
        {/* Filter Pills & Search */}
        <div className="library-controls-bar">
          <div className="library-title-group">
            <h2>
              Game Library
              <span className="library-count-tag">({games.length} Games)</span>
            </h2>
            <div className="filter-pills-row">
              {['All Games', 'Recent', 'Action', 'RPG', 'Shooter'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={`filter-pill ${filter === cat ? 'active' : ''}`}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="library-search-group">
            <div className="search-input-wrap">
              <input 
                type="text" 
                placeholder="Search games or Steam AppID..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
              <Search className="search-input-icon" />
            </div>
            <div ref={filterDropdownRef} style={{ position: 'relative' }}>
              <button 
                className={`filter-action-btn ${isFilterOpen ? 'active' : ''}`} 
                type="button" 
                aria-label="Filters"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal style={{ width: 18, height: 18 }} />
              </button>

              {isFilterOpen && (
                <div className="filter-dropdown-menu">
                  <ul className="filter-dropdown-list">
                    <li 
                      className={`filter-dropdown-item ${activeSort === 'Most Popular' ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveSort(activeSort === 'Most Popular' ? null : 'Most Popular');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>Most Popular</span>
                      {activeSort === 'Most Popular' && <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />}
                    </li>
                    <li 
                      className={`filter-dropdown-item ${activeSort === 'Highest Rated' ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveSort(activeSort === 'Highest Rated' ? null : 'Highest Rated');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>Highest Rated</span>
                      {activeSort === 'Highest Rated' && <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />}
                    </li>
                    <li 
                      className={`filter-dropdown-item ${activeSort === 'Most Played' ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveSort(activeSort === 'Most Played' ? null : 'Most Played');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>Most Played</span>
                      {activeSort === 'Most Played' && <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Grid with GSAP Stagger */}
        <div ref={gameGridRef} className="game-grid">
          {filteredGames.map((game, idx) => (
            <div 
              key={game.id} 
              className="game-card-wrapper" 
              style={{ ['--card-index' as any]: idx }}
            >
              <div 
                className="game-card-3d"
                onClick={() => {
                  setSelectedGame(game);
                  setIsRentSuccess(false);
                }}
              >
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="game-card-poster" 
                  loading="lazy" 
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (game.appId === 1234567 || game.title.includes('Meccha Chameleon')) {
                      el.src = '/meccha_chameleon.jpg';
                      return;
                    }
                    if (game.appId === 9999992 || game.title.includes('Windrose')) {
                      el.src = '/windrose.jpg';
                      return;
                    }
                    if (game.appId === 3405690 || game.title.includes('EA FC 26')) {
                      el.src = '/eafc26_beranda.jpg';
                      return;
                    }
                    if (game.appId === 9000001 || game.title.includes('Ace Combat')) {
                      el.src = '/acecombat8beranda.png';
                      return;
                    }
                    if (game.appId === 9000002 || game.title.includes('Gears of War')) {
                      el.src = '/gearofwarberandahd.jpeg';
                      return;
                    }
                    if (game.appId === 9000003 || game.title.includes('WARDOGS')) {
                      el.src = '/wardogsberandahd.png';
                      return;
                    }
                    if (game.appId === 9000004 || game.title.includes('Control')) {
                      el.src = '/controlresonantberanda.png';
                      return;
                    }
                    if (game.appId === 9000005 || game.title.includes('Forza Horizon 6')) {
                      el.src = '/forzahorizon6beranda.png';
                      return;
                    }
                    if (game.appId === 2369170 || game.title.includes("Spider-Man 2")) {
                      el.src = '/marvelspiderman2beranda.png';
                      return;
                    }
                    if (game.appId === 9000006 || game.title.includes('Resident Evil')) {
                      el.src = '/residentevilrequiemberanda.png';
                      return;
                    }
                    if (game.appId === 9000007 || game.title.includes('NBA 2K27')) {
                      el.src = '/nba2k27beranda.png';
                      return;
                    }
                    if (!el.src.includes('header.jpg')) {
                      el.src = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appId}/header.jpg`;
                    } else {
                      el.src = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg';
                    }
                  }}
                />
                <div className="game-card-glare" />
                <div className="game-card-vignette" />

                {/* Steam App ID Badge */}
                <div className="game-card-steam-badge">
                  AppID: {game.appId}
                </div>

                {/* Hover Play Button */}
                <div className="game-card-overlay-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartGame(game);
                    }}
                    className="card-quick-play-btn"
                    type="button"
                    title="Launch via Steam"
                  >
                    <Play style={{ width: 20, height: 20, fill: '#ffffff', marginLeft: 2 }} />
                  </button>
                </div>

                {/* Card Title & Steam Sentiment */}
                <div className="game-card-info">
                  <h3 className="game-card-title">{game.title}</h3>
                  <div className="game-card-meta">
                    <span style={{ color: 'var(--neon-cyan)' }}>{game.genre}</span>
                    <span className="game-card-steam-score">{game.ratingScore}% Positive</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STEAM GAME DETAILS & TIME-RENTAL MODAL (PRD Section 2.1) */}
      {selectedGame && typeof document !== 'undefined' && createPortal(
        <div className="game-modal-overlay">
          <div ref={detailsModalRef} className="game-modal-card">
            
            <button 
              onClick={() => { setSelectedGame(null); setIsRentSuccess(false); setShowPaymentModal(false); }} 
              className="game-modal-close"
              type="button"
              aria-label="Close modal"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            {/* Modal Hero Artwork */}
            <div className="game-modal-hero">
              <img 
                src={selectedGame.banner || selectedGame.image} 
                alt={selectedGame.title} 
                onError={(e) => {
                  const el = e.currentTarget;
                  if (selectedGame.appId === 1234567 || selectedGame.title.includes('Meccha Chameleon')) {
                    el.src = '/meccha_chameleon.jpg';
                  } else if (selectedGame.appId === 9999992 || selectedGame.title.includes('Windrose')) {
                    el.src = '/windrose.jpg';
                  } else if (selectedGame.appId === 3405690 || selectedGame.title.includes('EA FC 26')) {
                    el.src = '/eafc26hd_details.jpeg';
                  } else if (selectedGame.appId === 9000001 || selectedGame.title.includes('Ace Combat')) {
                    el.src = '/acecombat8detail.png';
                  } else if (selectedGame.appId === 9000002 || selectedGame.title.includes('Gears of War')) {
                    el.src = '/gearofwardetailhd.jpeg';
                  } else if (selectedGame.appId === 9000003 || selectedGame.title.includes('WARDOGS')) {
                    el.src = '/wardogsdetailhd.png';
                  } else if (selectedGame.appId === 9000004 || selectedGame.title.includes('Control')) {
                    el.src = '/controlresonantdetail.png';
                  } else if (selectedGame.appId === 9000005 || selectedGame.title.includes('Forza Horizon 6')) {
                    el.src = '/forzahorizon6detail.png';
                  } else if (selectedGame.appId === 2369170 || selectedGame.title.includes("Spider-Man 2")) {
                    el.src = '/marvelspiderman2detail.png';
                  } else if (selectedGame.appId === 9000006 || selectedGame.title.includes('Resident Evil')) {
                    el.src = '/residentevilrequiemdetail.png';
                  } else if (selectedGame.appId === 9000007 || selectedGame.title.includes('NBA 2K27')) {
                    el.src = '/nba2k27detail.png';
                  } else {
                    el.src = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${selectedGame.appId}/header.jpg`;
                  }
                }}
              />
              <div className="game-modal-hero-vignette" />
              <div className="game-modal-hero-content">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span className="steam-verified-pill">
                      <Shield style={{ width: 12, height: 12 }} /> STEAM VERIFIED
                    </span>
                    <span className="steam-appid-pill">AppID: {selectedGame.appId}</span>
                  </div>
                  <h2 className="game-modal-hero-title">{selectedGame.title}</h2>
                  <div className="steam-tags-row">
                    {selectedGame.steamTags.map(tag => (
                      <span key={tag} className="steam-tag-pill">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="steam-score-card">
                  <p className="score-label">STEAM REVIEWS</p>
                  <p className="score-val">{selectedGame.reviewSentiment}</p>
                  <a 
                    href={`https://store.steampowered.com/app/${selectedGame.appId}/`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="steam-store-link"
                  >
                    View on Steam Store <ExternalLink style={{ width: 12, height: 12 }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Body: Rent-to-Play Flow (PRD Section 2.1) */}
            <div className="game-modal-body">
              
              {/* Left Column: Synopsis & Steam Integration */}
              <div className="modal-left-pane">
                <h3 className="section-title">Game Overview (Steam Web API)</h3>
                <p className="synopsis-text">{selectedGame.synopsis}</p>

                {/* Steam Metadata Box */}
                <div className="steam-metadata-box">
                  <div className="meta-col">
                    <span className="meta-k">Steam Protocol URI</span>
                    <span className="meta-v mono">steam://rungameid/{selectedGame.appId}</span>
                  </div>
                  <div className="meta-col">
                    <span className="meta-k">Stream Ready</span>
                    <span className="meta-v" style={{ color: 'var(--neon-emerald)' }}>4K HDR 120 FPS</span>
                  </div>
                  <div className="meta-col">
                    <span className="meta-k">Verified Anti Cheat</span>
                    <span className="meta-v">VAC & Steam Guard Safe</span>
                  </div>
                  <div className="meta-col">
                    <span className="meta-k">Cloud Save Sync</span>
                    <span className="meta-v" style={{ color: 'var(--neon-cyan)' }}>Real Time Bidirectional</span>
                  </div>
                </div>

                {/* Direct Launch Action Bar */}
                <div className="steam-actions-bar" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                  <button 
                    onClick={() => handleStartGame(selectedGame)} 
                    className="btn-steam-direct"
                    type="button"
                    style={{
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 50%, #00d2ff 100%)',
                      boxShadow: '0 4px 18px rgba(0, 210, 255, 0.35)',
                      cursor: 'pointer',
                      padding: '12px 18px',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.04em'
                    }}
                  >
                    <Play style={{ width: 18, height: 18, fill: '#ffffff' }} />
                    <span>LAUNCH DIRECTLY IN STEAM (steam://rungameid/{selectedGame.appId})</span>
                  </button>

                  <a 
                    href={`https://store.steampowered.com/app/${selectedGame.appId}/`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ExternalLink style={{ width: 15, height: 15, color: 'var(--neon-cyan)' }} />
                    <span>Open Game Page on Steam Store Website</span>
                  </a>
                </div>

                {/* Extended Details Block: Cloud Rig Performance Profile */}
                <div className="overview-subblock">
                  <h4 className="overview-subblock-title">
                    <Shield style={{ width: 15, height: 15, color: 'var(--neon-cyan)' }} />
                    OmniPlay Cloud Rig Performance Profile
                  </h4>
                  <div className="overview-features-grid">
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">NVIDIA RTX 40 Series (RTX 4070 Ti to 4090)</p>
                        <p className="pill-sub">Full Ray Tracing & DLSS 3.5</p>
                      </div>
                    </div>
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">Sub 2ms Input Latency</p>
                        <p className="pill-sub">Jakarta & Singapore Edge Nodes</p>
                      </div>
                    </div>
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">Zero Local Storage</p>
                        <p className="pill-sub">100% Streamed via PCIe 5.0 SAN</p>
                      </div>
                    </div>
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">Lossless AV1 Audio/Video</p>
                        <p className="pill-sub">Spatial Dolby Atmos & HDR10</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extended Details Block: About the Game & Cloud Optimization */}
                <div className="overview-subblock">
                  <h4 className="overview-subblock-title">
                    <Server style={{ width: 15, height: 15, color: 'var(--neon-purple)' }} />
                    About The Game & Cloud Optimization
                  </h4>
                  <p className="synopsis-text" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Optimized specifically for OmniPlay cloud streaming architecture. Shaders are precompiled and warmed across all edge clusters, eliminating compilation stutter and in game frame drops. Input packets utilize synchronized UDP subtick streams with automatic packet recovery.
                  </p>
                  <p className="synopsis-text" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Whether you are playing on a low spec ultrabook, tablet, or handheld terminal, you get the fidelity of a high performance dedicated gaming rig powered by green energy cloud compute centers.
                  </p>
                </div>

                {/* Extended Details Block: Compatibility & Controllers */}
                <div className="overview-subblock">
                  <h4 className="overview-subblock-title">
                    <CheckCircle2 style={{ width: 15, height: 15, color: 'var(--neon-emerald)' }} />
                    Compatibility & Controllers
                  </h4>
                  <div className="overview-features-grid">
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">DualSense & Xbox Gamepads</p>
                        <p className="pill-sub">Haptic feedback & rumble passthrough</p>
                      </div>
                    </div>
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">OmniRemote Touch Virtual Pad</p>
                        <p className="pill-sub">Mobile browser on screen controls</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Time-Rental Selection & Dynamic Pricing */}
              <div className="modal-right-pane">
                <div className="rental-panel-card">
                  <h3 className="rental-panel-title">
                    <Clock style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
                    Rent to Play Cloud Pass
                  </h3>

                  {/* 1. Cloud Node Selection */}
                  <div className="rental-field">
                    <div className="rental-header-row">
                      <label className="rental-label" style={{ margin: 0 }}>1. Choose Edge Node:</label>
                      <div className="currency-selector-pills">
                        {(['USD', 'EUR', 'GBP', 'JPY', 'IDR'] as CurrencyCode[]).map((cur) => (
                          <button
                            key={cur}
                            type="button"
                            className={`currency-pill ${selectedCurrency === cur ? 'active' : ''}`}
                            onClick={() => setSelectedCurrency(cur)}
                            title={`Switch currency to ${cur}`}
                          >
                            <span>{CURRENCIES[cur].flag}</span>
                            <span>{cur}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Worldwide Region Filter Tabs */}
                    <div className="region-filter-bar">
                      {(['ALL', 'APAC', 'Americas', 'Europe'] as const).map((reg) => (
                        <button
                          key={reg}
                          type="button"
                          className={`region-pill ${selectedRegion === reg ? 'active' : ''}`}
                          onClick={() => setSelectedRegion(reg)}
                        >
                          {reg === 'ALL' ? '🌍 All Regions' : reg === 'APAC' ? '🌏 APAC' : reg === 'Americas' ? '🌎 Americas' : '🌍 Europe'}
                        </button>
                      ))}
                    </div>

                    <div className="node-select-list">
                      {filteredNodes.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => setSelectedNode(n.id)}
                          className={`node-select-card ${selectedNode === n.id ? 'active' : ''}`}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 13 }}>{n.flag}</span>
                              <span className="node-tier-tag">{n.tier}</span>
                              <p className="node-name">{n.name}</p>
                            </div>
                            <p className="node-sub">
                              {n.gpu} • <span className="node-latency-pill"><span className="latency-dot"></span>{n.latency}</span>
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="node-price">{formatPrice(n.ratePerHour)}/h</span>
                            {selectedCurrency !== 'USD' && (
                              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>~${n.ratePerHour.toFixed(2)} USD</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Duration Slider (1 to 5 Hours) */}
                  <div className="rental-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label className="rental-label">2. Rental Duration:</label>
                      <span className="rental-hours-badge">{rentalHours} {rentalHours === 1 ? 'Hour' : 'Hours'}</span>
                    </div>

                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1"
                      value={rentalHours} 
                      onChange={e => setRentalHours(parseInt(e.target.value))}
                      className="rental-slider"
                    />

                    <div className="slider-ticks">
                      <span>1h</span>
                      <span>2h</span>
                      <span>3h</span>
                      <span>4h</span>
                      <span>5h</span>
                    </div>
                  </div>

                  {/* 3. Dynamic Price Calculation Output */}
                  <div className="rental-pricing-breakdown">
                    <div className="price-row">
                      <span>Cloud Node ({currentNode.tier}: {currentNode.gpu})</span>
                      <span>{formatPrice(currentNode.ratePerHour)}/h</span>
                    </div>
                    <div className="price-row">
                      <span>Rental Duration</span>
                      <span>{rentalHours} {rentalHours === 1 ? 'Hour' : 'Hours'}</span>
                    </div>
                    <div className="price-row">
                      <span>Subtotal ({formatPrice(currentNode.ratePerHour)} × {rentalHours}h)</span>
                      <span>{formatPrice(subtotalPrice)}</span>
                    </div>
                    <div className="price-row">
                      <span>Cloud Orchestration Fee</span>
                      <span>{formatPrice(platformFee)}</span>
                    </div>
                    <div className="price-row total">
                      <span>Total Payable</span>
                      <div style={{ textAlign: 'right' }}>
                        <span className="total-amount">{formatPrice(totalPrice)}</span>
                        {selectedCurrency !== 'USD' && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            (${totalPrice.toFixed(2)} USD)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. Action Button */}
                  {isRentSuccess ? (
                    <div className="rental-success-box">
                      <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--neon-emerald)' }} />
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--neon-emerald)' }}>Cloud Instance Provisioned!</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ready for {rentalHours} hours stream.</p>
                      </div>
                      <button 
                        onClick={() => handleStartGame(selectedGame)} 
                        className="btn-launch-after-rent"
                        type="button"
                      >
                        Play Now
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="btn-confirm-rental"
                      type="button"
                    >
                      CONFIRM RENTAL & PAY ({formatUSD(totalPrice)})
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      , document.body)}

      {/* 4. PAYMENT METHOD & TRANSACTION MODAL */}
      {showPaymentModal && selectedGame && typeof document !== 'undefined' && createPortal(
        <div 
          className="payment-modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessingPayment) {
              setShowPaymentModal(false);
            }
          }}
        >
          <div ref={paymentModalRef} className="payment-modal-card">
            {/* Header */}
            <div className="payment-modal-header">
              <button 
                type="button" 
                className="payment-back-btn" 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                title="Back"
              >
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </button>
              <h3 className="payment-modal-title">Payment Method</h3>
              <button 
                type="button" 
                className="payment-back-btn" 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                title="Close"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Order Summary Strip */}
            <div className="payment-order-strip">
              <div className="payment-order-game">
                <img 
                  src={selectedGame.image} 
                  alt={selectedGame.title} 
                  className="payment-game-thumb" 
                />
                <div style={{ minWidth: 0 }}>
                  <p className="payment-game-name">{selectedGame.title}</p>
                  <p className="payment-game-detail">
                    {currentNode.tier} ({currentNode.gpu}) • {rentalHours} {rentalHours === 1 ? 'Hour' : 'Hours'}
                  </p>
                </div>
              </div>
              <div className="payment-order-total">
                <span className="payment-total-lbl">Total Payment</span>
                <span className="payment-total-amt">{formatUSD(totalPrice)}</span>
              </div>
            </div>

            {/* Payment Methods List */}
            <div className="payment-methods-list">
              {/* Credit / Debit Card & Express Checkout (Worldwide) */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "card" ? "" : "card")}
                >
                  <div className="payment-section-left">
                    <CreditCard style={{ width: 18, height: 18, color: "#f59e0b" }} />
                    <span>Credit / Debit Cards & Express (Global)</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "card" ? "open" : "")} />
                </button>
                {expandedSection === "card" && (
                  <div className="payment-section-items">
                    {[
                      { id: "card", name: "Credit / Debit Card (Visa, MC, Amex, JCB)", sub: "Global 3D Secure 256 bit encrypted checkout", icon: "💳" },
                      { id: "paypal", name: "PayPal Express Checkout", sub: "Worldwide instant buyer protected checkout", icon: "🅿️" },
                      { id: "apple_pay", name: "Apple Pay", sub: "One Click biometric Face ID or Touch ID pay", icon: "🍎" },
                      { id: "google_pay", name: "Google Pay", sub: "Fast 1 tap checkout with Google account", icon: "🌐" }
                    ].map(item => (
                      <div
                        key={item.id}
                        className={"payment-method-item " + (paymentMethod === item.id ? "selected" : "")}
                        onClick={() => setPaymentMethod(item.id)}
                      >
                        <div className="payment-method-left">
                          <span className="payment-method-emoji">{item.icon}</span>
                          <div>
                            <p className="payment-method-name">{item.name}</p>
                            <p className="payment-method-sub">{item.sub}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === item.id}
                          onChange={() => setPaymentMethod(item.id)}
                          className="payment-radio"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Crypto & Web3 Gateway */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "crypto" ? "" : "crypto")}
                >
                  <div className="payment-section-left">
                    <Coins style={{ width: 18, height: 18, color: "#10b981" }} />
                    <span>Crypto & Web3 (Zero Cross Border Fee)</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "crypto" ? "open" : "")} />
                </button>
                {expandedSection === "crypto" && (
                  <div className="payment-section-items">
                    {[
                      { id: "usdt", name: "USDT (Tether TRC20 / Polygon)", sub: "Instant stablecoin transfer with minimal gas fee", icon: "🪙" },
                      { id: "usdc", name: "USDC (Solana / Ethereum)", sub: "1:1 USD backed regulated digital dollar", icon: "💵" },
                      { id: "crypto_web3", name: "Bitcoin / Ethereum (Web3)", sub: "Decentralized direct wallet payment", icon: "₿" }
                    ].map(item => (
                      <div
                        key={item.id}
                        className={"payment-method-item " + (paymentMethod === item.id ? "selected" : "")}
                        onClick={() => setPaymentMethod(item.id)}
                      >
                        <div className="payment-method-left">
                          <span className="payment-method-emoji">{item.icon}</span>
                          <div>
                            <p className="payment-method-name">{item.name}</p>
                            <p className="payment-method-sub">{item.sub}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === item.id}
                          onChange={() => setPaymentMethod(item.id)}
                          className="payment-radio"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instant QR Code & Local Mobile Wallets */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "qris" ? "" : "qris")}
                >
                  <div className="payment-section-left">
                    <Wallet style={{ width: 18, height: 18, color: "#00d2ff" }} />
                    <span>Instant QR & Regional Mobile Wallets</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "qris" ? "open" : "")} />
                </button>
                {expandedSection === "qris" && (
                  <div className="payment-section-items">
                    {[
                      { id: "qris", name: "Universal Instant QR (QRIS, Pix, PromptPay)", sub: "Scan & play immediately from any banking app", icon: "📷" },
                      { id: "cash_app", name: "Cash App / Revolut Pay", sub: "Fast US, UK & EU peer to peer checkout", icon: "💸" },
                      { id: "gopay_dana", name: "GoPay / OVO / Dana / ShopeePay", sub: "Southeast Asia instant mobile balance", icon: "📱" }
                    ].map(item => (
                      <div
                        key={item.id}
                        className={"payment-method-item " + (paymentMethod === item.id ? "selected" : "")}
                        onClick={() => setPaymentMethod(item.id)}
                      >
                        <div className="payment-method-left">
                          <span className="payment-method-emoji">{item.icon}</span>
                          <div>
                            <p className="payment-method-name">{item.name}</p>
                            <p className="payment-method-sub">{item.sub}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === item.id}
                          onChange={() => setPaymentMethod(item.id)}
                          className="payment-radio"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bank Transfer / Online Banking */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "va" ? "" : "va")}
                >
                  <div className="payment-section-left">
                    <Building2 style={{ width: 18, height: 18, color: "#8b5cf6" }} />
                    <span>Direct Online Banking & Wire Transfers</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "va" ? "open" : "")} />
                </button>
                {expandedSection === "va" && (
                  <div className="payment-section-items">
                    {[
                      { id: "global_ach", name: "Global ACH & Wire (Chase, BofA, HSBC, Barclays)", sub: "Direct bank verification & automated clearing", icon: "🏦" },
                      { id: "id_va", name: "Indonesian Virtual Account (BCA, Mandiri, BRI, BNI)", sub: "Instant 24/7 automated transfer confirmation", icon: "🏛️" }
                    ].map(item => (
                      <div
                        key={item.id}
                        className={"payment-method-item " + (paymentMethod === item.id ? "selected" : "")}
                        onClick={() => setPaymentMethod(item.id)}
                      >
                        <div className="payment-method-left">
                          <span className="payment-method-emoji">{item.icon}</span>
                          <div>
                            <p className="payment-method-name">{item.name}</p>
                            <p className="payment-method-sub">{item.sub}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === item.id}
                          onChange={() => setPaymentMethod(item.id)}
                          className="payment-radio"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Processing Overlay (Inside Modal) */}
            {isProcessingPayment && (
              <div className="payment-processing-overlay">
                <div className="payment-processing-content">
                  {paymentSuccess ? (
                    <>
                      <div className="payment-success-icon">✓</div>
                      <h4 className="payment-processing-title">Payment Successful!</h4>
                      <p className="payment-processing-sub">Setting up cloud rig & starting your game...</p>
                    </>
                  ) : (
                    <>
                      <div className="payment-spinner"></div>
                      <h4 className="payment-processing-title">Processing Payment...</h4>
                      <p className="payment-processing-sub">
                        Connecting to {paymentMethod ? paymentMethod.toUpperCase().replace("_", " ") : "Payment"} Gateway...
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Footer / Pay Button */}
            <div className="payment-modal-footer">
              <div className="payment-footer-info">
                <Lock style={{ width: 13, height: 13 }} />
                <span>256 Bit SSL Encrypted & Secure Checkout</span>
              </div>
              <button
                type="button"
                className={"payment-pay-btn " + ((!paymentMethod || isProcessingPayment) ? "disabled" : "")}
                disabled={!paymentMethod || isProcessingPayment}
                onClick={handleExecutePayment}
              >
                {paymentMethod 
                  ? "PAY NOW • " + formatUSD(totalPrice) 
                  : "SELECT PAYMENT METHOD"
                }
              </button>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
}


