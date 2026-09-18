import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';
import { TodayDashboard } from './components/screens/TodayDashboard';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { MealsScreen } from './components/screens/MealsScreen';
import { HabitsScreen } from './components/screens/HabitsScreen';
import { NotesScreen } from './components/screens/NotesScreen';
import { WaterTrackerModal } from './components/modals/WaterTrackerModal';
import { DailySummaryModal } from './components/modals/DailySummaryModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

const DayFlowContent: React.FC = () => {
  const {
    activeTab,
    userProfile,
  } = useApp();

  return (
    <>
      {/* Onboarding Flow for first-time or reset user */}
      {!userProfile.hasCompletedOnboarding && <OnboardingFlow />}

      {/* Main Mobile App Shell */}
      <MobileShell>
        {activeTab === 'today' && <TodayDashboard />}
        {activeTab === 'schedule' && <ScheduleScreen />}
        {activeTab === 'meals' && <MealsScreen />}
        {activeTab === 'habits' && <HabitsScreen />}
        {activeTab === 'notes' && <NotesScreen />}
      </MobileShell>

      {/* Global Modals */}
      <WaterTrackerModal />
      <DailySummaryModal />
      <SettingsModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DayFlowContent />
    </AppProvider>
  );
}
