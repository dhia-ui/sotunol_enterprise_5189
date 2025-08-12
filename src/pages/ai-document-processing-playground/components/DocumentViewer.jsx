import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DocumentViewer = ({ 
  selectedDocument, 
  boundingBoxes = [], 
  onBoundingBoxClick, 
  onBoundingBoxUpdate,
  confidenceThreshold = 0.6 
}) => {
  const [scale, setScale] = useState(1);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (selectedDocument && imageRef?.current) {
      // Auto-fit image to container
      const container = containerRef?.current;
      const image = imageRef?.current;
      if (container && image) {
        const containerWidth = container?.clientWidth - 32; // padding
        const containerHeight = container?.clientHeight - 100; // controls height
        const imageWidth = image?.naturalWidth;
        const imageHeight = image?.naturalHeight;
        
        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(newScale);
      }
    }
  }, [selectedDocument]);

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.1));
  const handleResetZoom = () => setScale(1);

  const handleBoxClick = (box) => {
    setSelectedBox(box);
    setEditText(box?.text);
    setIsEditing(true);
    onBoundingBoxClick(box);
  };

  const handleTextSave = () => {
    if (selectedBox && editText !== selectedBox?.text) {
      onBoundingBoxUpdate(selectedBox?.id, { text: editText });
    }
    setIsEditing(false);
    setSelectedBox(null);
  };

  const handleTextCancel = () => {
    setIsEditing(false);
    setSelectedBox(null);
    setEditText('');
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'border-success bg-success/10';
    if (confidence >= 0.6) return 'border-warning bg-warning/10';
    return 'border-destructive bg-destructive/10';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const filteredBoxes = boundingBoxes?.filter(box => box?.confidence >= confidenceThreshold);

  if (!selectedDocument) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Document Selected</h3>
            <p className="text-sm text-muted-foreground">
              Upload a document to start OCR processing
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Viewer Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Icon name="Image" size={20} className="text-primary" />
          <div>
            <div className="font-medium text-foreground text-sm">{selectedDocument?.name}</div>
            <div className="text-xs text-muted-foreground">
              {filteredBoxes?.length} detections found
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="w-8 h-8"
          >
            <Icon name="ZoomOut" size={16} />
          </Button>
          
          <span className="text-sm text-muted-foreground min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="w-8 h-8"
          >
            <Icon name="ZoomIn" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="w-8 h-8"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
        </div>
      </div>
      {/* Document Display */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-background p-4"
      >
        <div className="relative inline-block">
          <Image
            ref={imageRef}
            src={selectedDocument?.preview}
            alt={selectedDocument?.name}
            className="max-w-none"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
          />

          {/* Bounding Boxes Overlay */}
          {filteredBoxes?.map((box) => (
            <div
              key={box?.id}
              className={`absolute border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                getConfidenceColor(box?.confidence)
              } ${selectedBox?.id === box?.id ? 'ring-2 ring-primary' : ''}`}
              style={{
                left: `${box?.x * scale}px`,
                top: `${box?.y * scale}px`,
                width: `${box?.width * scale}px`,
                height: `${box?.height * scale}px`,
                transform: 'translateZ(0)'
              }}
              onClick={() => handleBoxClick(box)}
            >
              {/* Confidence Badge */}
              <div className="absolute -top-6 left-0 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                {getConfidenceLabel(box?.confidence)} ({Math.round(box?.confidence * 100)}%)
              </div>

              {/* Text Preview */}
              <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-background/90 border border-border rounded text-xs max-w-48 truncate">
                {box?.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Text Editing Modal */}
      {isEditing && selectedBox && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Detected Text</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTextCancel}
                className="w-8 h-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Detected Text (Confidence: {Math.round(selectedBox?.confidence * 100)}%)
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e?.target?.value)}
                  className="w-full h-24 p-3 bg-background border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Edit the detected text..."
                />
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleTextSave}
                  variant="default"
                  iconName="Check"
                  iconPosition="left"
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleTextCancel}
                  variant="outline"
                  iconName="X"
                  iconPosition="left"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-success bg-success/10 rounded"></div>
              <span className="text-muted-foreground">High (≥90%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-warning bg-warning/10 rounded"></div>
              <span className="text-muted-foreground">Medium (60-89%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-destructive bg-destructive/10 rounded"></div>
              <span className="text-muted-foreground">Low (&lt;60%)</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Click boxes to edit • Scroll to zoom
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;