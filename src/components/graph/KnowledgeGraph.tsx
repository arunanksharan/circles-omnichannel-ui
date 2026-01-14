'use client';

import { useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { transformToGraphData, NODE_COLORS } from '@/lib/utils/graph-transform';
import type { GraphitiCurrentState, TemporalFact, GraphNodeType } from '@/types/demo';
import {
  Network,
  Info,
  X,
  User,
  MapPin,
  AlertCircle,
  Heart,
  Users,
  Sparkles,
  Target,
  Calendar,
  Database,
  ZoomIn,
  Move,
  MousePointer2,
} from 'lucide-react';
import React from 'react';

// Dynamic import the wrapper with SSR disabled to avoid R3F context issues
const GraphCanvasWrapper = dynamic(
  () => import('./GraphCanvasWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-[#030308]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500"
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
    ),
  }
);

interface KnowledgeGraphProps {
  state: GraphitiCurrentState | null;
  facts: TemporalFact[];
  isLoading: boolean;
}

// Node type icons with consistent styling
const nodeTypeIcons: Record<GraphNodeType, React.ComponentType<{ className?: string }>> = {
  user: User,
  location: MapPin,
  issue: AlertCircle,
  fact: Database,
  pet: Heart,
  relationship: Users,
  interest: Sparkles,
  emotion: Heart,
  goal: Target,
  event: Calendar,
};

export function KnowledgeGraph({ state, facts, isLoading }: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Transform data to graph format
  const graphData = useMemo(() => {
    return transformToGraphData(state, facts);
  }, [state, facts]);

  // Convert to reagraph format
  const nodes = useMemo(() => {
    return graphData.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      fill: node.fill || NODE_COLORS[node.type],
      size: node.size || 8,
      data: { ...node.data, type: node.type },
    }));
  }, [graphData.nodes]);

  const edges = useMemo(() => {
    return graphData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    }));
  }, [graphData.edges]);

  // Get node details for tooltip
  const getSelectedNodeDetails = useCallback(() => {
    if (!selectedNode) return null;
    const node = graphData.nodes.find((n) => n.id === selectedNode);
    if (!node) return null;
    return node;
  }, [selectedNode, graphData.nodes]);

  const selectedNodeDetails = getSelectedNodeDetails();

  // Handlers for graph interactions
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  }, [selectedNode]);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNode(nodeId);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <Card id="knowledge-graph" variant="glass">
      <CardHeader
        badge={<Badge variant="graphiti">NEURAL GRAPH</Badge>}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Network className="w-4 h-4 text-purple-400" />
            <div className="absolute inset-0 w-4 h-4 bg-purple-400/30 blur-sm rounded-full" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Knowledge Graph
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/50 mb-3 font-light">
          Interactive visualization of entities and relationships
        </p>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[450px] flex items-center justify-center bg-[#030308] rounded-xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500"
                    style={{
                      boxShadow: '0 0 50px rgba(168, 85, 247, 0.6), 0 0 100px rgba(34, 211, 238, 0.3)',
                      animation: 'spin 3s linear infinite'
                    }}
                  />
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/50 to-cyan-400/50 blur-xl animate-pulse" />
                </div>
                <span className="text-sm text-white/50 font-light tracking-wide">
                  Constructing neural pathways...
                </span>
              </div>
            </motion.div>
          ) : nodes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[450px] flex items-center justify-center text-center bg-[#030308] rounded-xl border border-white/5"
            >
              <div className="flex flex-col items-center gap-3 text-white/30">
                <div className="relative">
                  <Network className="w-16 h-16 opacity-30" />
                  <div className="absolute inset-0 w-16 h-16 bg-purple-500/10 blur-2xl rounded-full" />
                </div>
                <p className="text-sm font-light">No graph data yet</p>
                <p className="text-xs text-white/20">Process data to visualize the knowledge graph</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="graph"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative"
            >
              {/* Graph Container with stunning border */}
              <div
                className="h-[450px] rounded-xl overflow-hidden relative"
                style={{
                  background: '#030308',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.05), inset 0 0 60px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Gradient border glow */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, transparent 50%, rgba(34, 211, 238, 0.1) 100%)',
                  }}
                />

                <GraphCanvasWrapper
                  nodes={nodes}
                  edges={edges}
                  theme={{}}
                  selectedNode={selectedNode}
                  hoveredNode={hoveredNode}
                  onNodeClick={handleNodeClick}
                  onNodeHover={handleNodeHover}
                  onCanvasClick={handleCanvasClick}
                />

                {/* Controls hint */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-white/30">
                  <div className="flex items-center gap-1">
                    <MousePointer2 className="w-3 h-3" />
                    <span>Click to select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Move className="w-3 h-3" />
                    <span>Drag to pan</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" />
                    <span>Scroll to zoom</span>
                  </div>
                </div>
              </div>

              {/* Node Details Panel - Stunning glassmorphism */}
              <AnimatePresence>
                {selectedNodeDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute bottom-16 left-3 right-3 z-20"
                  >
                    <div
                      className="rounded-xl p-4 backdrop-blur-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.1)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Glowing node indicator */}
                          <div className="relative">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: selectedNodeDetails.fill,
                                boxShadow: `0 0 12px ${selectedNodeDetails.fill}80`,
                              }}
                            />
                            <div
                              className="absolute inset-0 w-4 h-4 rounded-full animate-ping"
                              style={{
                                backgroundColor: selectedNodeDetails.fill,
                                opacity: 0.3,
                              }}
                            />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-white block">
                              {selectedNodeDetails.label}
                            </span>
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">
                              {selectedNodeDetails.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedNode(null)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <X className="w-4 h-4 text-white/40 hover:text-white/80" />
                        </button>
                      </div>
                      {selectedNodeDetails.data && Object.keys(selectedNodeDetails.data).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(selectedNodeDetails.data).map(([key, value]) => (
                              <div key={key} className="flex flex-col gap-0.5">
                                <span className="text-white/30 text-[10px] uppercase tracking-wider">{key}</span>
                                <span className="text-white/70">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend - Stunning with glow effects */}
        {nodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-4 border-t border-white/5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-3 h-3 text-purple-400/60" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Entity Types</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(NODE_COLORS).map(([type, color]) => {
                const hasType = graphData.nodes.some((n) => n.type === type);
                if (!hasType) return null;
                const Icon = nodeTypeIcons[type as GraphNodeType];
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] cursor-default transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}60`,
                      }}
                    />
                    <Icon className="w-3 h-3" style={{ color: `${color}` }} />
                    <span className="text-white/70 capitalize font-medium">{type}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
