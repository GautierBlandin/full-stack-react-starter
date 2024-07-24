'use client'

import { TodoLoader } from '@react-starter/todo';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  return (
    <QueryClientProvider client={queryClient}>
      <TodoLoader />
    </QueryClientProvider>
  );
}
