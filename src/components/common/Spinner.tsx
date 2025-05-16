import React from 'react';
import { Spinner as RadixSpinner, SpinnerProps } from '@radix-ui/themes';

// Extend the RadixSpinner component to match the required API
export function Spinner(props: SpinnerProps & { loading?: boolean, my?: string | number }) {
  const { loading = true, my, ...restProps } = props;
  
  // Only render spinner if loading is true
  if (!loading) return null;
  
  // Apply margin top/bottom if provided
  const style = my ? { marginTop: my, marginBottom: my } : undefined;
  
  return <RadixSpinner style={style} {...restProps} />;
}
