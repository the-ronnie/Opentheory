import { Suspense } from 'react';
import { Login } from '../login';
import React from 'react';

export default function SignInPage() {
  return (
    <Suspense>
      <Login mode="signin" />
    </Suspense>
  );
}
