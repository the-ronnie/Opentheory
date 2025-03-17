'use client';

import { UserProvider } from '@/components/auth/UserProvider';
import { Provider } from 'react-redux';
import { store } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UserProvider>{children}</UserProvider>
    </Provider>
  );
}