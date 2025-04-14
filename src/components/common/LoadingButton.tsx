import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function LoadingButton({ 
  loading = false,
  disabled,
  children,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      loading={loading}
      disabled={loading || disabled}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
  },
});