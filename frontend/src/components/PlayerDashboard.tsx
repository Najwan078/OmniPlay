import { useState, useEffect, useRef } from 'react';
import { 
  Server, Play, Search, SlidersHorizontal, X, 
  Clock, ExternalLink, CheckCircle2, Shield, ChevronLeft, ChevronRight,
  Volume2, VolumeX, CreditCard, Smartphone, Building2, Wallet, ChevronDown, Lock
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

  // Rent-to-Play Universal State
  const [rentalHours, setRentalHours] = useState(2);
  const [selectedNode, setSelectedNode] = useState('JK-01');
  const [isRentSuccess, setIsRentSuccess] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<string>('ewallet');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Standardized Cloud Node Tiers (Universal across all games)
  const nodes = [
    { 
      id: 'JK-01', 
      tier: 'Tier 1', 
      location: 'Jakarta', 
      name: 'JK-01 (Jakarta)', 
      gpu: 'RTX 4070 Ti', 
      latency: '2ms', 
      ratePerHour: 10000 
    },
    { 
      id: 'SG-01', 
      tier: 'Tier 2', 
      location: 'Singapore', 
      name: 'SG-01 (Singapore)', 
      gpu: 'RTX 4080', 
      latency: '15ms', 
      ratePerHour: 16000 
    },
    { 
      id: 'TY-01', 
      tier: 'Tier 3', 
      location: 'Tokyo', 
      name: 'TY-01 (Tokyo)', 
      gpu: 'RTX 4090', 
      latency: '60ms', 
      ratePerHour: 25000 
    },
  ];

  const games: Game[] = [
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
      synopsis: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City, an immense metropolis obsessed with power, glamour, and body modding.',
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
      synopsis: 'Forge a new path and wage an unconventional war for the freedom of Tsushima in this critically acclaimed open-world action adventure masterpiece.',
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
      steamTags: ['Souls-like', 'Dark Fantasy', 'Open World', 'RPG'],
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
      steamTags: ['Mythology', 'Action RPG', 'Souls-like', 'Difficult'],
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
      synopsis: 'Join the Helldivers and fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.',
      reviewSentiment: 'Mostly Positive (78%)',
      ratingScore: 78,
      steamTags: ['Co-op', 'Shooter', 'Action', 'Sci-Fi'],
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
      synopsis: 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.',
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
      synopsis: 'A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities. Stream with sub-2ms input latency via OmniPlay Jakarta Edge and official Steam Cloud integration.',
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
      synopsis: 'The breakout viral sensation of 2026! Play as an ultra-adaptive robotic chameleon with high-speed color camouflaging and tongue-grapple physics across chaotic neon arenas.',
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
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_hero.jpg',
      synopsis: 'Fight, farm, build and work alongside mysterious creatures called "Pals" in this completely new multiplayer, open-world survival crafting game.',
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
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_hero.jpg',
      synopsis: 'Dive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first-person shooter combat in the Final Shape expansion era.',
      reviewSentiment: 'Very Positive (84%)',
      ratingScore: 84,
      steamTags: ['Action MMO', 'FPS', 'Looter Shooter', 'Co-op', 'Sci-Fi'],
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
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_hero.jpg',
      synopsis: 'You are Geralt of Rivia, mercenary monster slayer. As war rages, track down the Child of Prophecy in the enhanced Next-Gen visual update.',
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
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_hero.jpg',
      synopsis: 'Carve your own clever path to vengeance in this critically acclaimed adventure from developer FromSoftware, creators of Bloodborne and Dark Souls.',
      reviewSentiment: 'Overwhelmingly Positive (95%)',
      ratingScore: 95,
      steamTags: ['Souls-like', 'Action', 'Difficult', 'Ninja', 'Singleplayer'],
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
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/library_600x900.jpg',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/library_hero.jpg',
      synopsis: 'Risk it all to breakout from the toughest prisons in the world. Explore the biggest prisons yet, with multiple floors, roofs, vents and underground tunnels!',
      reviewSentiment: 'Very Positive (90%)',
      ratingScore: 90,
      steamTags: ['Strategy', 'Multiplayer', 'Pixel Graphics', 'Co-op', 'Funny'],
      videoUrl: null
    }
  ];

  // Featured Carousel Showcase Titles
  const featuredGames = [
    {
      id: 2,
      appId: 2669320,
      title: 'EA SPORTS FC™ 25',
      gameTitle: 'EA FC 25',
      genre: 'Sports & Simulation',
      badge: 'RENTAL READY • SG-01',
      nodeBadge: 'Instant Steam Cloud Launch',
      desc: 'Experience unrivaled realism in EA SPORTS FC™ 25 with HyperMotionV and volumetric motion capture. Rent by the hour and stream immediately via official Steam deep-link integration.',
      hourlyRate: 'Rp 15.000',
      rateUnit: '/ hr',
      ratingScore: '82%',
      ratingSentiment: 'Very Positive',
      nodeSpec: 'RTX 4090',
      nodeSub: '4K 120FPS',
      banner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/library_hero.jpg',
      themeColor: 'var(--neon-emerald)',
      glowColor: 'rgba(0, 240, 255, 0.4)',
      videoUrl: '/videos/eafc25.mp4'
    },
    {
      id: 1,
      appId: 1091500,
      title: 'Cyberpunk 2077: Phantom Liberty',
      gameTitle: 'Cyberpunk 2077',
      genre: 'Sci-Fi Action RPG',
      badge: 'RAY TRACING OVERDRIVE • SG-01',
      nodeBadge: 'Path Tracing & DLSS 3.5',
      desc: 'Enter the neon-soaked underworld of Night City. Rent high-end cloud compute with full path tracing, DLSS 3.5 ray reconstruction, and ultra-low input latency.',
      hourlyRate: 'Rp 18.000',
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
      badge: 'COMPETITIVE EDGE • JK-01',
      nodeBadge: 'Instant Steam Cloud Launch • 2ms',
      desc: 'Blend pinpoint gunplay with game-changing tactical agent abilities. Stream direct from Jakarta Edge with sub-2ms network routing, NVIDIA Reflex 360Hz tuning, and Steam Cloud synchronization.',
      hourlyRate: 'Rp 12.000',
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
      badge: 'GLOBAL BLOCKBUSTER • TY-01',
      nodeBadge: 'Unreal Engine 5 Nanite',
      desc: 'Set out as the Destined One to venture into the marvels and perils of ancient Chinese mythology. Powered by cutting-edge Nanite geometry and Lumen lighting on cloud nodes.',
      hourlyRate: 'Rp 16.000',
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
      if (activeSort === 'Terpopuler') return b.id - a.id;
      if (activeSort === 'Rating Bagus') return b.ratingScore - a.ratingScore;
      if (activeSort === 'Sering Dimainkan') {
        const hA = parseFloat(a.hours) || 0;
        const hB = parseFloat(b.hours) || 0;
        return hB - hA;
      }
      return 0;
    });

  // Calculate dynamic price per PRD formula
  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[0];
  const subtotalPrice = currentNode.ratePerHour * rentalHours;
  const platformFee = 2500;
  const totalPrice = subtotalPrice + platformFee;
  const formatIDR = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  const handleStartGame = (game: Game) => {
    const steamUri = game.appId > 0 ? `steam://rungameid/${game.appId}` : undefined;
    if (onLaunchGame) {
      onLaunchGame(game.title, steamUri);
    }
    // Attempt safe deep link navigation
    if (steamUri) {
      try {
        const link = document.createElement('a');
        link.href = steamUri;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 200);
      } catch (e) {
        console.log('Steam deep-link triggered:', steamUri, e);
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
      <div 
        className="hero-banner-container"
        style={{
          backgroundImage: `url(${activeGame.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
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

        {/* Ambient Dynamic Accent Lighting */}
        <div 
          className="hero-banner-ambient-glow"
          style={{ 
            background: `radial-gradient(circle at 25% 65%, ${currentFeatured.glowColor} 0%, transparent 60%)` 
          }}
        />

        {/* Cinematic Multi-layer Vignettes */}
        <div className="hero-banner-vignette-bottom" />
        <div className="hero-banner-vignette-left" />

        {/* Left Navigation Control (Glassmorphism + Neon Border Hover) */}
        <button 
          onClick={handlePrevHero} 
          className="hero-nav-btn prev"
          type="button"
          aria-label="Previous Featured Game"
        >
          <ChevronLeft className="hero-nav-icon" />
        </button>

        {/* Right Navigation Control (Glassmorphism + Neon Border Hover) */}
        <button 
          onClick={handleNextHero} 
          className="hero-nav-btn next"
          type="button"
          aria-label="Next Featured Game"
        >
          <ChevronRight className="hero-nav-icon" />
        </button>

        {/* Active Slide Content with Dynamic Keyframe Transitions */}
        <div 
          key={currentHeroIndex} 
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
                <span>START NOW {activeGameObj.appId ? '(STEAM)' : '(CLOUD)'}</span>
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
              <span className="library-count-tag">({games.length} Steam Cloud Ready Titles)</span>
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
                      className={`filter-dropdown-item ${activeSort === 'Terpopuler' ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveSort(activeSort === 'Terpopuler' ? null : 'Terpopuler');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>Terpopuler</span>
                      {activeSort === 'Terpopuler' && <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />}
                    </li>
                    <li 
                      className={`filter-dropdown-item ${activeSort === 'Rating Bagus' ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveSort(activeSort === 'Rating Bagus' ? null : 'Rating Bagus');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>Rating Bagus</span>
                      {activeSort === 'Rating Bagus' && <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />}
                    </li>
                    <li 
                      className={`filter-dropdown-item ${activeSort === 'Sering Dimainkan' ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveSort(activeSort === 'Sering Dimainkan' ? null : 'Sering Dimainkan');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>Sering Dimainkan</span>
                      {activeSort === 'Sering Dimainkan' && <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Netflix-Style Game Grid */}
        <div className="game-grid">
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
      {selectedGame && (
        <div className="game-modal-overlay">
          <div className="game-modal-card">
            
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
                    <span className="meta-k">Verified Anti-Cheat</span>
                    <span className="meta-v">VAC & Steam Guard Safe</span>
                  </div>
                  <div className="meta-col">
                    <span className="meta-k">Cloud Save Sync</span>
                    <span className="meta-v" style={{ color: 'var(--neon-cyan)' }}>Real-Time Bidirectional</span>
                  </div>
                </div>

                {/* Direct Launch Action Bar */}
                <div className="steam-actions-bar">
                  <button 
                    onClick={() => handleStartGame(selectedGame)} 
                    className="btn-steam-direct"
                    type="button"
                  >
                    <Play style={{ width: 18, height: 18, fill: '#ffffff' }} />
                    <span>START NOW (STEAM DEEP-LINK)</span>
                  </button>
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
                        <p className="pill-title">NVIDIA RTX 40-Series (RTX 4070 Ti - 4090)</p>
                        <p className="pill-sub">Full Ray Tracing & DLSS 3.5</p>
                      </div>
                    </div>
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">Sub-2ms Input Latency</p>
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
                    Optimized specifically for OmniPlay cloud streaming architecture. Shaders are pre-compiled and warmed across all edge clusters, eliminating compilation stutter and in-game frame drops. Input packets utilize synchronized UDP sub-tick streams with automatic packet recovery.
                  </p>
                  <p className="synopsis-text" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Whether you are playing on a low-end ultrabook, tablet, or handheld terminal, you get the fidelity of a multi-thousand dollar dedicated gaming rig powered by green energy cloud compute centers.
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
                        <p className="pill-sub">Haptic feedback & rumble pass-through</p>
                      </div>
                    </div>
                    <div className="feature-pill-card">
                      <div>
                        <p className="pill-title">OmniRemote Touch Virtual Pad</p>
                        <p className="pill-sub">Mobile browser on-screen controls</p>
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
                    Rent-to-Play Cloud Pass
                  </h3>

                  {/* 1. Cloud Node Selection */}
                  <div className="rental-field">
                    <label className="rental-label">1. Choose Edge Node:</label>
                    <div className="node-select-list">
                      {nodes.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => setSelectedNode(n.id)}
                          className={`node-select-card ${selectedNode === n.id ? 'active' : ''}`}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span className="node-tier-tag">{n.tier}</span>
                              <p className="node-name">{n.name}</p>
                            </div>
                            <p className="node-sub">{n.gpu} • {n.latency}</p>
                          </div>
                          <span className="node-price">{formatIDR(n.ratePerHour)}/h</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Duration Slider (1 to 5 Hours) */}
                  <div className="rental-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label className="rental-label">2. Rental Duration:</label>
                      <span className="rental-hours-badge">{rentalHours} Hours</span>
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
                      <span>{formatIDR(currentNode.ratePerHour)}/h</span>
                    </div>
                    <div className="price-row">
                      <span>Rental Duration</span>
                      <span>{rentalHours} {rentalHours === 1 ? 'Hour' : 'Hours'}</span>
                    </div>
                    <div className="price-row">
                      <span>Subtotal ({formatIDR(currentNode.ratePerHour)} × {rentalHours}h)</span>
                      <span>{formatIDR(subtotalPrice)}</span>
                    </div>
                    <div className="price-row">
                      <span>Cloud Orchestration Fee</span>
                      <span>{formatIDR(platformFee)}</span>
                    </div>
                    <div className="price-row total">
                      <span>Total Payable</span>
                      <span className="total-amount">{formatIDR(totalPrice)}</span>
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
                      CONFIRM RENTAL & PAY ({formatIDR(totalPrice)})
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. PAYMENT METHOD & TRANSACTION MODAL */}
      {showPaymentModal && selectedGame && (
        <div 
          className="payment-modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessingPayment) {
              setShowPaymentModal(false);
            }
          }}
        >
          <div className="payment-modal-card">
            {/* Header */}
            <div className="payment-modal-header">
              <button 
                type="button" 
                className="payment-back-btn" 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                title="Kembali"
              >
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </button>
              <h3 className="payment-modal-title">Metode Pembayaran</h3>
              <button 
                type="button" 
                className="payment-back-btn" 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                title="Tutup"
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
                    {currentNode.tier} ({currentNode.gpu}) • {rentalHours} Jam
                  </p>
                </div>
              </div>
              <div className="payment-order-total">
                <span className="payment-total-lbl">Total Pembayaran</span>
                <span className="payment-total-amt">{formatIDR(totalPrice)}</span>
              </div>
            </div>

            {/* Payment Methods List */}
            <div className="payment-methods-list">
              {/* E-Wallet */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "ewallet" ? "" : "ewallet")}
                >
                  <div className="payment-section-left">
                    <Smartphone style={{ width: 18, height: 18, color: "#00d2ff" }} />
                    <span>E-Wallet / Dompet Digital</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "ewallet" ? "open" : "")} />
                </button>
                {expandedSection === "ewallet" && (
                  <div className="payment-section-items">
                    {[
                      { id: "gopay", name: "GoPay", sub: "Otomatis terhubung & instan", icon: "🟢" },
                      { id: "dana", name: "DANA", sub: "Saldo DANA & Proteksi Pembeli", icon: "🔵" },
                      { id: "ovo", name: "OVO", sub: "Verifikasi instan via ponsel", icon: "🟣" },
                      { id: "shopeepay", name: "ShopeePay", sub: "Cashback koin & SPayLater", icon: "🟠" }
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

              {/* QRIS */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "qris" ? "" : "qris")}
                >
                  <div className="payment-section-left">
                    <Wallet style={{ width: 18, height: 18, color: "#10b981" }} />
                    <span>QRIS (Scan & Pay)</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "qris" ? "open" : "")} />
                </button>
                {expandedSection === "qris" && (
                  <div className="payment-section-items">
                    <div
                      className={"payment-method-item " + (paymentMethod === "qris" ? "selected" : "")}
                      onClick={() => setPaymentMethod("qris")}
                    >
                      <div className="payment-method-left">
                        <span className="payment-method-emoji">📷</span>
                        <div>
                          <p className="payment-method-name">QRIS Instant Code</p>
                          <p className="payment-method-sub">BCA, Mandiri, GoPay, OVO, ShopeePay, DANA & Semua M-Banking</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "qris"}
                        onChange={() => setPaymentMethod("qris")}
                        className="payment-radio"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Virtual Account */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "va" ? "" : "va")}
                >
                  <div className="payment-section-left">
                    <Building2 style={{ width: 18, height: 18, color: "#8b5cf6" }} />
                    <span>Virtual Account Bank</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "va" ? "open" : "")} />
                </button>
                {expandedSection === "va" && (
                  <div className="payment-section-items">
                    {[
                      { id: "va_bca", name: "BCA Virtual Account", sub: "Verifikasi instan 24 jam", icon: "🏦" },
                      { id: "va_mandiri", name: "Mandiri Virtual Account", sub: "Livin by Mandiri & ATM", icon: "🏛️" },
                      { id: "va_bri", name: "BRI Virtual Account (BRIVA)", sub: "BRImo & Agen BRILink", icon: "🏪" },
                      { id: "va_bni", name: "BNI Virtual Account", sub: "BNI Mobile Banking & ATM", icon: "🏬" }
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

              {/* Credit / Debit Card */}
              <div className="payment-section">
                <button
                  type="button"
                  className="payment-section-header"
                  onClick={() => setExpandedSection(expandedSection === "card" ? "" : "card")}
                >
                  <div className="payment-section-left">
                    <CreditCard style={{ width: 18, height: 18, color: "#f59e0b" }} />
                    <span>Kartu Kredit / Debit Online</span>
                  </div>
                  <ChevronDown className={"payment-chevron " + (expandedSection === "card" ? "open" : "")} />
                </button>
                {expandedSection === "card" && (
                  <div className="payment-section-items">
                    <div
                      className={"payment-method-item " + (paymentMethod === "card" ? "selected" : "")}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="payment-method-left">
                        <span className="payment-method-emoji">💳</span>
                        <div>
                          <p className="payment-method-name">Visa / Mastercard / JCB</p>
                          <p className="payment-method-sub">3D Secure encrypted authentication</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="payment-radio"
                      />
                    </div>
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
                      <h4 className="payment-processing-title">Pembayaran Berhasil!</h4>
                      <p className="payment-processing-sub">Memulai Cloud Instance & Meluncurkan Game...</p>
                    </>
                  ) : (
                    <>
                      <div className="payment-spinner"></div>
                      <h4 className="payment-processing-title">Memproses Pembayaran...</h4>
                      <p className="payment-processing-sub">
                        Menghubungkan ke gateway {paymentMethod ? paymentMethod.toUpperCase().replace("_", " ") : "Pembayaran"}...
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
                <span>Transaksi Terenkripsi 256-bit SSL & Aman</span>
              </div>
              <button
                type="button"
                className={"payment-pay-btn " + ((!paymentMethod || isProcessingPayment) ? "disabled" : "")}
                disabled={!paymentMethod || isProcessingPayment}
                onClick={handleExecutePayment}
              >
                {paymentMethod 
                  ? "BAYAR SEKARANG • " + formatIDR(totalPrice) 
                  : "PILIH METODE PEMBAYARAN"
                }
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


