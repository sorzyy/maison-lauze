import { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';

// Données des régions viticoles avec coordonnées approximatives du SVG
const wineRegions = [
  { 
    id: 'bordeaux', 
    name: 'Bordeaux', 
    count: 55, 
    path: 'M95,280 Q85,290 75,285 Q65,280 70,270 Q75,260 85,265 Q95,270 95,280 Z',
    cx: 80, cy: 275
  },
  { 
    id: 'bourgogne', 
    name: 'Bourgogne', 
    count: 35, 
    path: 'M200,220 Q190,230 180,225 Q170,215 175,205 Q185,195 195,200 Q205,210 200,220 Z',
    cx: 188, cy: 212
  },
  { 
    id: 'champagne', 
    name: 'Champagne', 
    count: 25, 
    path: 'M210,170 Q200,180 190,175 Q185,165 190,155 Q200,145 210,150 Q220,160 210,170 Z',
    cx: 200, cy: 165
  },
  { 
    id: 'languedoc', 
    name: 'Languedoc', 
    count: 180, 
    path: 'M180,340 Q170,360 160,355 Q155,340 165,330 Q175,320 185,330 Q195,340 180,340 Z',
    cx: 172, cy: 340
  },
  { 
    id: 'provence', 
    name: 'Provence', 
    count: 40, 
    path: 'M210,340 Q205,355 195,350 Q190,335 200,330 Q215,325 220,340 Q225,350 210,340 Z',
    cx: 208, cy: 340
  },
  { 
    id: 'rhone', 
    name: 'Rhône', 
    count: 60, 
    path: 'M220,280 Q215,295 205,290 Q200,275 210,265 Q225,260 230,275 Q235,285 220,280 Z',
    cx: 218, cy: 278
  },
  { 
    id: 'alsace', 
    name: 'Alsace', 
    count: 20, 
    path: 'M240,180 Q235,195 228,190 Q225,175 232,165 Q245,160 250,175 Q255,185 240,180 Z',
    cx: 238, cy: 178
  },
  { 
    id: 'loire', 
    name: 'Loire', 
    count: 30, 
    path: 'M140,230 Q130,250 120,245 Q115,225 125,215 Q140,205 150,220 Q155,235 140,230 Z',
    cx: 135, cy: 228
  },
];

// Contour simplifié de la France métropolitaine
const franceOutline = `
  M 60,180 
  Q 50,150 70,130 
  Q 90,100 120,90 
  Q 150,80 180,85 
  Q 210,90 240,100 
  Q 270,110 280,140 
  Q 285,170 270,200 
  Q 260,230 250,260 
  Q 245,290 235,320 
  Q 225,350 205,370 
  Q 185,385 160,380 
  Q 135,375 115,360 
  Q 95,345 80,320 
  Q 65,295 60,260 
  Q 55,225 60,200 
  Z
`;

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  region: typeof wineRegions[0] | null;
}

interface WineMapProps {
  onRegionClick?: (regionId: string) => void;
}

export function WineMap({ onRegionClick }: WineMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    region: null,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseEnter = (region: typeof wineRegions[0], e: React.MouseEvent) => {
    setHoveredRegion(region.id);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 60,
        region,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tooltip.visible || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip(prev => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 60,
    }));
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleClick = (region: typeof wineRegions[0]) => {
    // Scroll vers la section correspondante si existe
    const sectionId = `region-${region.id}`;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    onRegionClick?.(region.id);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Titre de la section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MapPin className="w-4 h-4" style={{ color: '#9b3a86' }} />
          <span 
            className="text-xs tracking-[0.25em] uppercase text-white/60"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Explorer par région
          </span>
        </div>
        <h3 
          className="text-2xl md:text-3xl font-light text-white/90"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Nos Terroirs
        </h3>
      </div>

      {/* Container de la carte */}
      <div className="relative aspect-[4/5] w-full">
        <svg
          ref={svgRef}
          viewBox="0 0 320 420"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
        >
          {/* Fond de la carte */}
          <rect width="320" height="420" fill="transparent" />
          
          {/* Contour de la France */}
          <path
            d={franceOutline}
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1.5"
            opacity="0.6"
          />
          
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="strong-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Régions viticoles */}
          {wineRegions.map((region) => {
            const isHovered = hoveredRegion === region.id;
            return (
              <g key={region.id}>
                {/* Zone cliquable agrandie */}
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r="35"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(region, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(region)}
                />
                
                {/* Forme de la région */}
                <path
                  d={region.path}
                  fill={isHovered ? '#6a1d58' : '#4a4a4a'}
                  stroke={isHovered ? '#9b3a86' : '#666'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? 'url(#strong-glow)' : 'none',
                    transformOrigin: `${region.cx}px ${region.cy}px`,
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => handleMouseEnter(region, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(region)}
                />
                
                {/* Label de la région (visible au hover) */}
                {isHovered && (
                  <text
                    x={region.cx}
                    y={region.cy + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontFamily="'Syne', sans-serif"
                    fontWeight="500"
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {region.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Points indicateurs */}
          {wineRegions.map((region) => (
            <circle
              key={`dot-${region.id}`}
              cx={region.cx}
              cy={region.cy}
              r="3"
              fill={hoveredRegion === region.id ? '#c47ab8' : '#666'}
              className="transition-all duration-300 pointer-events-none"
              style={{
                transform: hoveredRegion === region.id ? 'scale(1.5)' : 'scale(1)',
                transformOrigin: `${region.cx}px ${region.cy}px`,
              }}
            />
          ))}
        </svg>

        {/* Tooltip HTML */}
        {tooltip.visible && tooltip.region && (
          <div
            className="absolute pointer-events-none z-50 px-4 py-3 rounded-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, 0)',
              background: 'rgba(10, 5, 12, 0.95)',
              border: '1px solid rgba(107, 29, 88, 0.4)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(107,29,88,0.2)',
              minWidth: '140px',
            }}
          >
            <p 
              className="text-white font-medium text-sm mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {tooltip.region.name}
            </p>
            <p 
              className="text-xs"
              style={{ 
                fontFamily: "'Syne', sans-serif",
                color: '#9b3a86'
              }}
            >
              {tooltip.region.count} vins
            </p>
            <div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(10, 5, 12, 0.95)',
              }}
            />
          </div>
        )}
      </div>

      {/* Légende */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {wineRegions.slice(0, 4).map((region) => (
          <button
            key={region.id}
            onClick={() => handleClick(region)}
            className="px-3 py-1.5 rounded-full text-xs transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: hoveredRegion === region.id 
                ? 'rgba(106, 29, 88, 0.3)' 
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${hoveredRegion === region.id 
                ? 'rgba(106, 29, 88, 0.6)' 
                : 'rgba(255,255,255,0.1)'}`,
              color: hoveredRegion === region.id ? '#c47ab8' : 'rgba(255,255,255,0.6)',
            }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {region.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {wineRegions.slice(4).map((region) => (
          <button
            key={region.id}
            onClick={() => handleClick(region)}
            className="px-3 py-1.5 rounded-full text-xs transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: hoveredRegion === region.id 
                ? 'rgba(106, 29, 88, 0.3)' 
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${hoveredRegion === region.id 
                ? 'rgba(106, 29, 88, 0.6)' 
                : 'rgba(255,255,255,0.1)'}`,
              color: hoveredRegion === region.id ? '#c47ab8' : 'rgba(255,255,255,0.6)',
            }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {region.name}
          </button>
        ))}
      </div>
    </div>
  );
}
