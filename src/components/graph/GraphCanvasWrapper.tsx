'use client';

import { memo, useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { GraphCanvasRef } from 'reagraph';

// Types for the graph data
interface GraphNode {
  id: string;
  label: string;
  fill?: string;
  size?: number;
  data?: Record<string, unknown>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface GraphCanvasWrapperProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  theme: unknown;
  selectedNode: string | null;
  hoveredNode: string | null;
  onNodeClick: (nodeId: string) => void;
  onNodeHover: (nodeId: string | null) => void;
  onCanvasClick: () => void;
}

// Stunning loading component with pulsing glow
function GraphLoading() {
  return (
    <div className="h-full flex items-center justify-center bg-[#030308]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated orb with glow */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500 animate-spin-slow"
               style={{
                 boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(34, 211, 238, 0.3)',
                 animation: 'spin 3s linear infinite'
               }}
          />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/50 to-cyan-400/50 blur-xl animate-pulse" />
        </div>
        <span className="text-sm text-white/60 font-light tracking-wide">
          Initializing neural graph...
        </span>
      </div>
    </div>
  );
}

// Dynamically import GraphCanvas from reagraph with SSR disabled
const GraphCanvas = dynamic(
  () => import('reagraph').then((mod) => mod.GraphCanvas),
  {
    ssr: false,
    loading: () => <GraphLoading />,
  }
);

// Stunning cyber/neon theme configuration
const createCyberTheme = () => ({
  canvas: {
    background: '#030308', // Near-black with slight blue tint
    fog: '#030308',
  },
  node: {
    fill: '#A855F7',
    activeFill: '#D8B4FE',
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.4,
    label: {
      color: '#F8FAFC',
      stroke: 'transparent',
      strokeWidth: 0,
      activeColor: '#FFFFFF',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      backgroundOpacity: 0.95,
      padding: 10,
      strokeColor: 'rgba(168, 85, 247, 0.5)',
      radius: 6,
    },
    subLabel: {
      color: '#94A3B8',
      stroke: 'transparent',
      activeColor: '#CBD5E1',
    },
  },
  ring: {
    fill: '#A855F7',
    activeFill: '#D8B4FE',
  },
  edge: {
    fill: '#475569',
    activeFill: '#22D3EE',
    opacity: 0.5,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      color: '#94A3B8',
      stroke: 'transparent',
      activeColor: '#E2E8F0',
      fontSize: 11,
    },
    subLabel: {
      color: '#64748B',
      stroke: 'transparent',
      activeColor: '#94A3B8',
      fontSize: 9,
    },
  },
  arrow: {
    fill: '#475569',
    activeFill: '#22D3EE',
  },
  lasso: {
    background: 'rgba(168, 85, 247, 0.15)',
    border: '2px solid rgba(168, 85, 247, 0.6)',
  },
  cluster: {
    stroke: '#334155',
    fill: '#1E293B',
    opacity: 0.25,
    selectedOpacity: 0.5,
    inactiveOpacity: 0.08,
    label: {
      stroke: 'transparent',
      color: '#E2E8F0',
      fontSize: 16,
      offset: [0, 25, 0],
    },
  },
});

// Memoized wrapper component with mount guard pattern and enhanced interactions
const GraphCanvasWrapper = memo(function GraphCanvasWrapper({
  nodes,
  edges,
  selectedNode,
  hoveredNode,
  onNodeClick,
  onNodeHover,
  onCanvasClick,
}: GraphCanvasWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const graphRef = useRef<GraphCanvasRef>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // This ensures the component only renders after the initial client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-center graph when nodes change
  useEffect(() => {
    if (mounted && graphRef.current && nodes.length > 0) {
      // Small delay to let the layout settle
      const timer = setTimeout(() => {
        graphRef.current?.centerGraph();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, nodes.length]);

  // Focus on selected node with smooth zoom
  useEffect(() => {
    if (mounted && graphRef.current && selectedNode) {
      graphRef.current?.fitNodesInView([selectedNode], { singleNode: true });
    }
  }, [mounted, selectedNode]);

  // Handle node click with visual feedback
  const handleNodeClick = useCallback((node: { id: string }) => {
    setIsInteracting(true);
    onNodeClick(node.id);
    setTimeout(() => setIsInteracting(false), 300);
  }, [onNodeClick]);

  // Handle hover with smooth transitions
  const handleNodePointerOver = useCallback((node: { id: string }) => {
    onNodeHover(node.id);
  }, [onNodeHover]);

  const handleNodePointerOut = useCallback(() => {
    onNodeHover(null);
  }, [onNodeHover]);

  // Create the cyber theme
  const cyberTheme = createCyberTheme();

  // Show loading until fully mounted on client
  if (!mounted) {
    return <GraphLoading />;
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Ambient glow effect in background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Secondary glow for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 70%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* The graph canvas */}
      <GraphCanvas
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        theme={cyberTheme}
        layoutType="forceDirected2d"
        layoutOverrides={{
          linkDistance: 150,
          nodeStrength: -800,
          linkStrength: 0.5,
        }}
        labelType="all"
        edgeLabelPosition="natural"
        edgeInterpolation="curved"
        edgeArrowPosition="end"
        animated={true}
        defaultNodeSize={12}
        minNodeSize={8}
        maxNodeSize={25}
        draggable={true}
        cameraMode="pan"
        minDistance={50}
        maxDistance={3000}
        selections={selectedNode ? [selectedNode] : []}
        actives={hoveredNode ? [hoveredNode] : []}
        onNodeClick={handleNodeClick}
        onNodePointerOver={handleNodePointerOver}
        onNodePointerOut={handleNodePointerOut}
        onCanvasClick={onCanvasClick}
      />

      {/* Interaction indicator */}
      {isInteracting && (
        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-300">Focusing...</span>
        </div>
      )}

      {/* Subtle vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(3, 3, 8, 0.4) 100%)',
        }}
      />
    </div>
  );
});

export default GraphCanvasWrapper;
