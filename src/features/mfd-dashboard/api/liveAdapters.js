/**
 * Live API adapter scaffold.
 * Replace placeholder implementations with real backend endpoints.
 */

export const liveAdapters = {
  async fetchAmfiAumSnapshot() {
    // TODO: wire backend endpoint that sources AMFI data.
    return {
      source: 'AMFI',
      asOn: null,
      data: [],
    };
  },

  async fetchMarketSnapshot() {
    // TODO: wire backend endpoint for market overview values.
    return {
      source: 'Exchange Aggregator',
      asOn: null,
      data: null,
    };
  },

  async fetchRegistrarSummary() {
    // TODO: wire backend endpoint for CAMS/KFin folio summaries.
    return {
      source: 'Registrar',
      asOn: null,
      data: [],
    };
  },
};

