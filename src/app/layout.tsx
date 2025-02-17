'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppWrapper } from '@/context';
import { AuthContextProvider } from '../context/AuthContext';
import { ScenarioProvider } from '../context/ScenarioContext';
import { SessionManager } from '../components/Sessionmanager';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <SessionManager>
            <ScenarioProvider>
              <AppWrapper>
                <div>
                  <main>{children}</main>
                </div>
              </AppWrapper>
            </ScenarioProvider>
          </SessionManager>
        </AuthContextProvider>
      </body>
    </html>
  );
}