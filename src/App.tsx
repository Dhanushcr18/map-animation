import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

type FeatureSlide = {
  id: string;
  figure: string;
  title: string;
  body: string;
  image: string;
  art: 'aircraft' | 'rideshare' | 'motor';
};

type RouteSlide = {
  id: string;
  route: string;
  city: string;
  label: string;
  time: string;
  note: string;
  origin: string;
  destination: string;
  map: 'newyork' | 'dubai' | 'la';
  backgroundImage: string;
  routePath: string;
  badgePosition: { x: number; y: number };
  originPosition: { x: number; y: number };
  destinationPosition: { x: number; y: number };
};

const featureSlides: FeatureSlide[] = [
  {
    id: '01',
    figure: 'Fig. 1 - Panoramic windows',
    title: 'A front-row seat for everyone.',
    body: 'Every seat comes with a panoramic view, allowing you to experience your city like never before.',
    image: '/reference/slide-1-window.png',
    art: 'aircraft'
  },
  {
    id: '03',
    figure: 'Fig. 3 - Rideshare integration into the journey',
    title: 'Every leg of your journey, seamlessly orchestrated.',
    body: "A few taps on our app and we'll choreograph your entire commute, including an Uber to and from our vertiports. No hassle or headaches, just seamless travel from A to B.",
    image: '/reference/slide-2-rideshare.png',
    art: 'rideshare'
  },
  {
    id: '04',
    figure: 'Fig. 4 - Electric motor',
    title: 'All-electric flight for clear skies ahead.',
    body: "With zero operating emissions and a low acoustic footprint, we're delivering the cleanest way to travel through the clouds.",
    image: '/reference/slide-3-motor.png',
    art: 'motor'
  }
];

const routeSlides: RouteSlide[] = [
  {
    id: 'JFK',
    route: 'JFK  Manhattan',
    city: 'New York',
    label: 'Manhattan',
    time: '6',
    note: '43 min faster by air*',
    origin: 'JFK Airport',
    destination: 'Manhattan',
    map: 'newyork',
    backgroundImage: '/reference/map-panels/newyork-map.png',
    routePath: 'M690 382C678 220 580 120 420 102C304 88 208 138 132 230',
    badgePosition: { x: 160, y: 228 },
    originPosition: { x: 694, y: 384 },
    destinationPosition: { x: 132, y: 230 }
  },
  {
    id: 'DXB',
    route: 'DXB  Palm Jumeirah',
    city: 'Dubai',
    label: 'Palm Jumeirah',
    time: '9',
    note: '33 min faster by air*',
    origin: 'DXB Airport',
    destination: 'Palm Jumeirah',
    map: 'dubai',
    backgroundImage: '/reference/map-panels/dubai-map.png',
    routePath: 'M162 476C246 360 354 270 468 214C542 178 610 176 680 212',
    badgePosition: { x: 596, y: 200 },
    originPosition: { x: 162, y: 476 },
    destinationPosition: { x: 680, y: 212 }
  },
  {
    id: 'LAX',
    route: 'LAX  Downtown LA',
    city: 'Los Angeles',
    label: 'Downtown LA',
    time: '12',
    note: '33 min faster by air*',
    origin: 'LAX Airport',
    destination: 'Downtown LA',
    map: 'la',
    backgroundImage: '/reference/map-panels/la-map.png',
    routePath: 'M138 312C188 162 338 98 500 120C614 136 686 198 740 276',
    badgePosition: { x: 494, y: 120 },
    originPosition: { x: 138, y: 312 },
    destinationPosition: { x: 740, y: 276 }
  }
];


function App() {
  const appRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.05
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.route-shell',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.route-shell',
            start: 'top 70%'
          }
        }
      );

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        gsap.fromTo(
          '.hero-frame',
          { scale: 1.08, yPercent: 6, opacity: 0.2 },
          {
            scale: 1,
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
          }
        );

        const showDesktopFeature = (activeIndex: number) => {
          featureSlides.forEach((_, index) => {
            gsap.to(`.feature-media-${index}`, {
              opacity: index === activeIndex ? 1 : 0,
              scale: index === activeIndex ? 1 : 1.04,
              duration: 0.55,
              ease: 'power2.out',
              overwrite: true
            });
            gsap.to(`.feature-copy-panel-${index}`, {
              opacity: index === activeIndex ? 1 : 0,
              y: index === activeIndex ? 0 : 24,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: true
            });
            gsap.to(`.feature-dot-${index}`, {
              opacity: index === activeIndex ? 1 : 0.35,
              scaleY: index === activeIndex ? 1 : 0.45,
              backgroundColor: index === activeIndex ? '#f5f5e8' : '#d8d0bf',
              duration: 0.35,
              ease: 'power2.out',
              overwrite: true
            });
          });
        };

        showDesktopFeature(0);

        let desktopActiveIndex = 0;
        ScrollTrigger.create({
          trigger: '.feature-section',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const nextIndex = Math.min(
              featureSlides.length - 1,
              Math.floor(self.progress * featureSlides.length)
            );
            if (nextIndex !== desktopActiveIndex) {
              desktopActiveIndex = nextIndex;
              showDesktopFeature(nextIndex);
            }
          }
        });

        gsap.utils.toArray<HTMLElement>('.route-step').forEach((step, index) => {
          const bg = `.route-bg-${index}`;
          const item = `.route-item-${index}`;
          const path = `.route-arc-${index}`;
          const badge = `.route-badge-${index}`;
          const label = `.route-label-${index}`;
          const origin = `.route-origin-${index}`;
          const destination = `.route-destination-${index}`;

          gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: 'top 70%',
              end: 'bottom 35%',
              scrub: true
            }
          })
            .to(bg, { opacity: 1, scale: 1, ease: 'none' }, 0)
            .fromTo(item, { opacity: 0.45, x: 0 }, { opacity: 1, x: 0, ease: 'none' }, 0)
            .fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none' }, 0.08)
            .fromTo(origin, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, ease: 'none' }, 0.02)
            .fromTo(destination, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, ease: 'none' }, 0.34)
            .fromTo(
              badge,
              { opacity: 0, scale: 0.6, y: 18 },
              { opacity: 1, scale: 1, y: 0, ease: 'none' },
              0.34
            )
            .fromTo(label, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.36)
            .to(item, { opacity: 0.62, ease: 'none' }, 0.78)
            .to([badge, label, origin, destination], { opacity: 0.25, ease: 'none' }, 0.78)
            .to(bg, { opacity: index === routeSlides.length - 1 ? 1 : 0, scale: 1.015, ease: 'none' }, 0.78);
        });
      });

      mm.add('(max-width: 1023px)', () => {
        const showMobileFeature = (activeIndex: number) => {
          featureSlides.forEach((_, index) => {
            gsap.to(`.feature-mobile-panel-${index}`, {
              opacity: index === activeIndex ? 1 : 0,
              y: index === activeIndex ? 0 : 18,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: true
            });
            gsap.to(`.feature-mobile-media-${index}`, {
              opacity: index === activeIndex ? 1 : 0,
              scale: index === activeIndex ? 1 : 1.04,
              y: index === activeIndex ? 0 : 18,
              duration: 0.55,
              ease: 'power2.out',
              overwrite: true
            });
          });
        };

        showMobileFeature(0);

        let mobileActiveIndex = 0;
        ScrollTrigger.create({
          trigger: '.feature-section',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const nextIndex = Math.min(
              featureSlides.length - 1,
              Math.floor(self.progress * featureSlides.length)
            );
            if (nextIndex !== mobileActiveIndex) {
              mobileActiveIndex = nextIndex;
              showMobileFeature(nextIndex);
            }
          }
        });

        gsap.utils.toArray<HTMLElement>('.route-step-mobile').forEach((step, index) => {
          const panel = `.route-mobile-panel-${index}`;
          const item = `.route-item-${index}`;
          const path = `.route-mobile-arc-${index}`;
          const badge = `.route-mobile-badge-${index}`;
          const label = `.route-mobile-label-${index}`;
          const origin = `.route-mobile-origin-${index}`;
          const destination = `.route-mobile-destination-${index}`;

          gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: 'top 78%',
              end: 'bottom 36%',
              scrub: true
            }
          })
            .fromTo(panel, { opacity: 0.4, scale: 0.94, y: 36 }, { opacity: 1, scale: 1, y: 0, ease: 'none' }, 0)
            .fromTo(item, { opacity: 0.45 }, { opacity: 1, ease: 'none' }, 0.02)
            .fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none' }, 0.08)
            .fromTo(origin, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, ease: 'none' }, 0.1)
            .fromTo(destination, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, ease: 'none' }, 0.34)
            .fromTo(
              badge,
              { opacity: 0, scale: 0.6, y: 18 },
              { opacity: 1, scale: 1, y: 0, ease: 'none' },
              0.34
            )
            .fromTo(label, { opacity: 0 }, { opacity: 0.92, ease: 'none' }, 0.36)
            .to(item, { opacity: 0.7, ease: 'none' }, 0.82)
            .to([badge, label, origin, destination], { opacity: 0.35, ease: 'none' }, 0.82);
        });
      });

      return () => mm.revert();
    }, appRef);

    return () => {
      cancelAnimationFrame(frameId);
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={appRef} className="bg-shell text-ink">
      <main>
        <section className="feature-section relative mx-auto max-w-[1560px] px-4 pb-12 pt-4 md:px-8 md:pt-6">
          <div className="hidden lg:block lg:min-h-[336vh]">
            <div className="grid gap-8 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:grid-cols-[minmax(0,0.63fr)_minmax(320px,0.37fr)]">
              <div className="relative flex items-end overflow-hidden rounded-[3.5rem]">
                <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-3">
                  {featureSlides.map((slide, index) => (
                    <span
                      key={slide.id}
                      className={`feature-dot-${index} h-10 w-[5px] origin-bottom rounded-full bg-[#d8d0bf] opacity-35 scale-y-50`}
                    />
                  ))}
                </div>

                {featureSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`feature-media-${index} absolute inset-0 overflow-hidden rounded-[3.5rem] ${
                      index === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
                    }`}
                  >
                    <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="relative">
                {featureSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`feature-copy-panel-${index} absolute inset-0 flex items-center ${
                      index === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <FeatureCopy slide={slide} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:hidden min-h-[300vh]">
            <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-hidden rounded-[2.2rem]">
              {featureSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`feature-mobile-panel-${index} absolute inset-0 ${
                    index === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex h-full flex-col">
                    <div
                      className={`feature-mobile-media-${index} overflow-hidden rounded-[2.2rem] ${
                        index === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-[58vh] min-h-[18rem] w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 px-1 pb-3 pt-6">
                      <FeatureCopy slide={slide} mobile />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden="true">
            {featureSlides.map((slide) => (
              <div key={`${slide.id}-feature-trigger`} className="feature-step h-[100vh]" />
            ))}
          </div>
        </section>

        <section className="relative mt-2 bg-route px-4 py-4 text-routeText md:px-8 md:py-6">
          <div className="mx-auto max-w-[1560px] lg:min-h-[336vh]">
            <div className="route-shell overflow-hidden rounded-[2.4rem] bg-route shadow-[0_30px_100px_rgba(0,56,115,0.18)] lg:sticky lg:top-0">
              <div className="grid min-h-[100vh] gap-8 px-5 py-6 md:px-10 md:py-10 lg:grid-cols-[380px_minmax(0,1fr)]">
                <div className="relative z-20 flex flex-col justify-between">
                  <div>
                    <h2 className="max-w-[8ch] font-sans text-[clamp(3rem,5.6vw,5.2rem)] font-semibold leading-[0.9] tracking-[-0.08em]">
                      Be there in minutes.
                    </h2>

                    <div className="mt-12 space-y-0">
                      {routeSlides.map((slide, index) => (
                        <div
                          key={slide.id}
                          className={`route-item-${index} border-t border-white/65 py-4 ${index === routeSlides.length - 1 ? 'border-b' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-4 text-[clamp(1.25rem,1.5vw,1.9rem)] leading-none tracking-[-0.04em]">
                            <div>
                              <div>{slide.route}</div>
                              <div className="mt-2 text-[clamp(1.05rem,1vw,1.4rem)] font-medium text-white/82">
                                {slide.note}
                              </div>
                            </div>
                            <div className="pt-1 text-[clamp(1rem,1vw,1.25rem)] text-white/78">{slide.city}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="max-w-[18ch] text-[clamp(0.95rem,1vw,1.2rem)] leading-[1.15] tracking-[-0.03em] text-white/88">
                    *Based on peak travel times in representative markets.
                  </p>
                </div>

                <div className="relative hidden min-h-[68vh] lg:block">
                  {routeSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`route-bg-${index} absolute inset-0 rounded-[2rem] ${
                        index === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
                      }`}
                      aria-hidden="true"
                    >
                      <MapPanel slide={slide} index={index} animate />
                    </div>
                  ))}
                </div>

                <div className="space-y-6 lg:hidden">
                  {routeSlides.map((slide, index) => (
                    <div key={slide.id} className="route-step-mobile overflow-hidden rounded-[1.8rem] border border-white/20">
                      <MapPanel
                        slide={slide}
                        index={index}
                        animate
                        animationPrefix="route-mobile"
                        panelClassName={`route-mobile-panel-${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden="true">
              {routeSlides.map((slide) => (
                <div key={`${slide.id}-trigger`} className="route-step h-[112vh]" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCopy({ slide, mobile = false }: { slide: FeatureSlide; mobile?: boolean }) {
  return (
    <div className={`mx-auto w-full ${mobile ? 'max-w-none px-1' : 'max-w-[370px] lg:ml-auto lg:mr-0'}`}>
      <div className={`grid gap-8 ${mobile ? '' : 'lg:block'}`}>
        <div className="w-full max-w-[250px] rounded-[1.4rem] border border-black/10 bg-white/12 p-4">
          <div
            className="rounded-[1.1rem] border border-black/10 p-4"
            style={{ backgroundColor: 'rgba(245, 243, 223, 0.7)' }}
          >
            <div className="mb-3 aspect-square overflow-hidden rounded-[1rem] border border-black/10 bg-shell">
              <FeatureArt kind={slide.art} />
            </div>
            <p className="text-[13px] leading-none tracking-[-0.02em] text-black/70">{slide.figure}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="max-w-[10ch] font-sans text-[clamp(2.4rem,4vw,4.15rem)] font-semibold leading-[0.96] tracking-[-0.06em]">
            {slide.title}
          </h2>
          <p className="max-w-[32ch] text-[clamp(1.05rem,1.45vw,1.25rem)] leading-[1.35] tracking-[-0.03em] text-black/76">
            {slide.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function MapPanel({
  slide,
  index,
  animate = false,
  animationPrefix = 'route',
  panelClassName = ''
}: {
  slide: RouteSlide;
  index: number;
  animate?: boolean;
  animationPrefix?: string;
  panelClassName?: string;
}) {
  return (
    <div className={`relative h-full min-h-[24rem] overflow-hidden rounded-[2rem] bg-[#167fe0] ${panelClassName}`}>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${slide.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,128,223,0.08),rgba(19,128,223,0.22))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_34%)]" />
      <svg
        viewBox="0 0 840 560"
        className="relative z-10 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${slide.label} route map`}
      >
        <rect width="840" height="560" fill="url(#mapWash)" />

        <defs>
          <linearGradient id="mapWash" x1="420" y1="0" x2="420" y2="560" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1380df" stopOpacity="0.06" />
            <stop offset="1" stopColor="#1380df" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        <path
          className={animate ? `${animationPrefix}-arc-${index}` : undefined}
          d={slide.routePath}
          stroke="#f5f5dc"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? 1 : 0}
        />

        <g
          className={animate ? `${animationPrefix}-origin-${index}` : undefined}
          transform={`translate(${slide.originPosition.x} ${slide.originPosition.y})`}
          opacity={animate ? 0 : 1}
        >
          <circle r="11" fill="#167fe0" stroke="#f5f5dc" strokeWidth="2.5" />
          <text x="-22" y="34" fill="#f5f5dc" fontSize="18" fontWeight="700">
            {slide.origin}
          </text>
        </g>

        <g
          className={animate ? `${animationPrefix}-destination-${index}` : undefined}
          transform={`translate(${slide.destinationPosition.x} ${slide.destinationPosition.y})`}
          opacity={animate ? 0 : 1}
        >
          <circle r="13" fill="#f5f5dc" />
          <text x="-22" y="40" fill="#f5f5dc" fontSize="18" fontWeight="700">
            {slide.destination}
          </text>
        </g>

        <g
          className={animate ? `${animationPrefix}-badge-${index}` : undefined}
          transform={`translate(${slide.badgePosition.x} ${slide.badgePosition.y})`}
          opacity={animate ? 0 : 1}
        >
          <circle r="34" fill="#f5f5dc" />
          <text y="-1" textAnchor="middle" fill="#1380df" fontSize="24" fontWeight="800">
            {slide.time}
          </text>
          <text y="18" textAnchor="middle" fill="#1380df" fontSize="14" fontWeight="700">
            min
          </text>
        </g>

        <text
          className={animate ? `${animationPrefix}-label-${index}` : undefined}
          x="32"
          y="526"
          fill="#f5f5dc"
          fontSize="18"
          fontWeight="600"
          opacity={animate ? 0 : 0.92}
        >
          {slide.route}
        </text>
      </svg>
    </div>
  );
}

function FeatureArt({ kind }: { kind: FeatureSlide['art'] }) {
  if (kind === 'rideshare') {
    return (
      <svg viewBox="0 0 280 280" className="h-full w-full text-black/70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="18" width="244" height="244" rx="18" stroke="currentColor" strokeOpacity="0.14" />
        <path d="M204 64C177 59 148 61 124 72C92 86 72 117 68 152" stroke="currentColor" strokeWidth="2.5" />
        <path d="M69 153C67 175 74 198 92 214" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 6" />
        <path d="M91 214C119 237 161 238 196 220C224 205 242 178 245 146" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="67" cy="153" r="18" stroke="currentColor" strokeWidth="2" />
        <circle cx="210" cy="64" r="18" fill="currentColor" />
        <path d="M60 153L67 145L74 153" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M205 64L209 69L216 58" stroke="#f5f5e8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M116 182H154L166 158H104L116 182Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="120" cy="188" r="7" stroke="currentColor" strokeWidth="2" />
        <circle cx="150" cy="188" r="7" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (kind === 'motor') {
    return (
      <svg viewBox="0 0 280 280" className="h-full w-full text-black/72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="18" width="244" height="244" rx="18" stroke="currentColor" strokeOpacity="0.14" />
        <circle cx="140" cy="78" r="34" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="140" cy="78" r="14" stroke="currentColor" strokeWidth="2.2" />
        <path d="M92 106H188V144C188 166 170 184 148 184H132C110 184 92 166 92 144V106Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="M108 184V214H126V184" stroke="currentColor" strokeWidth="2.2" />
        <path d="M154 184V214H172V184" stroke="currentColor" strokeWidth="2.2" />
        <path d="M81 120L57 134V170L81 154V120Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="M199 120L223 134V170L199 154V120Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="M110 118H170" stroke="currentColor" strokeWidth="2.2" />
        <path d="M110 138H170" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 280 280" className="h-full w-full text-black/70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="18" width="244" height="244" rx="18" stroke="currentColor" strokeOpacity="0.14" />
      <path d="M69 148L112 114C119 108 128 104 137 104H174C191 104 204 117 204 134V152" stroke="currentColor" strokeWidth="2.2" />
      <path d="M90 168H192" stroke="currentColor" strokeWidth="2.2" />
      <path d="M114 110L123 88H168L180 110" stroke="currentColor" strokeWidth="2.2" />
      <path d="M77 154C69 154 62 147 62 139C62 132 68 126 75 126H90" stroke="currentColor" strokeWidth="2.2" />
      <path d="M210 154C218 154 225 147 225 139C225 132 219 126 212 126H197" stroke="currentColor" strokeWidth="2.2" />
      <path d="M96 168V180C96 187 102 193 109 193H115" stroke="currentColor" strokeWidth="2.2" />
      <path d="M186 168V180C186 187 180 193 173 193H167" stroke="currentColor" strokeWidth="2.2" />
      <path d="M126 137H155" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="110" cy="168" r="13" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="172" cy="168" r="13" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export default App;
