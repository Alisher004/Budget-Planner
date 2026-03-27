'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userEmail: string | null;
  isPremium: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
}

export default function DashboardLayout({
  children,
  userEmail,
  isPremium,
  isTrialActive,
  trialDaysLeft,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed */}
      <Sidebar
        userEmail={userEmail}
        isPremium={isPremium}
        isTrialActive={isTrialActive}
        trialDaysLeft={trialDaysLeft}
      />

      {/* Main Content - Scrollable, with padding for mobile header */}
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
