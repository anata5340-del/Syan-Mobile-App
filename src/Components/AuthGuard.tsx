import React from 'react';
import { useAuthStore } from '../stores/auth.store';
import { View, ActivityIndicator } from 'react-native';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
