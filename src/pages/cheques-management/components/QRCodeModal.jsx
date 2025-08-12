import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QRCodeModal = ({ isOpen, onClose, cheque }) => {
  const [qrSize, setQrSize] = useState(256);
  const canvasRef = useRef(null);

  if (!isOpen || !cheque) return null;

  // Generate QR code data URL (mock implementation)
  const generateQRCode = (data, size) => {
    // In a real implementation, you would use a QR code library like qrcode
    // For now, we'll create a mock QR code pattern
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas?.getContext('2d');
    
    // Create a simple pattern that looks like a QR code
    ctx.fillStyle = '#FFFFFF';
    ctx?.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    const moduleSize = size / 25;
    
    // Create a mock QR pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i + j) % 3 === 0 || (i * j) % 7 === 0) {
          ctx?.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Add corner squares (typical QR code feature)
    const cornerSize = moduleSize * 7;
    ctx?.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx?.fillRect(moduleSize, moduleSize, moduleSize * 5, moduleSize * 5);
    ctx.fillStyle = '#000000';
    ctx?.fillRect(moduleSize * 2, moduleSize * 2, moduleSize * 3, moduleSize * 3);
    
    return canvas?.toDataURL();
  };

  const qrCodeData = `CHQ-${cheque?.chequeNumber}-${cheque?.partnerCode}-${cheque?.amount}`;
  const qrCodeUrl = generateQRCode(qrCodeData, qrSize);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `cheque-qr-${cheque?.chequeNumber}.png`;
    link.href = qrCodeUrl;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document?.write(`
      <html>
        <head>
          <title>QR Code - Cheque ${cheque?.chequeNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              margin: 20px auto; 
              display: inline-block; 
            }
            .cheque-info { 
              margin-top: 20px; 
              font-size: 14px; 
            }
          </style>
        </head>
        <body>
          <h2>Cheque QR Code</h2>
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" />
          </div>
          <div class="cheque-info">
            <p><strong>Cheque Number:</strong> ${cheque?.chequeNumber}</p>
            <p><strong>Partner:</strong> ${cheque?.partnerName}</p>
            <p><strong>Amount:</strong> ${new Intl.NumberFormat('en-TN', {
              style: 'currency',
              currency: 'TND',
              minimumFractionDigits: 3
            })?.format(cheque?.amount)}</p>
            <p><strong>Generated:</strong> ${new Date()?.toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow?.document?.close();
    printWindow?.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-synthwave-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Generate QR Code</h2>
            <p className="text-sm text-muted-foreground">
              Cheque #{cheque?.chequeNumber}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Cheque Information */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Partner:</span>
                <span className="font-medium text-foreground">{cheque?.partnerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium text-foreground">
                  {new Intl.NumberFormat('en-TN', {
                    style: 'currency',
                    currency: 'TND',
                    minimumFractionDigits: 3
                  })?.format(cheque?.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date:</span>
                <span className="font-medium text-foreground">
                  {new Date(cheque.issueDate)?.toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="mx-auto"
                style={{ width: qrSize, height: qrSize }}
              />
            </div>
            
            {/* Size Controls */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                QR Code Size: {qrSize}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>128px</span>
                <span>320px</span>
                <span>512px</span>
              </div>
            </div>
          </div>

          {/* QR Data Info */}
          <div className="bg-muted/30 rounded-lg p-3 mb-6">
            <p className="text-xs text-muted-foreground mb-1">QR Code Data:</p>
            <code className="text-xs font-mono text-foreground break-all">
              {qrCodeData}
            </code>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              iconName="Printer"
              iconPosition="left"
              className="flex-1"
            >
              Print
            </Button>
            <Button
              variant="default"
              onClick={handleDownload}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              Download PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;