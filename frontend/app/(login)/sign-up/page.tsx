import { Suspense } from 'react';
import { Login } from '../login';
import React from 'react';
export default function SignUpPage() {
  return (
    <Suspense>
      <Login mode="signup" />
    </Suspense>
  );
}
