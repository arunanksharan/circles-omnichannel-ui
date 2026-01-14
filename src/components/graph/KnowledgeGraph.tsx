'use client';

import { useMemo, useState, useCallback } from 'react';
import { GraphCanvas, type Theme, type GraphCanvasRef } from 'reagraph';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { transformToGraphData, NODE_COLORS } from '@/lib/utils/graph-transform';
import type { GraphitiCurrentState, TemporalFact, GraphNodeType } from '@/types/demo';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
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
} from 'lucide-react';
import React from 'react';

interface KnowledgeGraphProps {
  state: GraphitiCurrentState | null;
  facts: TemporalFact[];
  isLoading: boolean;
}

// Custom dark theme matching our UI
const graphitiTheme: Theme = {
  canvas: {
    background: 'transparent',
    fog: 'transparent',
  },
  node: {
    fill: '#8B5CF6',
    activeFill: '#A78BFA',
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.3,
    label: {
      color: '#F3F4F6',
      stroke: '#000000',
      activeColor: '#FFFFFF',
    },
    subLabel: {
      color: '#9CA3AF',
      stroke: '#000000',
      activeColor: '#D1D5DB',
    },
  },
  ring: {
    fill: '#8B5CF6',
    activeFill: '#A78BFA',
  },
  edge: {
    fill: '#4B5563',
    activeFill: '#8B5CF6',
    opacity: 0.6,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      color: '#9CA3AF',
      stroke: '#000000',
      activeColor: '#F3F4F6',
    },
  },
  arrow: {
    fill: '#4B5563',
    activeFill: '#8B5CF6',
  },
  lasso: {
    background: 'rgba(139, 92, 246, 0.1)',
    border: '2px solid #8B5CF6',
  },
  cluster: {
    stroke: '#4B5563',
    fill: '#1F2937',
    opacity: 0.3,
    selectedOpacity: 0.5,
    inactiveOpacity: 0.1,
    label: {
      stroke: '#000000',
      color: '#F3F4F6',
    },
  },
};

// Node type icons
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
  const graphRef = React.useRef<GraphCanvasRef>(null);
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

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    graphRef.current?.zoomIn?.();
  }, []);

  const handleZoomOut = useCallback(() => {
    graphRef.current?.zoomOut?.();
  }, []);

  const handleFitView = useCallback(() => {
    graphRef.current?.fitNodesInView?.();
  }, []);

  // Get node details for tooltip
  const getSelectedNodeDetails = useCallback(() => {
    if (!selectedNode) return null;
    const node = graphData.nodes.find((n) => n.id === selectedNode);
    if (!node) return null;
    return node;
  }, [selectedNode, graphData.nodes]);

  const selectedNodeDetails = getSelectedNodeDetails();

  return (
    <Card id="knowledge-graph" variant="glass">
      <CardHeader
        badge={<Badge variant="graphiti">GRAPH VIEW</Badge>}
      >
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          Knowledge Graph
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-3">
          Visual representation of entities and relationships in Graphiti
        </p>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[400px] flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-white/50">Building graph...</span>
              </div>
            </motion.div>
          ) : nodes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[400px] flex items-center justify-center text-center"
            >
              <div className="flex flex-col items-center gap-2 text-white/30">
                <Network className="w-12 h-12 opacity-50" />
                <p className="text-sm">No graph data yet</p>
                <p className="text-xs">Submit data to visualize the knowledge graph</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="graph"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Graph Container */}
              <div className="h-[400px] bg-black/30 rounded-lg border border-white/10 overflow-hidden">
                <GraphCanvas
                  ref={graphRef}
                  nodes={nodes}
                  edges={edges}
                  theme={graphitiTheme}
                  layoutType="forceDirected2d"
                  layoutOverrides={{
                    linkDistance: 100,
                    nodeStrength: -500,
                  }}
                  labelType="auto"
                  edgeLabelPosition="natural"
                  edgeInterpolation="curved"
                  edgeArrowPosition="end"
                  animated={true}
                  defaultNodeSize={8}
                  minNodeSize={5}
                  maxNodeSize={20}
                  draggable={true}
                  cameraMode="pan"
                  selections={selectedNode ? [selectedNode] : []}
                  actives={hoveredNode ? [hoveredNode] : []}
                  onNodeClick={(node) => {
                    setSelectedNode(node.id === selectedNode ? null : node.id);
                  }}
                  onNodePointerOver={(node) => {
                    setHoveredNode(node.id);
                  }}
                  onNodePointerOut={() => {
                    setHoveredNode(null);
                  }}
                  onCanvasClick={() => {
                    setSelectedNode(null);
                  }}
                />
              </div>

              {/* Graph Controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-1">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-black/50 hover:bg-black/70 border border-white/10 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-white/70" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-black/50 hover:bg-black/70 border border-white/10 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-white/70" />
                </button>
                <button
                  onClick={handleFitView}
                  className="p-2 bg-black/50 hover:bg-black/70 border border-white/10 rounded-lg transition-colors"
                  title="Fit View"
                >
                  <Maximize2 className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Node Details Panel */}
              <AnimatePresence>
                {selectedNodeDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedNodeDetails.fill }}
                        />
                        <span className="text-sm font-medium text-white">
                          {selectedNodeDetails.label}
                        </span>
                        <span className="text-xs text-white/50 uppercase">
                          {selectedNodeDetails.type}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-white/50" />
                      </button>
                    </div>
                    {selectedNodeDetails.data && Object.keys(selectedNodeDetails.data).length > 0 && (
                      <div className="mt-2 text-xs text-white/60 space-y-1">
                        {Object.entries(selectedNodeDetails.data).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-white/40">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        {nodes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1 mb-2">
              <Info className="w-3 h-3 text-white/40" />
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Legend</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(NODE_COLORS).map(([type, color]) => {
                const hasType = graphData.nodes.some((n) => n.type === type);
                if (!hasType) return null;
                const Icon = nodeTypeIcons[type as GraphNodeType];
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[10px]"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
