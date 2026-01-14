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

// Loading component matching UI theme
function GraphLoading() {
  return (
    <div className="h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400"
            style={{
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
              animation: 'spin 2s linear infinite'
            }}
          />
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-indigo-500/30 blur-xl animate-pulse" />
        </div>
        <span className="text-sm text-white/50 font-light">
          Loading graph...
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

// Graphiti theme configuration - matches the app's design system
// Note: All colors must be valid hex or rgb colors (no 'transparent' keyword)
const createGraphitiTheme = () => ({
  canvas: {
    background: '#0a0a0f',
    fog: '#0a0a0f',
  },
  node: {
    fill: '#6366F1',
    activeFill: '#818CF8',
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.5,
    label: {
      color: '#E2E8F0',
      activeColor: '#FFFFFF',
      fontSize: 12,
    },
  },
  ring: {
    fill: '#6366F1',
    activeFill: '#A5B4FC',
  },
  edge: {
    fill: '#A5B4FC',
    activeFill: '#C7D2FE',
    opacity: 0.6,
    selectedOpacity: 1,
    inactiveOpacity: 0.3,
    label: {
      color: '#94A3B8',
      activeColor: '#CBD5E1',
      fontSize: 10,
    },
  },
  arrow: {
    fill: '#A5B4FC',
    activeFill: '#C7D2FE',
  },
  lasso: {
    background: '#6366F1',
    border: '#818CF8',
  },
  cluster: {
    stroke: '#334155',
    fill: '#1E293B',
    opacity: 0.3,
    selectedOpacity: 0.6,
    inactiveOpacity: 0.15,
    label: {
      color: '#E2E8F0',
      fontSize: 14,
    },
  },
});

// Memoized wrapper component with mount guard pattern
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
      const timer = setTimeout(() => {
        graphRef.current?.centerGraph();
      }, 600);
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

  // Handle hover
  const handleNodePointerOver = useCallback((node: { id: string }) => {
    onNodeHover(node.id);
  }, [onNodeHover]);

  const handleNodePointerOut = useCallback(() => {
    onNodeHover(null);
  }, [onNodeHover]);

  // Create the graphiti theme
  const graphitiTheme = createGraphitiTheme();

  // Show loading until fully mounted on client
  if (!mounted) {
    return <GraphLoading />;
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Subtle ambient glow matching graphiti colors */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.06) 0%, rgba(10, 10, 15, 0) 60%)',
        }}
      />

      {/* The graph canvas */}
      <GraphCanvas
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        theme={graphitiTheme}
        layoutType="forceDirected2d"
        layoutOverrides={{
          linkDistance: 120,
          nodeStrength: -600,
          linkStrength: 0.6,
        }}
        labelType="all"
        edgeLabelPosition="natural"
        edgeInterpolation="curved"
        edgeArrowPosition="end"
        animated={true}
        defaultNodeSize={10}
        minNodeSize={6}
        maxNodeSize={20}
        draggable={true}
        cameraMode="pan"
        minDistance={100}
        maxDistance={2000}
        selections={selectedNode ? [selectedNode] : []}
        actives={hoveredNode ? [hoveredNode] : []}
        onNodeClick={handleNodeClick}
        onNodePointerOver={handleNodePointerOver}
        onNodePointerOut={handleNodePointerOut}
        onCanvasClick={onCanvasClick}
      />

      {/* Interaction indicator */}
      {isInteracting && (
        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-500/30 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs text-indigo-300">Focusing...</span>
        </div>
      )}
    </div>
  );
});

export default GraphCanvasWrapper;
