import { useState } from "react";
import { X, Copy, Eye, EyeOff } from "lucide-react";

interface ManualInstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
  esim: {
    qrCode: string;
  };
}

export default function ManualInstallationModal({ isOpen, onClose, esim }: ManualInstallationModalProps) {
  const [showActivationCode, setShowActivationCode] = useState(false);

  if (!isOpen) return null;

  // Generate realistic eSIM data based on QR code
  const iccid = `89310847250291${Math.random().toString().slice(2, 7)}`;
  const activationCode = `1$${esim.qrCode.replace('QR_', '').substring(0, 10)}$LPA:1.0.0`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Simple feedback - in production you'd use a toast
    console.log(`${label} copied to clipboard`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded mr-3 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm">📱</span>
              </div>
              Manual Installation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Alternative method if QR code doesn't work
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* ICCID */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ICCID</span>
              <button
                onClick={() => copyToClipboard(iccid, 'ICCID')}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {iccid}
            </div>
          </div>

          {/* SM-DP+ Address & Activation Code */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SM-DP+ Address & Activation Code
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowActivationCode(!showActivationCode)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {showActivationCode ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(activationCode, 'Activation Code')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {showActivationCode ? activationCode : '•'.repeat(20)}
            </div>
          </div>

          {/* APN Settings */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                APN Settings
              </span>
            </div>
            <div className="text-sm text-yellow-800 dark:text-yellow-300">
              Automatic
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}