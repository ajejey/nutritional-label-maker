'use client'

import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveIndicatorProps {
  status: SaveStatus;
  className?: string;
  showText?: boolean;
}

export function SaveIndicator({ status, className, showText = true }: SaveIndicatorProps) {
  const [visible, setVisible] = useState(true);
  
  // Auto-hide the indicator after 3 seconds when saved
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (status === 'saved') {
      timeout = setTimeout(() => {
        setVisible(false);
      }, 3000);
    } else {
      setVisible(true);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [status]);
  
  if (!visible && status === 'saved') return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm transition-opacity duration-300",
        status === 'idle' && "text-gray-400",
        status === 'saving' && "text-blue-500",
        status === 'saved' && "text-green-500",
        status === 'error' && "text-red-500",
        className
      )}
    >
      {status === 'idle' && <Save className="h-4 w-4" />}
      {status === 'saving' && (
        <div className="animate-spin">
          <Save className="h-4 w-4" />
        </div>
      )}
      {status === 'saved' && <Check className="h-4 w-4" />}
      {status === 'error' && <AlertCircle className="h-4 w-4" />}
      
      {showText && (
        <span>
          {status === 'idle' && "All changes saved"}
          {status === 'saving' && "Saving..."}
          {status === 'saved' && "Saved!"}
          {status === 'error' && "Failed to save"}
        </span>
      )}
    </div>
  );
}
