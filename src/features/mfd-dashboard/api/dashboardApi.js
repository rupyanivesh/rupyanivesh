import {
  activityLogs,
  clients,
  kpiCards,
  moduleTabs,
  notifications,
  reportCatalog,
  reportRows,
  transactForms,
  transactionLog,
  bulkUploadErrors,
  aumMasterViews,
  aumMasterRows,
  brokerageRows,
  goals,
  campaignTemplates,
  campaignDeliveries,
  watchlist,
  marketOverview,
  importJobs,
  notificationPreferences,
  dashboardWidgets,
  speedDialActions,
  scheduledReports,
} from '../data/mockData';

const wait = (ms = 350) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const SIMULATE_RANDOM_FAILURE = false;

const withRandomFailure = async (payload, failRate = 0.05) => {
  await wait();
  if (SIMULATE_RANDOM_FAILURE && Math.random() < failRate) {
    throw new Error('Temporary server issue. Please retry.');
  }
  return payload;
};

export const dashboardApi = {
  async getModules() {
    return withRandomFailure(moduleTabs);
  },

  async getKpis() {
    return withRandomFailure(kpiCards);
  },

  async getClients(filters = {}) {
    const { risk = 'All', kyc = 'All', query = '' } = filters;
    const q = query.trim().toLowerCase();
    const filtered = clients.filter((client) => {
      const riskOk = risk === 'All' || client.risk === risk;
      const kycOk = kyc === 'All' || client.kyc === kyc;
      const queryOk =
        !q ||
        client.name.toLowerCase().includes(q) ||
        client.pan.toLowerCase().includes(q) ||
        client.city.toLowerCase().includes(q);
      return riskOk && kycOk && queryOk;
    });
    return withRandomFailure(filtered, 0.03);
  },

  async getNotifications() {
    return withRandomFailure(notifications);
  },

  async getActivityLogs() {
    return withRandomFailure(activityLogs);
  },

  async getReportCatalog() {
    return withRandomFailure(reportCatalog, 0.02);
  },

  async getReportData(reportId, filters = {}) {
    const rows = reportRows[reportId] || [];
    const query = (filters.query || '').trim().toLowerCase();

    const filtered = rows.filter((row) => {
      if (!query) return true;
      return Object.values(row).some((v) =>
        String(v).toLowerCase().includes(query),
      );
    });

    return withRandomFailure(filtered, 0.04);
  },

  async getTransactForms() {
    return withRandomFailure(transactForms, 0.02);
  },

  async getTransactionLog(filters = {}) {
    const query = (filters.query || '').trim().toLowerCase();
    const type = filters.type || 'All';
    const status = filters.status || 'All';

    const filtered = transactionLog.filter((row) => {
      const qOk =
        !query ||
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(query),
        );
      const tOk = type === 'All' || row.type === type;
      const sOk = status === 'All' || row.status === status;
      return qOk && tOk && sOk;
    });
    return withRandomFailure(filtered, 0.03);
  },

  async validateBulkOrderUpload() {
    return withRandomFailure(bulkUploadErrors, 0.02);
  },

  async getAumMasterViews() {
    return withRandomFailure(aumMasterViews, 0.02);
  },

  async getAumMasterData(viewId, filters = {}) {
    const rows = aumMasterRows[viewId] || [];
    const query = (filters.query || '').trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (!query) return true;
      return Object.values(row).some((v) =>
        String(v).toLowerCase().includes(query),
      );
    });
    return withRandomFailure(filtered, 0.03);
  },

  async getBrokerageGrowth() {
    return withRandomFailure(brokerageRows.growth, 0.03);
  },

  async getBrokeragePayout() {
    return withRandomFailure(brokerageRows.payout, 0.03);
  },

  async getGoals(filters = {}) {
    const status = filters.status || 'All';
    const query = (filters.query || '').trim().toLowerCase();
    const filtered = goals.filter((g) => {
      const sOk = status === 'All' || g.status === status;
      const qOk =
        !query ||
        g.clientName.toLowerCase().includes(query) ||
        g.goalName.toLowerCase().includes(query);
      return sOk && qOk;
    });
    return withRandomFailure(filtered, 0.03);
  },

  async getCampaignTemplates() {
    return withRandomFailure(campaignTemplates, 0.02);
  },

  async getCampaignDeliveries() {
    return withRandomFailure(campaignDeliveries, 0.03);
  },

  async getWatchlist(filters = {}) {
    const query = (filters.query || '').trim().toLowerCase();
    const filtered = watchlist.filter((row) => {
      if (!query) return true;
      return (
        row.scheme.toLowerCase().includes(query) ||
        row.amc.toLowerCase().includes(query)
      );
    });
    return withRandomFailure(filtered, 0.03);
  },

  async getMarketOverview() {
    return withRandomFailure(marketOverview, 0.02);
  },

  async getImportJobs() {
    return withRandomFailure(importJobs, 0.03);
  },

  async getNotificationPreferences() {
    return withRandomFailure(notificationPreferences, 0.02);
  },

  async getDashboardWidgets() {
    return withRandomFailure(dashboardWidgets, 0.02);
  },

  async getSpeedDialActions() {
    return withRandomFailure(speedDialActions, 0.02);
  },

  async getScheduledReports() {
    return withRandomFailure(scheduledReports, 0.03);
  },
};
