import React from 'react';
import { Box, Typography, Button, Paper, CircularProgress, useTheme, alpha, Theme } from '@mui/material';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge,
  MarkerType,
  Position,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  Handle
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface IaDiagramProps {
  diagramData: string;
  isLoading: boolean;
  onGenerateWireframe: () => void;
}

const nodeWidth = 180;
const nodeHeight = 40;

// Custom node styles based on section type
const getNodeStyles = (theme: Theme) => ({
  homepage: {
    background: theme.palette.primary.main,
    color: 'white',
    border: `1px solid ${theme.palette.primary.dark}`,
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  account: {
    background: '#9c27b0',
    color: 'white',
    border: '1px solid #7b1fa2',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  booking: {
    background: '#8e24aa',
    color: 'white',
    border: '1px solid #6a1b9a',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  about: {
    background: '#7e57c2',
    color: 'white',
    border: '1px solid #5e35b1',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  destination: {
    background: '#5c6bc0',
    color: 'white',
    border: '1px solid #3949ab',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  service: {
    background: '#3f51b5',
    color: 'white',
    border: '1px solid #303f9f',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  tips: {
    background: '#673ab7',
    color: 'white',
    border: '1px solid #512da8',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  default: {
    background: '#9575cd',
    color: 'white',
    border: '1px solid #7e57c2',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    width: nodeWidth,
    height: nodeHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  }
});

// Define the type for node props
interface NodeProps {
  data: { label: string };
  type?: string;
}

// Custom node components
const CustomNode = ({ data, type }: NodeProps) => {
  const theme = useTheme();
  const nodeStyles = getNodeStyles(theme);
  const style = nodeStyles[type as keyof typeof nodeStyles] || nodeStyles.default;
  
  return (
    <div style={style}>
      {data.label}
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#fff' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#fff' }} />
    </div>
  );
};

const HomeNode = (props: NodeProps) => <CustomNode {...props} type="homepage" />;
const AccountNode = (props: NodeProps) => <CustomNode {...props} type="account" />;
const BookingNode = (props: NodeProps) => <CustomNode {...props} type="booking" />;
const AboutNode = (props: NodeProps) => <CustomNode {...props} type="about" />;
const DestinationNode = (props: NodeProps) => <CustomNode {...props} type="destination" />;
const ServiceNode = (props: NodeProps) => <CustomNode {...props} type="service" />;
const TipsNode = (props: NodeProps) => <CustomNode {...props} type="tips" />;
const DefaultNode = (props: NodeProps) => <CustomNode {...props} type="default" />;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Customize layout settings
  dagreGraph.setGraph({ 
    rankdir: 'TB',
    align: 'UL',
    ranker: 'network-simplex',
    ranksep: 100,
    nodesep: 80,
    edgesep: 50,
    marginx: 20,
    marginy: 20
  });

  // Add nodes with padding
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: nodeWidth + 50,
      height: nodeHeight + 30
    });
  });

  // Add edges with weight for better distribution
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, { 
      weight: 2,
      minlen: 2
    });
  });

  dagre.layout(dagreGraph);

  // Position nodes
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
  });

  // Configure edges
  edges.forEach((edge) => {
    edge.type = 'smoothstep';
    edge.animated = false;
    edge.style = { 
      stroke: '#9575cd',
      strokeWidth: 2,
      strokeDasharray: 'none',
    };
    edge.markerEnd = {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#9575cd',
    };
  });

  return { nodes, edges };
};

const parseMarkdownToFlow = (markdown: string): { nodes: Node[]; edges: Edge[] } => {
  if (!markdown || markdown.trim() === '') {
    return { nodes: [], edges: [] };
  }

  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  let nodeCounter = 0;
  let yPosition = 0;
  const ySpacing = 80;
  const xIndent = 200;
  
  // Split into structure and connections sections
  const sections = markdown.split('## Connections');
  
  // Handle different section formats
  let structureSection = '';
  if (markdown.includes('## Structure')) {
    structureSection = sections[0]?.split('## Structure')[1]?.trim() || '';
  } else if (markdown.includes('## Main Sections')) {
    structureSection = sections[0]?.split('## Main Sections')[1]?.trim() || '';
  } else {
    // Fallback if no section headers are found
    structureSection = sections[0]?.trim() || '';
  }
  
  const connectionsSection = sections[1]?.trim() || '';
  
  // Create a map to store node labels and their IDs
  const nodeLabelMap = new Map<string, string>();
  
  // Track existing edges to prevent duplicates
  const existingEdges = new Set<string>();
  
  // Parse structure and create nodes
  const structureLines = structureSection.split('\n').filter(line => line.trim());
  
  structureLines.forEach(line => {
    const indent = line.search(/\S|$/);
    const level = Math.floor(indent / 2);
    const label = line.trim().replace(/^[-*] /, '');
    
    if (!label) return; // Skip empty lines
    
    const nodeId = `node_${nodeCounter++}`;
    
    // Determine node type based on content
    let type = 'default';
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel === 'homepage' || lowerLabel === 'home' || lowerLabel === 'home page') {
      type = 'homepage';
    } else if (lowerLabel.includes('account') || lowerLabel.includes('profile') || lowerLabel.includes('login')) {
      type = 'account';
    } else if (lowerLabel.includes('booking') || lowerLabel.includes('reservation')) {
      type = 'booking';
    } else if (lowerLabel.includes('about')) {
      type = 'about';
    } else if (lowerLabel.includes('destination') || lowerLabel.includes('location')) {
      type = 'destination';
    } else if (lowerLabel.includes('service')) {
      type = 'service';
    } else if (lowerLabel.includes('tip') || lowerLabel.includes('guide') || lowerLabel.includes('faq')) {
      type = 'tips';
    }
    
    // Add node to the map for later connection lookup
    nodeLabelMap.set(label, nodeId);
    
    // Create node
    initialNodes.push({
      id: nodeId,
      position: { x: level * xIndent, y: yPosition },
      data: { label },
      type,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
    
    yPosition += ySpacing;
  });
  
  // Create parent-child edges based on indentation
  for (let i = 0; i < structureLines.length; i++) {
    const currentLine = structureLines[i];
    const currentIndent = currentLine.search(/\S|$/);
    const currentLevel = Math.floor(currentIndent / 2);
    const currentLabel = currentLine.trim().replace(/^[-*] /, '');
    
    if (!currentLabel) continue;
    
    // Look for parent (first line above with lower indent)
    for (let j = i - 1; j >= 0; j--) {
      const potentialParentLine = structureLines[j];
      const parentIndent = potentialParentLine.search(/\S|$/);
      const parentLevel = Math.floor(parentIndent / 2);
      const parentLabel = potentialParentLine.trim().replace(/^[-*] /, '');
      
      if (parentLevel < currentLevel) {
        const sourceId = nodeLabelMap.get(parentLabel);
        const targetId = nodeLabelMap.get(currentLabel);
        
        if (sourceId && targetId) {
          const edgeId = `edge_${sourceId}_${targetId}`;
          
          if (!existingEdges.has(edgeId)) {
            initialEdges.push({
              id: edgeId,
              source: sourceId,
              target: targetId,
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#333', strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#333',
              },
            });
            
            existingEdges.add(edgeId);
          }
        }
        
        break;
      }
    }
  }
  
  // Parse additional connections
  const connectionLines = connectionsSection.split('\n').filter(line => line.trim());
  
  connectionLines.forEach(line => {
    const match = line.match(/^(.*?)\s*->\s*(.*?)$/);
    
    if (match) {
      const sourceLabel = match[1].trim();
      const targetLabel = match[2].trim();
      
      const sourceId = nodeLabelMap.get(sourceLabel);
      const targetId = nodeLabelMap.get(targetLabel);
      
      if (sourceId && targetId) {
        const edgeId = `edge_${sourceId}_${targetId}`;
        
        if (!existingEdges.has(edgeId)) {
          initialEdges.push({
            id: edgeId,
            source: sourceId,
            target: targetId,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#333', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#333',
            },
          });
          
          existingEdges.add(edgeId);
        }
      }
    }
  });
  
  // Apply layout
  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);
  
  return { nodes, edges };
};

export const IaDiagram: React.FC<IaDiagramProps> = ({ 
  diagramData, 
  isLoading, 
  onGenerateWireframe 
}) => {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = React.useState<string | null>(null);

  // Parse the markdown diagram data into nodes and edges
  React.useEffect(() => {
    if (!diagramData || diagramData.trim() === '') {
      return;
    }

    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } = parseMarkdownToFlow(diagramData);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setError(null);
    } catch (err) {
      console.error('Error parsing IA diagram data:', err);
      setError('Failed to parse the IA diagram data. Please try again.');
    }
  }, [diagramData]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 8,
          minHeight: 400
        }}
        className="fade-in"
      >
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ 
            color: theme.palette.primary.main,
            mb: 3
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Generating Information Architecture...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        className="fade-in"
      >
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: 60, 
            color: theme.palette.error.main,
            mb: 2
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            color: theme.palette.error.main,
            fontWeight: 600,
            mb: 3
          }}
        >
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Reload
        </Button>
      </Paper>
    );
  }

  if (!diagramData || nodes.length === 0) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        className="fade-in"
      >
        <AccountTreeIcon 
          sx={{ 
            fontSize: 60, 
            color: theme.palette.primary.main,
            mb: 2
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            color: theme.palette.text.primary,
            fontWeight: 600,
            mb: 3
          }}
        >
          No information architecture data available.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Reload
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 5 }} className="fade-in">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: 550,
            overflow: 'hidden'
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            connectionMode={ConnectionMode.Loose}
            fitView
            attributionPosition="bottom-left"
            style={{ height: '100%', width: '100%' }}
            nodeTypes={{
              homepage: HomeNode,
              account: AccountNode,
              booking: BookingNode,
              about: AboutNode,
              destination: DestinationNode,
              service: ServiceNode,
              tips: TipsNode,
              default: DefaultNode
            }}
          >
            <Controls />
            <Background color="#e0e0e0" gap={16} />
          </ReactFlow>
        </Paper>
        
        {/* New separate Paper component for the button */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            background: alpha(theme.palette.primary.light, 0.1),
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 600
            }}
          >
            Ready to proceed to template selection?
          </Typography>
          
          <Button
            variant="contained"
            onClick={onGenerateWireframe}
            sx={{
              py: 1.5,
              px: 5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(98, 0, 234, 0.6)',
              background: 'linear-gradient(90deg, #6200EA, #B388FF)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(98, 0, 234, 0.7)',
                background: 'linear-gradient(90deg, #5000D6, #A370FF)',
                transform: 'translateY(-3px)',
              }
            }}
          >
            Next: Select Template
          </Button>
        </Paper>
      </Box>

      {/* Fixed position button that will always be visible */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Button
          variant="contained"
          onClick={onGenerateWireframe}
          sx={{
            py: 2,
            px: 6,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1.2rem',
            textTransform: 'none',
            boxShadow: '0 4px 20px rgba(98, 0, 234, 0.8)',
            background: 'linear-gradient(90deg, #6200EA, #B388FF)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(98, 0, 234, 0.9)',
              background: 'linear-gradient(90deg, #5000D6, #A370FF)',
              transform: 'translateY(-3px) scale(1.05)',
            }
          }}
        >
          Next: Select Template →
        </Button>
      </Box>
    </>
  );
};