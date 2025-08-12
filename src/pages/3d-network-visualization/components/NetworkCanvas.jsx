import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Icon from '../../../components/AppIcon';

const NetworkCanvas = ({ 
  nodeSize = 1.0, 
  showConnections = true, 
  colorScheme = 'status',
  filters = {},
  isAnimating = false,
  onNodeSelect = () => {},
  onScreenshot = () => {}
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  // Mock network data
  const networkData = {
    nodes: [
      { id: 'pos_1', type: 'pos', status: 'active', name: 'Tunis Central POS', location: 'Tunis', transactions: 1250, performance: 95.2, position: [0, 0, 0] },
      { id: 'pos_2', type: 'pos', status: 'active', name: 'Sfax Branch POS', location: 'Sfax', transactions: 890, performance: 92.1, position: [5, 2, -3] },
      { id: 'pos_3', type: 'pos', status: 'issues', name: 'Sousse POS', location: 'Sousse', transactions: 340, performance: 67.8, position: [-3, 1, 4] },
      { id: 'pos_4', type: 'processing', status: 'active', name: 'Central Processing', location: 'Tunis', transactions: 2500, performance: 98.5, position: [2, -2, 1] },
      { id: 'pos_5', type: 'pos', status: 'processing', name: 'Bizerte POS', location: 'Bizerte', transactions: 567, performance: 88.3, position: [-4, 3, -2] },
      { id: 'pos_6', type: 'pos', status: 'active', name: 'Gabes POS', location: 'Gabes', transactions: 723, performance: 91.7, position: [3, -1, 5] },
      { id: 'pos_7', type: 'processing', status: 'active', name: 'Backup Center', location: 'Sfax', transactions: 1800, performance: 96.4, position: [-1, 4, -1] },
      { id: 'pos_8', type: 'pos', status: 'inactive', name: 'Kairouan POS', location: 'Kairouan', transactions: 0, performance: 0, position: [4, 1, -4] }
    ],
    connections: [
      { source: 'pos_1', target: 'pos_4', strength: 0.9, type: 'cheques' },
      { source: 'pos_2', target: 'pos_4', strength: 0.7, type: 'factures' },
      { source: 'pos_3', target: 'pos_7', strength: 0.4, type: 'kimbiales' },
      { source: 'pos_5', target: 'pos_4', strength: 0.6, type: 'cheques' },
      { source: 'pos_6', target: 'pos_7', strength: 0.8, type: 'factures' },
      { source: 'pos_4', target: 'pos_7', strength: 1.0, type: 'all' },
      { source: 'pos_1', target: 'pos_2', strength: 0.5, type: 'cheques' },
      { source: 'pos_2', target: 'pos_6', strength: 0.3, type: 'kimbiales' }
    ]
  };

  const getNodeColor = (node) => {
    switch (colorScheme) {
      case 'status':
        switch (node?.status) {
          case 'active': return '#10B981'; // success
          case 'processing': return '#06B6D4'; // secondary
          case 'issues': return '#EF4444'; // destructive
          case 'inactive': return '#6B7280'; // muted
          default: return '#8B5CF6'; // primary
        }
      case 'type':
        return node?.type === 'pos' ? '#8B5CF6' : '#EC4899'; // primary : accent
      case 'volume':
        const intensity = Math.min(node?.transactions / 1000, 1);
        return `hsl(${240 - intensity * 60}, 70%, ${50 + intensity * 30}%)`;
      case 'performance':
        const perf = node?.performance / 100;
        return `hsl(${perf * 120}, 70%, 50%)`;
      default:
        return '#8B5CF6';
    }
  };

  const initializeScene = () => {
    if (!mountRef?.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F0F23);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera?.position?.set(10, 10, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer?.setSize(mountRef?.current?.clientWidth, mountRef?.current?.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE?.PCFSoftShadowMap;
    mountRef?.current?.appendChild(renderer?.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene?.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight?.position?.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene?.add(directionalLight);

    // Controls (simplified orbit controls)
    const controls = {
      mouseDown: false,
      mouseX: 0,
      mouseY: 0,
      rotationX: 0,
      rotationY: 0
    };
    controlsRef.current = controls;

    // Mouse event handlers
    const handleMouseDown = (event) => {
      controls.mouseDown = true;
      controls.mouseX = event?.clientX;
      controls.mouseY = event?.clientY;
    };

    const handleMouseMove = (event) => {
      if (!controls?.mouseDown) return;
      
      const deltaX = event?.clientX - controls?.mouseX;
      const deltaY = event?.clientY - controls?.mouseY;
      
      controls.rotationY += deltaX * 0.01;
      controls.rotationX += deltaY * 0.01;
      
      controls.mouseX = event?.clientX;
      controls.mouseY = event?.clientY;
    };

    const handleMouseUp = () => {
      controls.mouseDown = false;
    };

    const handleWheel = (event) => {
      camera?.position?.multiplyScalar(event?.deltaY > 0 ? 1.1 : 0.9);
    };

    renderer?.domElement?.addEventListener('mousedown', handleMouseDown);
    renderer?.domElement?.addEventListener('mousemove', handleMouseMove);
    renderer?.domElement?.addEventListener('mouseup', handleMouseUp);
    renderer?.domElement?.addEventListener('wheel', handleWheel);

    // Create nodes and connections
    createNetworkVisualization(scene);

    setIsLoading(false);
  };

  const createNetworkVisualization = (scene) => {
    // Clear existing objects
    while (scene?.children?.length > 2) { // Keep lights
      scene?.remove(scene?.children?.[2]);
    }

    // Create nodes
    networkData?.nodes?.forEach(node => {
      const geometry = new THREE.SphereGeometry(0.5 * nodeSize, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: getNodeColor(node),
        transparent: true,
        opacity: node.status === 'inactive' ? 0.5 : 1.0
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere?.position?.set(...node?.position);
      sphere.userData = node;
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      
      scene?.add(sphere);

      // Add node label
      const canvas = document.createElement('canvas');
      const context = canvas?.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#FFFFFF';
      context.font = '16px Inter';
      context.textAlign = 'center';
      context?.fillText(node?.name, 128, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite?.position?.set(node?.position?.[0], node?.position?.[1] + 1, node?.position?.[2]);
      sprite?.scale?.set(2, 0.5, 1);
      
      scene?.add(sprite);
    });

    // Create connections
    if (showConnections) {
      networkData?.connections?.forEach(connection => {
        const sourceNode = networkData?.nodes?.find(n => n?.id === connection?.source);
        const targetNode = networkData?.nodes?.find(n => n?.id === connection?.target);
        
        if (sourceNode && targetNode) {
          const geometry = new THREE.BufferGeometry()?.setFromPoints([
            new THREE.Vector3(...sourceNode.position),
            new THREE.Vector3(...targetNode.position)
          ]);
          
          const material = new THREE.LineBasicMaterial({ 
            color: connection.type === 'cheques' ? '#10B981' : 
                   connection.type === 'factures' ? '#06B6D4' : 
                   connection.type === 'kimbiales' ? '#EC4899' : '#8B5CF6',
            transparent: true,
            opacity: connection.strength * 0.8
          });
          
          const line = new THREE.Line(geometry, material);
          scene?.add(line);
        }
      });
    }
  };

  const animate = () => {
    if (!sceneRef?.current || !cameraRef?.current || !rendererRef?.current) return;

    const controls = controlsRef?.current;
    if (controls) {
      // Apply rotation
      sceneRef.current.rotation.x = controls?.rotationX;
      sceneRef.current.rotation.y = controls?.rotationY;
      
      // Auto rotation if enabled
      if (isAnimating) {
        sceneRef.current.rotation.y += 0.005;
      }
    }

    rendererRef?.current?.render(sceneRef?.current, cameraRef?.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (!mountRef?.current || !cameraRef?.current || !rendererRef?.current) return;
    
    const width = mountRef?.current?.clientWidth;
    const height = mountRef?.current?.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef?.current?.updateProjectionMatrix();
    rendererRef?.current?.setSize(width, height);
  };

  const takeScreenshot = () => {
    if (!rendererRef?.current) return;
    
    const canvas = rendererRef?.current?.domElement;
    const link = document.createElement('a');
    link.download = `network-visualization-${new Date()?.toISOString()?.split('T')?.[0]}.png`;
    link.href = canvas?.toDataURL();
    link?.click();
    
    onScreenshot();
  };

  useEffect(() => {
    initializeScene();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
      if (mountRef?.current && rendererRef?.current) {
        mountRef?.current?.removeChild(rendererRef?.current?.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef?.current) {
      createNetworkVisualization(sceneRef?.current);
    }
  }, [nodeSize, showConnections, colorScheme, filters]);

  // Expose screenshot function
  useEffect(() => {
    window.takeNetworkScreenshot = takeScreenshot;
    return () => {
      delete window.takeNetworkScreenshot;
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-background">
      {/* 3D Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: '600px' }}
      />
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-foreground font-medium">Initializing 3D Network...</div>
            <div className="text-sm text-muted-foreground">Loading visualization engine</div>
          </div>
        </div>
      )}
      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Mouse" size={14} />
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MousePointer" size={14} />
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Hand" size={14} />
            <span>Click nodes for details</span>
          </div>
        </div>
      </div>
      {/* Performance Info */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
        <div className="text-xs text-muted-foreground">
          Nodes: {networkData?.nodes?.length} | Connections: {networkData?.connections?.length}
        </div>
      </div>
    </div>
  );
};

export default NetworkCanvas;