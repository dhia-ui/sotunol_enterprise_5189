import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileUpload, isProcessing, acceptedFormats = ['.png', '.jpg', '.jpeg', '.pdf', '.tiff'] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const extension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
      return acceptedFormats?.includes(extension);
    });

    if (validFiles?.length > 0) {
      const newFiles = validFiles?.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        preview: URL.createObjectURL(file),
        status: 'ready'
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
      onFileUpload(newFiles);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev?.filter(f => f?.id !== fileId);
      const removedFile = prev?.find(f => f?.id === fileId);
      if (removedFile) {
        URL.revokeObjectURL(removedFile?.preview);
      }
      return updated;
    });
  };

  const clearAll = () => {
    uploadedFiles?.forEach(file => URL.revokeObjectURL(file?.preview));
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/30'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats?.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Drop documents here or click to browse
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PNG, JPG, PDF, TIFF formats up to 10MB each
            </p>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              disabled={isProcessing}
              iconName="FolderOpen"
              iconPosition="left"
            >
              Browse Files
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
            {acceptedFormats?.map(format => (
              <span key={format} className="px-2 py-1 bg-muted rounded">
                {format?.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-primary font-medium">Drop files to upload</div>
          </div>
        )}
      </div>
      {/* Uploaded Files List */}
      {uploadedFiles?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">
              Uploaded Files ({uploadedFiles?.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              iconName="Trash2"
              iconPosition="left"
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles?.map((file) => (
              <div
                key={file?.id}
                className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg"
              >
                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={
                      file?.type?.startsWith('image/') ? 'Image' :
                      file?.type === 'application/pdf' ? 'FileText' : 'File'
                    } 
                    size={20} 
                    className="text-muted-foreground" 
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {file?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file?.size)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file?.status === 'processing' && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {file?.status === 'ready' && (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  )}
                  {file?.status === 'error' && (
                    <Icon name="AlertCircle" size={16} className="text-destructive" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file?.id)}
                    className="w-8 h-8 text-muted-foreground hover:text-destructive"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Processing Status */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-primary">Processing documents...</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;