import React, { useState } from 'react';
import { X, Download, Printer, Shield, CheckCircle } from 'lucide-react';
import { UPNDMember } from '../../types';

interface CardGenerationModalProps {
  selectedMembers: UPNDMember[];
  onClose: () => void;
}

export function CardGenerationModal({ selectedMembers, onClose }: CardGenerationModalProps) {
  const [cardType, setCardType] = useState<'standard' | 'premium' | 'executive'>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate card generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setGenerationComplete(true);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `UPND_Membership_Cards_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  };

  if (generationComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-upnd-black mb-2">Cards Generated Successfully!</h2>
            <p className="text-gray-600 mb-6">
              {selectedMembers.length} UPND membership cards have been generated and are ready for download.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold">Generate UPND Membership Cards</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress - Official Cards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Generation Summary */}
          <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
            <h3 className="font-semibold text-upnd-black mb-2">Generation Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Selected Members:</span>
                <span className="font-semibold text-upnd-black ml-2">{selectedMembers.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Card Type:</span>
                <span className="font-semibold text-upnd-black ml-2 capitalize">{cardType}</span>
              </div>
            </div>
          </div>

          {/* Card Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black">Select Card Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  cardType === 'standard' 
                    ? 'border-upnd-red bg-upnd-red/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCardType('standard')}
              >
                <div className="w-full h-32 bg-gradient-to-br from-upnd-red to-upnd-red-dark rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Shield className="w-8 h-8 mx-auto mb-1" />
                    <div className="text-sm font-bold">STANDARD</div>
                  </div>
                </div>
                <h4 className="font-semibold text-upnd-black">Standard Card</h4>
                <p className="text-sm text-gray-600">Regular UPND members</p>
              </div>

              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  cardType === 'premium' 
                    ? 'border-upnd-yellow bg-upnd-yellow/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCardType('premium')}
              >
                <div className="w-full h-32 bg-gradient-to-br from-upnd-red via-upnd-red-dark to-upnd-yellow rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Shield className="w-8 h-8 mx-auto mb-1" />
                    <div className="text-sm font-bold">PREMIUM</div>
                  </div>
                </div>
                <h4 className="font-semibold text-upnd-black">Premium Card</h4>
                <p className="text-sm text-gray-600">Special recognition</p>
              </div>

              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  cardType === 'executive' 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCardType('executive')}
              >
                <div className="w-full h-32 bg-gradient-to-br from-upnd-red-dark via-red-900 to-yellow-600 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Shield className="w-8 h-8 mx-auto mb-1" />
                    <div className="text-sm font-bold">EXECUTIVE</div>
                  </div>
                </div>
                <h4 className="font-semibold text-upnd-black">Executive Card</h4>
                <p className="text-sm text-gray-600">Leadership positions</p>
              </div>
            </div>
          </div>

          {/* Selected Members Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black">Selected Members ({selectedMembers.length})</h3>
            
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {selectedMembers.map((member, index) => (
                <div key={member.id} className={`p-3 flex items-center justify-between ${
                  index !== selectedMembers.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                  <div>
                    <div className="font-medium text-upnd-black">{member.fullName}</div>
                    <div className="text-sm text-gray-600">ID: {member.membershipId}</div>
                  </div>
                  <div className="text-sm text-gray-500">{member.jurisdiction.province}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Generation Options */}
          <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-4">
            <h4 className="font-semibold text-upnd-black mb-2">Card Features</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• UPND official branding with red and yellow colors</li>
              <li>• Member photo placeholder and personal information</li>
              <li>• QR code for digital verification</li>
              <li>• "Unity, Work, Progress" party motto</li>
              <li>• High-quality print-ready PDF format</li>
              <li>• Security features and anti-counterfeiting measures</li>
            </ul>
          </div>

          {isGenerating && (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-upnd-red"></div>
                <span className="text-lg font-medium text-upnd-black">Generating UPND membership cards...</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isGenerating && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleGenerate}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <Printer className="w-5 h-5" />
              <span>Generate {selectedMembers.length} Cards</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}