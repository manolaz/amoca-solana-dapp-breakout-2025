import React from 'react';
import { Spinner as RadixSpinner } from '@radix-ui/themes';

// Simple wrapper around Radix UI spinner with consistent props
interface SpinnerProps {
  loading?: boolean;
  my?: string | number;
  size?: "1" | "2" | "3";
}

export function Spinner({ loading = true, my, size = "2" }: SpinnerProps) {
  if (!loading) return null;
  
  return (
    <RadixSpinner loading style={{ margin: my ? `${my}rem 0` : undefined }} size={size} />
  );
}
