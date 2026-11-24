import { create } from 'zustand';
import type { StudentBootstrapData } from '@/types/portal';
import { portalService } from '@/services/portalService';

export type AuthStatus = 'logged_out' | 'first_time' | 'returning';
export type ModalType = 'login' | 'track_lookup' | 'share_proof' | null;

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Session & Demo Mode State
  authStatus: AuthStatus;
  studentData: StudentBootstrapData | null;
  isLoadingBootstrap: boolean;
  activeModal: ModalType;
  journeyAgreementAccepted: boolean;

  // Actions
  setAuthStatus: (status: AuthStatus) => Promise<void>;
  loadStudentBootstrap: (
    forceType?: 'returning' | 'first_time'
  ) => Promise<void>;
  setActiveModal: (modal: ModalType) => void;
  setJourneyAgreementAccepted: (accepted: boolean) => void;
  loginAsFirstTime: () => Promise<void>;
  loginAsReturning: () => Promise<void>;
  logout: () => void;
  getSmartRoute: () => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Default to returning student for rich demo development, but easily toggled
  authStatus: 'returning',
  studentData: null,
  isLoadingBootstrap: false,
  activeModal: null,
  journeyAgreementAccepted: false,

  setAuthStatus: async (status: AuthStatus) => {
    set({ authStatus: status });
    if (status === 'logged_out') {
      set({ studentData: null });
    } else {
      await get().loadStudentBootstrap(
        status === 'first_time' ? 'first_time' : 'returning'
      );
    }
  },

  loadStudentBootstrap: async (forceType?: 'returning' | 'first_time') => {
    set({ isLoadingBootstrap: true });
    try {
      const type =
        forceType ||
        (get().authStatus === 'first_time' ? 'first_time' : 'returning');
      const data = await portalService.getStudentBootstrap(type);
      set({ studentData: data, isLoadingBootstrap: false });
    } catch (err) {
      console.error('Failed to load student bootstrap data:', err);
      set({ isLoadingBootstrap: false });
    }
  },

  setActiveModal: (modal: ModalType) => set({ activeModal: modal }),

  setJourneyAgreementAccepted: (accepted: boolean) =>
    set({ journeyAgreementAccepted: accepted }),

  loginAsFirstTime: async () => {
    set({ authStatus: 'first_time', activeModal: null });
    await get().loadStudentBootstrap('first_time');
  },

  loginAsReturning: async () => {
    set({ authStatus: 'returning', activeModal: null });
    await get().loadStudentBootstrap('returning');
  },

  logout: () => {
    set({
      authStatus: 'logged_out',
      studentData: null,
      activeModal: null,
    });
  },

  /**
   * Smart routing logic:
   * - First-Time Student (no prior submitted applications) -> /apply
   * - Returning Student (with existing applications) -> /dashboard
   * - Logged out -> /?action=login
   */
  getSmartRoute: () => {
    const { authStatus, studentData } = get();
    if (authStatus === 'logged_out') {
      return '/?login=true';
    }
    if (
      authStatus === 'first_time' ||
      (studentData && !studentData.hasSubmittedApplication)
    ) {
      return '/apply';
    }
    return '/dashboard';
  },
}));
