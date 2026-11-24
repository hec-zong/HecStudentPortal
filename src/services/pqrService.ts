import type {
  PqrMasterData,
  PqrUniversity,
  PqrProgram,
  PqrDegreeLevel,
  PqrBoard,
} from '@/types/portal';

import pqrDataFixture from '@/mocks/pqr-data.json';
import { isMockMode, getApiBaseUrl } from '@/services/portalService';

async function simulateLatency(ms = 80): Promise<void> {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'test') {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * =============================================================================
 * PQR SERVICE - PAKISTAN QUALIFICATION REGISTER (PQR) DATA SERVICE
 * =============================================================================
 *
 * Provides accredited universities, degree levels, accredited degree programs,
 * and intermediate/secondary educational boards with cascading lookup support.
 */
export const pqrService = {
  /**
   * Fetch all PQR Master Data.
   */
  async getMasterData(): Promise<PqrMasterData> {
    if (isMockMode()) {
      await simulateLatency(100);
      return pqrDataFixture as unknown as PqrMasterData;
    }

    const res = await fetch(`${getApiBaseUrl()}/pqr/master-data`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`PQR Master Data failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch all standardized Degree Levels (Matric, Inter, Bachelor, Master, PhD).
   */
  async getDegreeLevels(): Promise<PqrDegreeLevel[]> {
    if (isMockMode()) {
      await simulateLatency(60);
      return pqrDataFixture.degreeLevels as PqrDegreeLevel[];
    }

    const master = await this.getMasterData();
    return master.degreeLevels;
  },

  /**
   * Fetch accredited universities, with optional name query or province filtering.
   */
  async getUniversities(
    query?: string,
    province?: string
  ): Promise<PqrUniversity[]> {
    if (isMockMode()) {
      await simulateLatency(80);
      let list = pqrDataFixture.universities as PqrUniversity[];
      if (province) {
        list = list.filter(
          (u) => u.province.toLowerCase() === province.toLowerCase()
        );
      }
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.shortName.toLowerCase().includes(q) ||
            u.city.toLowerCase().includes(q)
        );
      }
      return list;
    }

    const searchParams = new URLSearchParams();
    if (query) searchParams.set('search', query);
    if (province) searchParams.set('province', province);

    const res = await fetch(
      `${getApiBaseUrl()}/pqr/universities?${searchParams.toString()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`Universities failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch accredited programs, optionally filtered by universityId and/or degreeLevelId.
   */
  async getPrograms(
    universityId?: string,
    degreeLevelId?: string
  ): Promise<PqrProgram[]> {
    if (isMockMode()) {
      await simulateLatency(80);
      let list = pqrDataFixture.programs as PqrProgram[];
      if (universityId) {
        list = list.filter((p) => p.universityId === universityId);
      }
      if (degreeLevelId) {
        list = list.filter((p) => p.degreeLevelId === degreeLevelId);
      }
      return list;
    }

    const searchParams = new URLSearchParams();
    if (universityId) searchParams.set('universityId', universityId);
    if (degreeLevelId) searchParams.set('degreeLevelId', degreeLevelId);

    const res = await fetch(
      `${getApiBaseUrl()}/pqr/programs?${searchParams.toString()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`Programs failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch intermediate and secondary education boards (BISE / Technical / Cambridge).
   */
  async getBoards(province?: string, type?: string): Promise<PqrBoard[]> {
    if (isMockMode()) {
      await simulateLatency(60);
      let list = pqrDataFixture.boards as PqrBoard[];
      if (province) {
        list = list.filter(
          (b) => b.province.toLowerCase() === province.toLowerCase()
        );
      }
      if (type) {
        list = list.filter((b) => b.type.toLowerCase() === type.toLowerCase());
      }
      return list;
    }

    const searchParams = new URLSearchParams();
    if (province) searchParams.set('province', province);
    if (type) searchParams.set('type', type);

    const res = await fetch(
      `${getApiBaseUrl()}/pqr/boards?${searchParams.toString()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`Boards failed: HTTP ${res.status}`);
    return res.json();
  },
};
