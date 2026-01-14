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
        badge={<Badge variant="graphiti">KNOWLEDGE GRAPH</Badge>}
      >
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-indigo-400" />
          <span className="text-white">Knowledge Graph</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/50 mb-3">
          Interactive visualization of entities and relationships
        </p>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[400px] flex items-center justify-center bg-[#0a0a0f] rounded-xl border border-white/5"
            >
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
                <span className="text-sm text-white/50">
                  Building graph...
                </span>
              </div>
            </motion.div>
          ) : nodes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[400px] flex items-center justify-center text-center bg-[#0a0a0f] rounded-xl border border-white/5"
            >
              <div className="flex flex-col items-center gap-3 text-white/30">
                <Network className="w-12 h-12 opacity-30" />
                <p className="text-sm">No graph data yet</p>
                <p className="text-xs text-white/20">Process data to visualize the knowledge graph</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="graph"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Graph Container */}
              <div className="h-[400px] rounded-xl overflow-hidden relative bg-[#0a0a0f] border border-white/10">
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

              {/* Node Details Panel */}
              <AnimatePresence>
                {selectedNodeDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-14 left-3 right-3 z-20"
                  >
                    <div className="rounded-lg p-3 bg-slate-900/95 backdrop-blur-sm border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: selectedNodeDetails.fill }}
                          />
                          <div>
                            <span className="text-sm font-medium text-white">
                              {selectedNodeDetails.label}
                            </span>
                            <span className="text-[10px] text-white/40 uppercase tracking-wider ml-2">
                              {selectedNodeDetails.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedNode(null)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-white/40" />
                        </button>
                      </div>
                      {selectedNodeDetails.data && Object.keys(selectedNodeDetails.data).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(selectedNodeDetails.data).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-white/30 text-[10px] uppercase">{key}: </span>
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

        {/* Legend */}
        {nodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 pt-3 border-t border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3 h-3 text-white/40" />
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Entity Types</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(NODE_COLORS).map(([type, color]) => {
                const hasType = graphData.nodes.some((n) => n.type === type);
                if (!hasType) return null;
                const Icon = nodeTypeIcons[type as GraphNodeType];
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] bg-white/5 border border-white/5"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <Icon className="w-3 h-3 text-white/50" />
                    <span className="text-white/60 capitalize">{type}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
