import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CryptoAlert } from '../types';

interface AlertListProps {
  alerts: CryptoAlert[];
  onDelete: (id: string) => void;
}

export function AlertList({ alerts, onDelete }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">No alerts set. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {alert.condition === 'above' ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{alert.symbol}</h3>
                  <p className="text-sm text-gray-500">
                    Alert when price goes {alert.condition}{' '}
                    ${alert.targetPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDelete(alert.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}