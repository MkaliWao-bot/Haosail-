import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import {
  HERO_IMAGE_PATH,
  HERO_VIDEO_PATH,
  HERO_VIDEO_POSTER_PATH,
} from '../data/machineryData';
import { Category, Product } from '../types/machinery';

interface HeroBannerProps {
  products?: Product[];
  onSearchSubmit?: (query: string) => void;
  onExploreCatalog: () => void;
  onSelectCategory?: (category: Category) => void;
  onOpenAdvisor?: () => void;
  onSelectProduct?: (product: Product) => void;
  onOpenProforma?: () => void;
}

interface DivisionHeroConfig {
  index: string;
  category: Category;
  title: string;
  specRange: string;
  count: number;
  divisionSummary: string;
}

const SPEC_INDEX_ITEMS: DivisionHeroConfig[] = [
  {
    index: '01',
    category: 'woodworking',
    title: 'Woodworking',
    specRange: 'CNC, Panel & Wide-Belt',
    count: 15,
    divisionSummary:
      'Sliding table panel saws, 4×8 ft CNC routers, wide-belt sanders, hinge borers, and 5-in-1 joinery centers.',
  },
  {
    index: '02',
    category: 'auto-maintenance',
    title: 'Auto Service',
    specRange: 'Lifts, A/C & Diagnostics',
    count: 21,
    divisionSummary:
      '2-post, 4-post & scissor lifts, automatic A/C stations, OBD2 scanners, 3D aligners, jacks, and body benches.',
  },
  {
    index: '03',
    category: 'welding-metalworking',
    title: 'Welding & Metal',
    specRange: 'MIG, Arc & Metal Lathes',
    count: 8,
    divisionSummary:
      '315A IGBT inverter welders, CO2/MIG plants, diesel welding sets, geared metal lathes, drill presses & benders.',
  },
  {
    index: '04',
    category: 'construction-concrete',
    title: 'Construction',
    specRange: 'Road Saws, Rollers & Mixers',
    count: 8,
    divisionSummary:
      '18" concrete road cutters, double-drum vibratory rollers, 400L hydraulic mixers, trowels, and rammers.',
  },
  {
    index: '05',
    category: 'workshop-tools',
    title: 'Workshop & Lifting',
    specRange: 'Forklifts, Pumps & Power',
    count: 16,
    divisionSummary:
      '3T diesel forklifts, semi-electric stackers, silent & belt compressors, water pumps, generators, and presses.',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  products,
  onExploreCatalog,
  onSelectCategory,
  onOpenProforma,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHoverPaused, setIsHoverPaused] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [cycleGeneration, setCycleGeneration] = useState<number>(0);

  const HERO_VIDEO_PLAYBACK_RATE = 0.6;

  const applyPlaybackRate = (el: HTMLVideoElement | null) => {
    if (!el) return;
    el.defaultPlaybackRate = HERO_VIDEO_PLAYBACK_RATE;
    el.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      setPrefersReducedMotion(mq.matches);
      if (mq.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    syncMotion();
    mq.addEventListener('change', syncMotion);
    return () => mq.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    const sectionEl = sectionRef.current;
    if (!videoEl || !sectionEl) return;

    applyPlaybackRate(videoEl);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting && !userPausedRef.current && !prefersReducedMotion) {
          applyPlaybackRate(videoRef.current);
          videoRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        } else if (!entry.isIntersecting) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const activeDivision = SPEC_INDEX_ITEMS[activeIndex];
  const isTabTimerPaused = isHoverPaused || prefersReducedMotion;
  const totalMachineCount = products && products.length > 0 ? products.length : 68;
  const getCategoryCount = (cat: Category, fallbackCount: number) =>
    products && products.length > 0
      ? products.filter((p) => p.category === cat).length
      : fallbackCount;

  const jumpToSlide = (nextIdx: number) => {
    const wrapped = (nextIdx + SPEC_INDEX_ITEMS.length) % SPEC_INDEX_ITEMS.length;
    setActiveIndex(wrapped);
    setCycleGeneration((g) => g + 1);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      userPausedRef.current = true;
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleIndexSelect = (cat: Category, idx: number) => {
    jumpToSlide(idx);
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      onExploreCatalog();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="group/hero relative w-full bg-[#090B0E] text-white overflow-hidden"
    >
      <div className="relative min-h-[600px] lg:min-h-[680px] w-full flex flex-col justify-between">
        {/* Full-Bleed Unobstructed Hero Video Stage */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#090B0E]">
          <video
            key={HERO_VIDEO_PATH}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={HERO_VIDEO_POSTER_PATH || HERO_IMAGE_PATH}
            onLoadedMetadata={() => applyPlaybackRate(videoRef.current)}
            onPlay={() => applyPlaybackRate(videoRef.current)}
            className="w-full h-full object-cover object-center"
          >
            <source src={HERO_VIDEO_PATH} type="video/mp4" />
          </video>

          {/* Left-weighted contrast scrim only behind headline copy so the video shines clearly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090B0E]/82 via-[#090B0E]/36 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E]/85 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Main Editorial Content Region */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-9 flex-1 flex flex-col justify-end">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-xl space-y-5">
              {/* Unboxed Kicker */}
              <div className="hero-reveal flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono tracking-wider text-slate-200">
                <span>HaoSail Kenya</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>50Hz Grid Calibrated</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>KRA E-TIMS Ready</span>
              </div>

              {/* Balanced Editorial Display Headline */}
              <h1 className="hero-reveal-delay-1 font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.025em] text-white [text-wrap:balance] drop-shadow-sm">
                Precision Machinery Built for Commercial Workshops.
              </h1>

              {/* Synchronized Division Copy */}
              <div
                key={`copy-${activeDivision.category}-${cycleGeneration}`}
                className="hero-card-swap max-w-lg space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-sky-300 tabular-nums">
                  <span>{activeDivision.index}.</span>
                  <span>{activeDivision.title}</span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="text-slate-200">{activeDivision.specRange}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-100/95 leading-relaxed font-normal">
                  {activeDivision.divisionSummary}
                </p>
              </div>

              {/* Single Dominant Action + Clean Text Link */}
              <div className="hero-reveal-delay-2 flex flex-wrap items-center gap-6 pt-1">
                <button
                  type="button"
                  onClick={onExploreCatalog}
                  className="btn-press btn-nudge inline-flex items-center gap-2.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-6 py-3.5 text-sm font-semibold text-white cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Browse {totalMachineCount} Machines</span>
                  <ArrowRight className="h-4 w-4 btn-arrow" />
                </button>

                {onOpenProforma && (
                  <button
                    type="button"
                    onClick={onOpenProforma}
                    className="text-sm font-medium text-slate-100 hover:text-white underline underline-offset-4 decoration-white/45 hover:decoration-white transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Get Instant Quote
                  </button>
                )}
              </div>
            </div>

            {/* Compact Icon-Only Video Playback Control (idle fade) */}
            <div className="flex items-center justify-end lg:pb-1">
              <button
                type="button"
                onClick={togglePlayback}
                title={isPlaying ? 'Pause video' : 'Play video'}
                aria-label={isPlaying ? 'Pause hero video' : 'Play hero video'}
                className={`btn-press flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/25 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white hover:border-white/30 focus-visible:opacity-100 transition-opacity duration-200 cursor-pointer shrink-0 ${
                  isPlaying
                    ? 'opacity-40 group-hover/hero:opacity-100'
                    : 'opacity-95'
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Engineering Spec Index Bar (01–04 Animated Switcher) */}
        <div
          className="relative z-10 w-full border-t border-white/15 bg-[#090B0E]/85 backdrop-blur-md"
          onMouseEnter={() => setIsHoverPaused(true)}
          onMouseLeave={() => setIsHoverPaused(false)}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/12">
            {SPEC_INDEX_ITEMS.map((item, idx) => {
              const isActive = idx === activeIndex;
              const spanClass = idx === SPEC_INDEX_ITEMS.length - 1 ? 'col-span-2 lg:col-span-1' : '';
              return (
                <button
                  key={item.category}
                  type="button"
                  onMouseEnter={() => jumpToSlide(idx)}
                  onFocus={() => jumpToSlide(idx)}
                  onClick={() => handleIndexSelect(item.category, idx)}
                  className={`btn-press btn-nudge-tr relative group flex flex-col justify-between gap-1.5 px-4 sm:px-5 py-4 text-left transition-colors cursor-pointer ${spanClass} ${
                    isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {isActive && (
                    <span
                      key={`progress-${idx}-${cycleGeneration}`}
                      onAnimationEnd={() => {
                        if (!prefersReducedMotion) {
                          jumpToSlide(idx + 1);
                        }
                      }}
                      className={`hero-tab-progress absolute top-0 left-0 right-0 h-[2px] bg-sky-400 pointer-events-none ${
                        isTabTimerPaused ? 'hero-tab-progress--paused' : ''
                      }`}
                    />
                  )}

                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          isActive ? 'text-sky-300' : 'text-slate-400'
                        }`}
                      >
                        {item.index}.
                      </span>
                      <span
                        className={`font-display text-sm font-semibold truncate transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-200 group-hover:text-sky-300'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <ArrowUpRight
                      className={`h-3.5 w-3.5 btn-arrow shrink-0 ${
                        isActive
                          ? 'text-sky-300'
                          : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400 tabular-nums">
                    <span className="truncate">{item.specRange}</span>
                    <span className="text-slate-300 shrink-0">
                      {getCategoryCount(item.category, item.count)} units
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
