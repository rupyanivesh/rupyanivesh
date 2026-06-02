import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  Building2,
  ChevronRight,
  DollarSign,
  Gauge,
  LayoutGrid,
  LogOut,
  PieChart,
  Shield,
  Users,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import { authStorage } from '../utils/authStorage';
import { formatINR, formatNumber, formatPercent } from '../utils/formatters';
import { EmptyState, ErrorState, LoadingState } from '../components/AsyncState';
import DataGridTable from '../components/DataGridTable';
import useSessionTimeout from '../utils/useSessionTimeout';
import { validateGoalForm, validateOrderForm } from '../utils/validators';

const tabTitleMap = {
  Home: 'Home Dashboard',
  CRM: 'Client Management',
  'Mutual Fund': 'Mutual Fund Analytics',
  Reports: 'Reports and Outputs',
  Transact: 'Transact Online',
  Brokerage: 'Brokerage Suite',
  Goals: 'Goal GPS and Campaigns',
  Research: 'Research and Watchlist',
  Utilities: 'Utilities and Calculators',
  Settings: 'Profile and Settings',
  Import: 'Import Wizard',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const [modules, setModules] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [clients, setClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reportCatalog, setReportCatalog] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [selectedReport, setSelectedReport] = useState('wealth');
  const [reportQuery, setReportQuery] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [transactForms, setTransactForms] = useState([]);
  const [txnRows, setTxnRows] = useState([]);
  const [txnLoading, setTxnLoading] = useState(false);
  const [txnError, setTxnError] = useState('');
  const [txnQuery, setTxnQuery] = useState('');
  const [txnType, setTxnType] = useState('All');
  const [txnStatus, setTxnStatus] = useState('All');
  const [bulkErrors, setBulkErrors] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('redemption');
  const [orderForm, setOrderForm] = useState({
    client: '',
    folio: '',
    scheme: '',
    amount: '',
    mode: 'Amount',
  });
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [aumViews, setAumViews] = useState([]);
  const [aumViewId, setAumViewId] = useState('fundHouse');
  const [aumQuery, setAumQuery] = useState('');
  const [aumRows, setAumRows] = useState([]);
  const [aumLoading, setAumLoading] = useState(false);
  const [aumError, setAumError] = useState('');
  const [brokerageGrowthRows, setBrokerageGrowthRows] = useState([]);
  const [brokeragePayoutRows, setBrokeragePayoutRows] = useState([]);
  const [brokerageLoading, setBrokerageLoading] = useState(false);
  const [brokerageError, setBrokerageError] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [goalRows, setGoalRows] = useState([]);
  const [goalStatus, setGoalStatus] = useState('All');
  const [goalQuery, setGoalQuery] = useState('');
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState('');
  const [goalForm, setGoalForm] = useState({
    clientName: '',
    goalName: '',
    category: 'Education',
    targetAmount: '',
    years: '',
  });
  const [goalFormMsg, setGoalFormMsg] = useState('');
  const [templateRows, setTemplateRows] = useState([]);
  const [deliveryRows, setDeliveryRows] = useState([]);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [campaignAudience, setCampaignAudience] = useState('All Clients');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [watchlistRows, setWatchlistRows] = useState([]);
  const [watchlistQuery, setWatchlistQuery] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState('');
  const [importRows, setImportRows] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [notifTab, setNotifTab] = useState('All');
  const [notifPrefs, setNotifPrefs] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [prefSaveMsg, setPrefSaveMsg] = useState('');
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionCountdown, setSessionCountdown] = useState(120);
  const [widgets, setWidgets] = useState([]);
  const [widgetEditMode, setWidgetEditMode] = useState(false);
  const [widgetSaveMsg, setWidgetSaveMsg] = useState('');
  const [speedActions, setSpeedActions] = useState([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('All');
  const [scheduledRows, setScheduledRows] = useState([]);
  const [scheduleForm, setScheduleForm] = useState({
    reportType: 'Portfolio Statement',
    frequency: 'Monthly',
    sendTo: 'All Clients',
  });
  const [scheduleMsg, setScheduleMsg] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeModule, setActiveModule] = useState('Home');
  const [riskFilter, setRiskFilter] = useState('All');
  const [kycFilter, setKycFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [moduleRes, kpiRes, clientRes, notifRes, activityRes] = await Promise.all([
        dashboardApi.getModules(),
        dashboardApi.getKpis(),
        dashboardApi.getClients({ risk: riskFilter, kyc: kycFilter, query }),
        dashboardApi.getNotifications(),
        dashboardApi.getActivityLogs(),
      ]);
      const [catalogRes, wealthRes] = await Promise.all([
        dashboardApi.getReportCatalog(),
        dashboardApi.getReportData('wealth'),
      ]);
      const [formRes, txnRes] = await Promise.all([
        dashboardApi.getTransactForms(),
        dashboardApi.getTransactionLog(),
      ]);
      const [aumViewRes, aumDataRes, bGrowthRes, bPayoutRes] = await Promise.all([
        dashboardApi.getAumMasterViews(),
        dashboardApi.getAumMasterData('fundHouse'),
        dashboardApi.getBrokerageGrowth(),
        dashboardApi.getBrokeragePayout(),
      ]);
      const [goalRes, tplRes, deliveryRes, watchRes, marketRes, importRes] =
        await Promise.all([
          dashboardApi.getGoals(),
          dashboardApi.getCampaignTemplates(),
          dashboardApi.getCampaignDeliveries(),
          dashboardApi.getWatchlist(),
          dashboardApi.getMarketOverview(),
          dashboardApi.getImportJobs(),
        ]);
      const prefRes = await dashboardApi.getNotificationPreferences();
      const [widgetRes, speedRes, scheduleRes] = await Promise.all([
        dashboardApi.getDashboardWidgets(),
        dashboardApi.getSpeedDialActions(),
        dashboardApi.getScheduledReports(),
      ]);
      setModules(moduleRes);
      setKpis(kpiRes);
      setClients(clientRes);
      setNotifications(notifRes);
      setActivities(activityRes);
      setReportCatalog(catalogRes);
      setReportData(wealthRes);
      setTransactForms(formRes);
      setTxnRows(txnRes);
      setAumViews(aumViewRes);
      setAumRows(aumDataRes);
      setBrokerageGrowthRows(bGrowthRes);
      setBrokeragePayoutRows(bPayoutRes);
      setGoalRows(goalRes);
      setTemplateRows(tplRes);
      setDeliveryRows(deliveryRes);
      setWatchlistRows(watchRes);
      setMarketData(marketRes);
      setImportRows(importRes);
      setNotifPrefs(prefRes);
      setWidgets(widgetRes);
      setSpeedActions(speedRes);
      setScheduledRows(scheduleRes);
      if (tplRes.length > 0) {
        setSelectedTemplateId(tplRes[0].id);
      }
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const data = await dashboardApi.getClients({
          risk: riskFilter,
          kyc: kycFilter,
          query,
        });
        setClients(data);
        setSelectedClients([]);
      } catch (err) {
        setError(err.message || 'Unable to refresh client list.');
      }
    }, 240);

    return () => clearTimeout(t);
  }, [riskFilter, kycFilter, query]);

  useEffect(() => {
    const loadReportData = async () => {
      setReportLoading(true);
      setReportError('');
      try {
        const rows = await dashboardApi.getReportData(selectedReport, {
          query: reportQuery,
        });
        setReportData(rows);
      } catch (err) {
        setReportError(err.message || 'Unable to load report output.');
      } finally {
        setReportLoading(false);
      }
    };

    if (activeModule === 'Reports') {
      loadReportData();
    }
  }, [activeModule, selectedReport, reportQuery]);

  useEffect(() => {
    const loadTransactions = async () => {
      setTxnLoading(true);
      setTxnError('');
      try {
        const rows = await dashboardApi.getTransactionLog({
          query: txnQuery,
          type: txnType,
          status: txnStatus,
        });
        setTxnRows(rows);
      } catch (err) {
        setTxnError(err.message || 'Unable to load transaction log.');
      } finally {
        setTxnLoading(false);
      }
    };

    if (activeModule === 'Transact') {
      loadTransactions();
    }
  }, [activeModule, txnQuery, txnType, txnStatus]);

  useEffect(() => {
    const loadAumData = async () => {
      setAumLoading(true);
      setAumError('');
      try {
        const rows = await dashboardApi.getAumMasterData(aumViewId, {
          query: aumQuery,
        });
        setAumRows(rows);
      } catch (err) {
        setAumError(err.message || 'Unable to load AUM master data.');
      } finally {
        setAumLoading(false);
      }
    };

    if (activeModule === 'Mutual Fund') {
      loadAumData();
    }
  }, [activeModule, aumViewId, aumQuery]);

  useEffect(() => {
    const loadBrokerageData = async () => {
      setBrokerageLoading(true);
      setBrokerageError('');
      try {
        const [growth, payout] = await Promise.all([
          dashboardApi.getBrokerageGrowth(),
          dashboardApi.getBrokeragePayout(),
        ]);
        setBrokerageGrowthRows(growth);
        setBrokeragePayoutRows(payout);
      } catch (err) {
        setBrokerageError(err.message || 'Unable to load brokerage data.');
      } finally {
        setBrokerageLoading(false);
      }
    };

    if (activeModule === 'Brokerage') {
      loadBrokerageData();
    }
  }, [activeModule, selectedTemplateId]);

  useEffect(() => {
    const loadGoals = async () => {
      setGoalLoading(true);
      setGoalError('');
      try {
        const rows = await dashboardApi.getGoals({
          status: goalStatus,
          query: goalQuery,
        });
        setGoalRows(rows);
      } catch (err) {
        setGoalError(err.message || 'Unable to load goals.');
      } finally {
        setGoalLoading(false);
      }
    };

    if (activeModule === 'Goals') {
      loadGoals();
    }
  }, [activeModule, goalStatus, goalQuery]);

  useEffect(() => {
    const loadCampaigns = async () => {
      setCampaignLoading(true);
      setCampaignError('');
      try {
        const [tpl, deliveries] = await Promise.all([
          dashboardApi.getCampaignTemplates(),
          dashboardApi.getCampaignDeliveries(),
        ]);
        setTemplateRows(tpl);
        setDeliveryRows(deliveries);
        if (!selectedTemplateId && tpl.length > 0) {
          setSelectedTemplateId(tpl[0].id);
        }
      } catch (err) {
        setCampaignError(err.message || 'Unable to load campaign data.');
      } finally {
        setCampaignLoading(false);
      }
    };

    if (activeModule === 'Goals') {
      loadCampaigns();
    }
  }, [activeModule, selectedTemplateId]);

  useEffect(() => {
    const loadResearch = async () => {
      setResearchLoading(true);
      setResearchError('');
      try {
        const [watch, market] = await Promise.all([
          dashboardApi.getWatchlist({ query: watchlistQuery }),
          dashboardApi.getMarketOverview(),
        ]);
        setWatchlistRows(watch);
        setMarketData(market);
      } catch (err) {
        setResearchError(err.message || 'Unable to load research data.');
      } finally {
        setResearchLoading(false);
      }
    };

    if (activeModule === 'Research') {
      loadResearch();
    }
  }, [activeModule, watchlistQuery]);

  useEffect(() => {
    const loadImports = async () => {
      setImportLoading(true);
      setImportError('');
      try {
        const rows = await dashboardApi.getImportJobs();
        setImportRows(rows);
      } catch (err) {
        setImportError(err.message || 'Unable to load import jobs.');
      } finally {
        setImportLoading(false);
      }
    };

    if (activeModule === 'Import') {
      loadImports();
    }
  }, [activeModule]);

  useEffect(() => {
    const loadNotificationPrefs = async () => {
      setNotifLoading(true);
      setNotifError('');
      try {
        const prefs = await dashboardApi.getNotificationPreferences();
        setNotifPrefs(prefs);
      } catch (err) {
        setNotifError(err.message || 'Unable to load notification preferences.');
      } finally {
        setNotifLoading(false);
      }
    };

    if (activeModule === 'Notifications') {
      loadNotificationPrefs();
    }
  }, [activeModule]);

  const handleSessionWarning = useCallback(() => {
    setShowSessionWarning(true);
  }, []);

  const handleSessionTick = useCallback((remaining) => {
    setSessionCountdown(remaining);
  }, []);

  const handleSessionTimeout = useCallback(() => {
    authStorage.clearSession();
    navigate('/mfd/login', { replace: true });
  }, [navigate]);

  useSessionTimeout({
    idleMs: 8 * 60 * 1000,
    countdownSeconds: 120,
    onWarning: handleSessionWarning,
    onTick: handleSessionTick,
    onTimeout: handleSessionTimeout,
  });

  const submitOrder = (e) => {
    e.preventDefault();
    setOrderError('');
    setOrderSuccess('');
    const err = validateOrderForm(orderForm);
    if (err) {
      setOrderError(err);
      return;
    }
    setOrderSuccess(
      `Order submitted for ${orderForm.client} - ${orderForm.scheme} (${formatINR(
        Number(orderForm.amount),
      )}).`,
    );
  };

  const runBulkValidation = async () => {
    setTxnError('');
    try {
      const errors = await dashboardApi.validateBulkOrderUpload();
      setBulkErrors(errors);
    } catch (err) {
      setTxnError(err.message || 'Unable to validate bulk upload.');
    }
  };

  const submitGoalForm = (e) => {
    e.preventDefault();
    const err = validateGoalForm(goalForm);
    if (err) {
      setGoalFormMsg(err);
      return;
    }
    setGoalFormMsg(
      `Goal created for ${goalForm.clientName}: ${goalForm.goalName} (${formatINR(
        Number(goalForm.targetAmount),
      )})`,
    );
  };

  const launchCampaign = () => {
    if (!selectedTemplateId) {
      setCampaignMessage('Please select a template.');
      return;
    }
    setCampaignMessage(
      `Campaign queued: ${selectedTemplateId} to ${campaignAudience}.`,
    );
  };

  const stayLoggedIn = () => {
    setShowSessionWarning(false);
    setSessionCountdown(120);
  };

  const saveNotificationPrefs = () => {
    setPrefSaveMsg('Notification preferences saved successfully.');
    setTimeout(() => setPrefSaveMsg(''), 2200);
  };

  const filteredNotifications = useMemo(() => {
    if (notifTab === 'All') return notifications;
    if (notifTab === 'Unread') return notifications.filter((n) => n.unread);
    return notifications.filter((n) =>
      n.type.toLowerCase().includes(notifTab.toLowerCase()),
    );
  }, [notifications, notifTab]);

  const filteredActivities = useMemo(() => {
    if (activityFilter === 'All') return activities;
    return activities.filter((a) =>
      a.action.toLowerCase().includes(activityFilter.toLowerCase()),
    );
  }, [activities, activityFilter]);

  const saveWidgetConfig = () => {
    setWidgetSaveMsg('Dashboard widget configuration saved.');
    setWidgetEditMode(false);
    setTimeout(() => setWidgetSaveMsg(''), 2000);
  };

  const addScheduledReport = (e) => {
    e.preventDefault();
    const nextId = `SR-${1000 + scheduledRows.length + 1}`;
    const nextRun = '2026-05-02 08:00';
    setScheduledRows((prev) => [
      {
        id: nextId,
        reportType: scheduleForm.reportType,
        frequency: scheduleForm.frequency,
        sendTo: scheduleForm.sendTo,
        nextRun,
        status: 'Active',
      },
      ...prev,
    ]);
    setScheduleMsg(`Scheduled ${scheduleForm.reportType} (${scheduleForm.frequency})`);
    setTimeout(() => setScheduleMsg(''), 2200);
  };

  const renderAumTable = () => {
    if (aumLoading) return <LoadingState label="Loading AUM view..." />;
    if (aumError) return <ErrorState message={aumError} />;
    if (!aumRows.length) return <EmptyState title="No AUM rows" detail="Try changing view/query filters." />;

    const tableWrap = (headers, body) => (
      <table className="min-w-full text-xs">
        <thead className="bg-navy-900 text-white">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    );

    if (aumViewId === 'fundHouse') {
      return tableWrap(
        ['AMC', 'Clients', 'Folios', 'Invested', 'Current Value', 'Gain/Loss', 'XIRR', '% Total AUM'],
        aumRows.map((r) => (
          <tr key={r.amcName} className="border-b border-navy-900/10">
            <td className="px-3 py-2 font-semibold">{r.amcName}</td>
            <td className="px-3 py-2">{formatNumber(r.clientCount)}</td>
            <td className="px-3 py-2">{formatNumber(r.folioCount)}</td>
            <td className="px-3 py-2">{formatINR(r.investedAmount)}</td>
            <td className="px-3 py-2">{formatINR(r.currentValue)}</td>
            <td className="px-3 py-2">{formatINR(r.gainLoss)}</td>
            <td className="px-3 py-2">{formatPercent(r.xirr)}</td>
            <td className="px-3 py-2">{formatPercent(r.shareOfAum)}</td>
          </tr>
        )),
      );
    }

    if (aumViewId === 'schemes') {
      return tableWrap(
        ['Scheme', 'AMC', 'Clients', 'Folios', 'Invested', 'Current Value', 'XIRR'],
        aumRows.map((r) => (
          <tr key={`${r.schemeName}-${r.amc}`} className="border-b border-navy-900/10">
            <td className="px-3 py-2 font-semibold">{r.schemeName}</td>
            <td className="px-3 py-2">{r.amc}</td>
            <td className="px-3 py-2">{formatNumber(r.clientCount)}</td>
            <td className="px-3 py-2">{formatNumber(r.folioCount)}</td>
            <td className="px-3 py-2">{formatINR(r.investedAmount)}</td>
            <td className="px-3 py-2">{formatINR(r.currentValue)}</td>
            <td className="px-3 py-2">{formatPercent(r.xirr)}</td>
          </tr>
        )),
      );
    }

    if (aumViewId === 'clients') {
      return tableWrap(
        ['Rank', 'Client', 'PAN', 'Folios', 'Invested', 'Current Value', 'Gain/Loss', 'XIRR', 'SIP/Month'],
        aumRows.map((r) => (
          <tr key={`${r.rank}-${r.pan}`} className="border-b border-navy-900/10">
            <td className="px-3 py-2">{r.rank}</td>
            <td className="px-3 py-2 font-semibold">{r.clientName}</td>
            <td className="px-3 py-2">{r.pan}</td>
            <td className="px-3 py-2">{formatNumber(r.folioCount)}</td>
            <td className="px-3 py-2">{formatINR(r.investedAmount)}</td>
            <td className="px-3 py-2">{formatINR(r.currentValue)}</td>
            <td className="px-3 py-2">{formatINR(r.gainLoss)}</td>
            <td className="px-3 py-2">{formatPercent(r.xirr)}</td>
            <td className="px-3 py-2">{formatINR(r.sipBook)}</td>
          </tr>
        )),
      );
    }

    if (aumViewId === 'assetAllocation') {
      return tableWrap(
        ['Asset Type', 'Clients', 'Invested', 'Current Value', 'Gain/Loss', 'XIRR', 'Allocation %'],
        aumRows.map((r) => (
          <tr key={r.assetType} className="border-b border-navy-900/10">
            <td className="px-3 py-2 font-semibold">{r.assetType}</td>
            <td className="px-3 py-2">{formatNumber(r.clientCount)}</td>
            <td className="px-3 py-2">{formatINR(r.investedAmount)}</td>
            <td className="px-3 py-2">{formatINR(r.currentValue)}</td>
            <td className="px-3 py-2">{formatINR(r.gainLoss)}</td>
            <td className="px-3 py-2">{formatPercent(r.xirr)}</td>
            <td className="px-3 py-2">{formatPercent(r.allocationPct)}</td>
          </tr>
        )),
      );
    }

    if (aumViewId === 'families') {
      return tableWrap(
        ['Family', 'Members', 'Folios', 'Invested', 'Current Value', 'SIP Book', 'XIRR'],
        aumRows.map((r) => (
          <tr key={r.familyName} className="border-b border-navy-900/10">
            <td className="px-3 py-2 font-semibold">{r.familyName}</td>
            <td className="px-3 py-2">{formatNumber(r.members)}</td>
            <td className="px-3 py-2">{formatNumber(r.folioCount)}</td>
            <td className="px-3 py-2">{formatINR(r.investedAmount)}</td>
            <td className="px-3 py-2">{formatINR(r.currentValue)}</td>
            <td className="px-3 py-2">{formatINR(r.combinedSipBook)}</td>
            <td className="px-3 py-2">{formatPercent(r.xirr)}</td>
          </tr>
        )),
      );
    }

    return tableWrap(
      ['Registrar', 'Clients', 'Folios', 'Invested', 'Current Value', 'Gain/Loss', 'XIRR'],
      aumRows.map((r) => (
        <tr key={r.registrar} className="border-b border-navy-900/10">
          <td className="px-3 py-2 font-semibold">{r.registrar}</td>
          <td className="px-3 py-2">{formatNumber(r.clientCount)}</td>
          <td className="px-3 py-2">{formatNumber(r.folioCount)}</td>
          <td className="px-3 py-2">{formatINR(r.investedAmount)}</td>
          <td className="px-3 py-2">{formatINR(r.currentValue)}</td>
          <td className="px-3 py-2">{formatINR(r.gainLoss)}</td>
          <td className="px-3 py-2">{formatPercent(r.xirr)}</td>
        </tr>
      )),
    );
  };

  const reportSummary = useMemo(() => {
    if (!reportData.length) return null;

    if (selectedReport === 'wealth') {
      const totalInvested = reportData.reduce((acc, r) => acc + r.invested, 0);
      const totalValue = reportData.reduce((acc, r) => acc + r.currentValue, 0);
      const totalGain = reportData.reduce((acc, r) => acc + r.gainLoss, 0);
      return [
        { label: 'Total Invested', value: formatINR(totalInvested) },
        { label: 'Current Value', value: formatINR(totalValue) },
        { label: 'Total Gain/Loss', value: formatINR(totalGain) },
      ];
    }

    if (selectedReport === 'aumGrowth') {
      const latest = reportData[reportData.length - 1];
      return [
        { label: 'Opening AUM', value: formatINR(latest.openingAum) },
        { label: 'Closing AUM', value: formatINR(latest.closingAum) },
        { label: 'Growth %', value: formatPercent(latest.growthPct) },
      ];
    }

    if (selectedReport === 'mis') {
      const latest = reportData[0];
      return [
        { label: 'SIP Count', value: formatNumber(latest.sipCount) },
        { label: 'SIP Amount', value: formatINR(latest.sipAmount) },
        { label: 'New Clients', value: formatNumber(latest.newClients) },
      ];
    }

    if (selectedReport === 'xirrBetweenDates') {
      const avgXirr =
        reportData.reduce((acc, r) => acc + r.xirr, 0) / reportData.length;
      const avgAlpha =
        reportData.reduce((acc, r) => acc + r.alpha, 0) / reportData.length;
      return [
        { label: 'Average XIRR', value: formatPercent(avgXirr) },
        { label: 'Average Alpha', value: formatPercent(avgAlpha) },
        { label: 'Rows', value: formatNumber(reportData.length) },
      ];
    }

    if (selectedReport === 'realisedXirr') {
      const invested = reportData.reduce((acc, r) => acc + r.invested, 0);
      const redeemed = reportData.reduce((acc, r) => acc + r.redeemed, 0);
      const gain = reportData.reduce((acc, r) => acc + r.gainLoss, 0);
      return [
        { label: 'Total Invested', value: formatINR(invested) },
        { label: 'Total Redeemed', value: formatINR(redeemed) },
        { label: 'Total Gain', value: formatINR(gain) },
      ];
    }

    if (selectedReport === 'folioMaster') {
      const aum = reportData.reduce((acc, r) => acc + r.value, 0);
      return [
        { label: 'Total Folios', value: formatNumber(reportData.length) },
        { label: 'Tracked Value', value: formatINR(aum) },
        { label: 'Avg Value/Folio', value: formatINR(aum / reportData.length) },
      ];
    }

    return null;
  }, [reportData, selectedReport]);

  const renderReportTable = () => {
    if (reportLoading) return <LoadingState label="Loading report output..." />;
    if (reportError) return <ErrorState message={reportError} />;
    if (!reportData.length) {
      return (
        <EmptyState
          title="No report data"
          detail="No rows matched current filters. Try a broader query."
        />
      );
    }

    const th = (arr) => (
      <thead className="bg-navy-900 text-white">
        <tr>
          {arr.map((h) => (
            <th key={h} className="px-3 py-3 text-left text-xs uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
    );

    if (selectedReport === 'wealth') {
      return (
        <table className="min-w-full text-sm">
          {th([
            'Client',
            'PAN',
            'Folio',
            'Invested',
            'Current Value',
            'Gain/Loss',
            'XIRR',
            'Benchmark XIRR',
          ])}
          <tbody>
            {reportData.map((r) => (
              <tr key={`${r.clientName}-${r.folio}`} className="border-b border-navy-900/10">
                <td className="px-3 py-3 font-semibold">{r.clientName}</td>
                <td className="px-3 py-3">{r.pan}</td>
                <td className="px-3 py-3">{r.folio}</td>
                <td className="px-3 py-3">{formatINR(r.invested)}</td>
                <td className="px-3 py-3">{formatINR(r.currentValue)}</td>
                <td className="px-3 py-3">{formatINR(r.gainLoss)}</td>
                <td className="px-3 py-3">{formatPercent(r.xirr)}</td>
                <td className="px-3 py-3">{formatPercent(r.benchmarkXirr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === 'aumGrowth') {
      return (
        <table className="min-w-full text-sm">
          {th(['Period', 'Opening AUM', 'Closing AUM', 'Growth Amount', 'Growth %'])}
          <tbody>
            {reportData.map((r) => (
              <tr key={r.period} className="border-b border-navy-900/10">
                <td className="px-3 py-3 font-semibold">{r.period}</td>
                <td className="px-3 py-3">{formatINR(r.openingAum)}</td>
                <td className="px-3 py-3">{formatINR(r.closingAum)}</td>
                <td className="px-3 py-3">{formatINR(r.growthAmount)}</td>
                <td className="px-3 py-3">{formatPercent(r.growthPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === 'mis') {
      return (
        <table className="min-w-full text-sm">
          {th([
            'Month',
            'Opening AUM',
            'Inflow',
            'Outflow',
            'Net Flow',
            'Closing AUM',
            'SIP Count',
            'SIP Amount',
            'New Clients',
          ])}
          <tbody>
            {reportData.map((r) => (
              <tr key={r.month} className="border-b border-navy-900/10">
                <td className="px-3 py-3 font-semibold">{r.month}</td>
                <td className="px-3 py-3">{formatINR(r.openingAum)}</td>
                <td className="px-3 py-3">{formatINR(r.inflow)}</td>
                <td className="px-3 py-3">{formatINR(r.outflow)}</td>
                <td className="px-3 py-3">{formatINR(r.netFlow)}</td>
                <td className="px-3 py-3">{formatINR(r.closingAum)}</td>
                <td className="px-3 py-3">{formatNumber(r.sipCount)}</td>
                <td className="px-3 py-3">{formatINR(r.sipAmount)}</td>
                <td className="px-3 py-3">{formatNumber(r.newClients)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === 'xirrBetweenDates') {
      return (
        <table className="min-w-full text-sm">
          {th([
            'Client',
            'Folio',
            'Start Value',
            'End Value',
            'XIRR',
            'Benchmark XIRR',
            'Alpha',
          ])}
          <tbody>
            {reportData.map((r) => (
              <tr key={`${r.clientName}-${r.folio}`} className="border-b border-navy-900/10">
                <td className="px-3 py-3 font-semibold">{r.clientName}</td>
                <td className="px-3 py-3">{r.folio}</td>
                <td className="px-3 py-3">{formatINR(r.startValue)}</td>
                <td className="px-3 py-3">{formatINR(r.endValue)}</td>
                <td className="px-3 py-3">{formatPercent(r.xirr)}</td>
                <td className="px-3 py-3">{formatPercent(r.benchmarkXirr)}</td>
                <td className="px-3 py-3">{formatPercent(r.alpha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === 'realisedXirr') {
      return (
        <table className="min-w-full text-sm">
          {th([
            'Client',
            'Scheme',
            'Folio',
            'Investment Date',
            'Redemption Date',
            'Invested',
            'Redeemed',
            'Gain/Loss',
            'XIRR',
          ])}
          <tbody>
            {reportData.map((r) => (
              <tr key={`${r.clientName}-${r.folio}-${r.scheme}`} className="border-b border-navy-900/10">
                <td className="px-3 py-3 font-semibold">{r.clientName}</td>
                <td className="px-3 py-3">{r.scheme}</td>
                <td className="px-3 py-3">{r.folio}</td>
                <td className="px-3 py-3">{r.investDate}</td>
                <td className="px-3 py-3">{r.redeemDate}</td>
                <td className="px-3 py-3">{formatINR(r.invested)}</td>
                <td className="px-3 py-3">{formatINR(r.redeemed)}</td>
                <td className="px-3 py-3">{formatINR(r.gainLoss)}</td>
                <td className="px-3 py-3">{formatPercent(r.xirr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="min-w-full text-sm">
        {th([
          'Client',
          'PAN',
          'Folio',
          'AMC',
          'Registrar',
          'Current Value',
          'XIRR',
          'Created On',
        ])}
        <tbody>
          {reportData.map((r) => (
            <tr key={`${r.clientName}-${r.folio}`} className="border-b border-navy-900/10">
              <td className="px-3 py-3 font-semibold">{r.clientName}</td>
              <td className="px-3 py-3">{r.pan}</td>
              <td className="px-3 py-3">{r.folio}</td>
              <td className="px-3 py-3">{r.amc}</td>
              <td className="px-3 py-3">{r.registrar}</td>
              <td className="px-3 py-3">{formatINR(r.value)}</td>
              <td className="px-3 py-3">{formatPercent(r.xirr)}</td>
              <td className="px-3 py-3">{r.createdOn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const allSelected = useMemo(
    () => clients.length > 0 && selectedClients.length === clients.length,
    [clients, selectedClients],
  );

  const handleLogout = () => {
    authStorage.clearSession();
    navigate('/mfd/login', { replace: true });
  };

  const toggleSelect = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  if (loading) {
    return (
      <section className="pt-28 pb-16 bg-[#FAF9F6] min-h-screen">
        <div className="container-custom">
          <LoadingState label="Building your MFD dashboard..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-28 pb-16 bg-[#FAF9F6] min-h-screen">
        <div className="container-custom">
          <ErrorState message={error} onRetry={loadDashboard} />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-16 bg-[#FAF9F6] min-h-screen">
      <div className="container-custom space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-7 text-white shadow-[0_30px_90px_rgba(11,19,43,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                MFD Command Center
              </p>
              <h1 className="mt-1 text-3xl md:text-4xl font-serif font-bold">
                Welcome, {user?.name || 'Advisor'}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Dynamic dashboard aligned with MFD Dashboard docs (Sections 1-43).
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white/20"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div
                key={k.id}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
              >
                <p className="text-xs text-white/75">{k.label}</p>
                <p className="mt-1 text-xl font-black">
                  {k.id === 'clients' ? formatNumber(k.value) : formatINR(k.value)}
                </p>
                <p className="text-xs text-emerald-300">
                  {formatPercent(k.changePct)} vs last period
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-navy-900/10 bg-white p-3">
          <div className="flex flex-wrap gap-2">
            {modules.map((module) => (
              <button
                key={module}
                onClick={() => setActiveModule(module)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  activeModule === module
                    ? 'bg-navy-900 text-white'
                    : 'border border-navy-900/10 text-navy-900 hover:border-gold hover:text-gold'
                }`}
              >
                {module}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <div
            key={activeModule}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-navy-900/60">
                <LayoutGrid size={15} />
                <span>Module</span>
                <ChevronRight size={14} />
                <span className="font-semibold text-navy-900">
                  {tabTitleMap[activeModule] || activeModule}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy-900/60">
                This module is wired to dynamic data and reusable UI states. Detailed
                screens from DOC sections are being progressively expanded in this
                architecture.
              </p>
            </div>

            {activeModule === 'Home' && (
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5 lg:col-span-2">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                    <PieChart size={18} className="text-gold" />
                    Home Widgets
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {widgets
                      .filter((w) => w.enabled)
                      .map((w) => (
                      <div
                        key={w.id}
                        className="rounded-xl border border-navy-900/10 bg-[#FAF9F6] p-4"
                      >
                        <p className="text-sm font-semibold text-navy-900">{w.label}</p>
                        <p className="mt-1 text-xs text-navy-900/60">
                          Dynamic widget placeholder wired for chart/table integration.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-900/70">
                      <Bell size={15} className="text-gold" />
                      Notifications
                    </h4>
                    <div className="mt-3 space-y-2">
                      {notifications.length === 0 ? (
                        <EmptyState
                          title="No notifications"
                          detail="New alerts will appear here."
                        />
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="rounded-xl border border-navy-900/10 p-3 text-xs"
                          >
                            <p className="font-semibold text-navy-900">{n.type}</p>
                            <p className="mt-1 text-navy-900/60">{n.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-900/70">
                      <Activity size={15} className="text-gold" />
                      Activity Log
                    </h4>
                    <select
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    >
                      <option>All</option>
                      <option>Generated</option>
                      <option>Added</option>
                      <option>Login</option>
                    </select>
                    <div className="mt-3 space-y-2">
                      {filteredActivities.map((a) => (
                        <div
                          key={a.id}
                          className="rounded-xl border border-navy-900/10 p-3 text-xs"
                        >
                          <p className="font-semibold text-navy-900">{a.action}</p>
                          <p className="mt-1 text-navy-900/60">
                            {a.module} - {a.at}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'CRM' && (
              <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                  <Users size={18} className="text-gold" />
                  Client List with Filters and Bulk Actions
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, PAN or city"
                    className="rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                  />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                  >
                    <option>All</option>
                    <option>Conservative</option>
                    <option>Moderate</option>
                    <option>Aggressive</option>
                    <option>Very Aggressive</option>
                  </select>
                  <select
                    value={kycFilter}
                    onChange={(e) => setKycFilter(e.target.value)}
                    className="rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                  >
                    <option>All</option>
                    <option>Verified</option>
                    <option>Pending</option>
                    <option>Expired</option>
                    <option>Not Started</option>
                  </select>
                  <button
                    onClick={() => setSelectedClients([])}
                    className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Clear Selection
                  </button>
                </div>

                {selectedClients.length > 0 ? (
                  <div className="mt-3 rounded-xl border border-gold/30 bg-gold/10 p-3 text-xs">
                    {selectedClients.length} clients selected - Bulk Actions:
                    Send WhatsApp, Send Email, Export, Assign Tag, Change RM
                  </div>
                ) : null}

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-navy-900 text-white">
                      <tr>
                        <th className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() =>
                              setSelectedClients(
                                allSelected ? [] : clients.map((c) => c.id),
                              )
                            }
                          />
                        </th>
                        {[
                          'Client',
                          'PAN',
                          'City',
                          'AUM',
                          'XIRR',
                          'Risk',
                          'KYC',
                          'Tag',
                        ].map((h) => (
                          <th key={h} className="px-3 py-3 text-left">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-4">
                            <EmptyState
                              title="No clients found"
                              detail="Try changing filter criteria."
                            />
                          </td>
                        </tr>
                      ) : (
                        clients.map((c) => (
                          <tr key={c.id} className="border-b border-navy-900/10">
                            <td className="px-3 py-3">
                              <input
                                type="checkbox"
                                checked={selectedClients.includes(c.id)}
                                onChange={() => toggleSelect(c.id)}
                              />
                            </td>
                            <td className="px-3 py-3 font-semibold text-navy-900">{c.name}</td>
                            <td className="px-3 py-3">{c.pan}</td>
                            <td className="px-3 py-3">{c.city}</td>
                            <td className="px-3 py-3">{formatINR(c.aum)}</td>
                            <td className="px-3 py-3">{formatPercent(c.xirr)}</td>
                            <td className="px-3 py-3">{c.risk}</td>
                            <td className="px-3 py-3">{c.kyc}</td>
                            <td className="px-3 py-3">{c.tag}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeModule === 'Reports' && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                    <Building2 size={18} className="text-gold" />
                    Reports Workspace
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                        Report
                      </label>
                      <select
                        value={selectedReport}
                        onChange={(e) => setSelectedReport(e.target.value)}
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      >
                        {reportCatalog.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                        As On Date
                      </label>
                      <input
                        type="date"
                        defaultValue="2026-04-29"
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                        View Period
                      </label>
                      <select className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm">
                        <option>Current Month</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last 1 Year</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                        Search
                      </label>
                      <input
                        value={reportQuery}
                        onChange={(e) => setReportQuery(e.target.value)}
                        placeholder="Client, PAN, Folio..."
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {reportSummary ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {reportSummary.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-navy-900/10 bg-white p-4"
                      >
                        <p className="text-xs uppercase tracking-wider text-navy-900/50">
                          {s.label}
                        </p>
                        <p className="mt-1 text-xl font-black text-navy-900">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900/70">
                      Report Output
                    </h4>
                    <div className="text-xs text-navy-900/50">
                      Export: Web / Excel / PDF / WhatsApp
                    </div>
                  </div>
                  <div className="overflow-x-auto">{renderReportTable()}</div>
                </div>
              </div>
            )}

            {activeModule === 'Utilities' && (
              <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                  <Gauge size={18} className="text-gold" />
                  Utilities and Quick Actions
                </h3>
                <p className="mt-2 text-sm text-navy-900/70">
                  Speed dial menu with 6 quick actions from the specification.
                </p>
                <div className="mt-3 relative">
                  <button
                    onClick={() => setSpeedDialOpen((p) => !p)}
                    className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    {speedDialOpen ? 'Close Speed Dial' : 'Open Speed Dial'}
                  </button>
                  {speedDialOpen ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {speedActions.map((a) => (
                        <button
                          key={a.id}
                          className="rounded-xl border border-navy-900/15 bg-[#FAF9F6] px-3 py-2 text-left text-xs font-semibold text-navy-900/80"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {activeModule === 'Settings' && (
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Widget Configuration
                  </h3>
                  <p className="mt-2 text-sm text-navy-900/70">
                    Customize visible dashboard widgets.
                  </p>
                  <button
                    onClick={() => setWidgetEditMode((p) => !p)}
                    className="mt-3 rounded-xl border border-navy-900/15 px-4 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    {widgetEditMode ? 'Cancel Edit' : 'Edit Dashboard'}
                  </button>
                  <div className="mt-3 space-y-2">
                    {widgets.map((w) => (
                      <label
                        key={w.id}
                        className="flex items-center justify-between rounded-xl border border-navy-900/10 px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-navy-900">{w.label}</span>
                        <input
                          type="checkbox"
                          disabled={!widgetEditMode}
                          checked={w.enabled}
                          onChange={(e) =>
                            setWidgets((prev) =>
                              prev.map((x) =>
                                x.id === w.id
                                  ? { ...x, enabled: e.target.checked }
                                  : x,
                              ),
                            )
                          }
                        />
                      </label>
                    ))}
                  </div>
                  {widgetEditMode ? (
                    <button
                      onClick={saveWidgetConfig}
                      className="mt-3 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy-900"
                    >
                      Save Widget Layout
                    </button>
                  ) : null}
                  {widgetSaveMsg ? (
                    <p className="mt-2 text-xs text-emerald-700">{widgetSaveMsg}</p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Scheduled Reports
                  </h3>
                  <form onSubmit={addScheduledReport} className="mt-3 grid gap-2 md:grid-cols-3">
                    <select
                      value={scheduleForm.reportType}
                      onChange={(e) =>
                        setScheduleForm((p) => ({ ...p, reportType: e.target.value }))
                      }
                      className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    >
                      <option>Portfolio Statement</option>
                      <option>SIP Report</option>
                      <option>P&L Report</option>
                      <option>MIS Report</option>
                    </select>
                    <select
                      value={scheduleForm.frequency}
                      onChange={(e) =>
                        setScheduleForm((p) => ({ ...p, frequency: e.target.value }))
                      }
                      className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                    </select>
                    <select
                      value={scheduleForm.sendTo}
                      onChange={(e) =>
                        setScheduleForm((p) => ({ ...p, sendTo: e.target.value }))
                      }
                      className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    >
                      <option>All Clients</option>
                      <option>Selected Tags</option>
                      <option>Specific Clients</option>
                    </select>
                    <button className="md:col-span-3 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                      Add Schedule
                    </button>
                  </form>
                  {scheduleMsg ? (
                    <p className="mt-2 text-xs text-emerald-700">{scheduleMsg}</p>
                  ) : null}
                  <div className="mt-3">
                    <DataGridTable
                      compact
                      headers={['ID', 'Report Type', 'Frequency', 'Send To', 'Next Run', 'Status']}
                      rows={scheduledRows.map((r) => (
                        <tr key={r.id} className="border-b border-navy-900/10">
                          <td className="px-3 py-2 font-semibold">{r.id}</td>
                          <td className="px-3 py-2">{r.reportType}</td>
                          <td className="px-3 py-2">{r.frequency}</td>
                          <td className="px-3 py-2">{r.sendTo}</td>
                          <td className="px-3 py-2">{r.nextRun}</td>
                          <td className="px-3 py-2">{r.status}</td>
                        </tr>
                      ))}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'Goals' && (
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Goal GPS
                  </h3>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    <input
                      value={goalQuery}
                      onChange={(e) => setGoalQuery(e.target.value)}
                      placeholder="Search goal/client..."
                      className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    />
                    <select
                      value={goalStatus}
                      onChange={(e) => setGoalStatus(e.target.value)}
                      className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    >
                      <option>All</option>
                      <option>On Track</option>
                      <option>Behind</option>
                      <option>Ahead</option>
                      <option>Achieved</option>
                    </select>
                    <div className="rounded-xl border border-navy-900/10 bg-[#FAF9F6] px-3 py-2 text-xs text-navy-900/60">
                      Total Goals: {formatNumber(goalRows.length)}
                    </div>
                  </div>
                  <div className="mt-3 overflow-x-auto">
                    {goalLoading ? (
                      <LoadingState label="Loading goals..." />
                    ) : goalError ? (
                      <ErrorState message={goalError} />
                    ) : goalRows.length === 0 ? (
                      <EmptyState title="No goals found" detail="Try changing status/query filters." />
                    ) : (
                      <table className="min-w-full text-xs">
                        <thead className="bg-navy-900 text-white">
                          <tr>
                            {[
                              'Client',
                              'Goal',
                              'Target',
                              'Current',
                              'Progress %',
                              'Required SIP',
                              'Actual SIP',
                              'Status',
                              'Years Left',
                            ].map((h) => (
                              <th key={h} className="px-3 py-2 text-left">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {goalRows.map((g) => (
                            <tr key={g.id} className="border-b border-navy-900/10">
                              <td className="px-3 py-2 font-semibold">{g.clientName}</td>
                              <td className="px-3 py-2">{g.goalName}</td>
                              <td className="px-3 py-2">{formatINR(g.targetAmount)}</td>
                              <td className="px-3 py-2">{formatINR(g.currentValue)}</td>
                              <td className="px-3 py-2">{formatPercent(g.progressPct, 0)}</td>
                              <td className="px-3 py-2">{formatINR(g.requiredSip)}</td>
                              <td className="px-3 py-2">{formatINR(g.actualSip)}</td>
                              <td className="px-3 py-2">{g.status}</td>
                              <td className="px-3 py-2">{g.yearsRemaining}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                    <h3 className="text-base font-serif font-bold text-navy-900">
                      Create Goal
                    </h3>
                    <form onSubmit={submitGoalForm} className="mt-3 space-y-2">
                      <input
                        value={goalForm.clientName}
                        onChange={(e) =>
                          setGoalForm((p) => ({ ...p, clientName: e.target.value }))
                        }
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                        placeholder="Client Name"
                      />
                      <input
                        value={goalForm.goalName}
                        onChange={(e) =>
                          setGoalForm((p) => ({ ...p, goalName: e.target.value }))
                        }
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                        placeholder="Goal Name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={goalForm.category}
                          onChange={(e) =>
                            setGoalForm((p) => ({ ...p, category: e.target.value }))
                          }
                          className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                        >
                          <option>Education</option>
                          <option>Retirement</option>
                          <option>Home</option>
                          <option>Travel</option>
                          <option>Wealth</option>
                        </select>
                        <input
                          value={goalForm.years}
                          onChange={(e) =>
                            setGoalForm((p) => ({ ...p, years: e.target.value }))
                          }
                          className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                          placeholder="Years to Goal"
                        />
                      </div>
                      <input
                        value={goalForm.targetAmount}
                        onChange={(e) =>
                          setGoalForm((p) => ({
                            ...p,
                            targetAmount: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                        placeholder="Target Amount"
                      />
                      <button className="w-full rounded-xl bg-gold py-2 text-xs font-bold uppercase tracking-wider text-navy-900">
                        Save Goal
                      </button>
                      {goalFormMsg ? (
                        <p className="text-xs text-navy-900/70">{goalFormMsg}</p>
                      ) : null}
                    </form>
                  </div>

                  <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                    <h3 className="text-base font-serif font-bold text-navy-900">
                      Campaign Center
                    </h3>
                    {campaignLoading ? (
                      <LoadingState label="Loading campaign resources..." />
                    ) : campaignError ? (
                      <ErrorState message={campaignError} />
                    ) : (
                      <>
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          <select
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                            className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                          >
                            {templateRows.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={campaignAudience}
                            onChange={(e) => setCampaignAudience(e.target.value)}
                            className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                          >
                            <option>All Clients</option>
                            <option>Selected Clients</option>
                            <option>By Tag</option>
                            <option>By Filter</option>
                          </select>
                        </div>
                        <button
                          onClick={launchCampaign}
                          className="mt-2 rounded-xl border border-navy-900/15 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold"
                        >
                          Queue Campaign
                        </button>
                        {campaignMessage ? (
                          <p className="mt-2 text-xs text-navy-900/70">
                            {campaignMessage}
                          </p>
                        ) : null}
                        <div className="mt-3 overflow-x-auto">
                          <table className="min-w-full text-xs">
                            <thead className="bg-navy-900 text-white">
                              <tr>
                                {[
                                  'Campaign',
                                  'Delivered',
                                  'Failed',
                                  'Channel',
                                  'Delivered At',
                                ].map((h) => (
                                  <th key={h} className="px-3 py-2 text-left">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {deliveryRows.map((r) => (
                                <tr key={r.id} className="border-b border-navy-900/10">
                                  <td className="px-3 py-2 font-semibold">{r.campaignName}</td>
                                  <td className="px-3 py-2">{formatNumber(r.delivered)}</td>
                                  <td className="px-3 py-2">{formatNumber(r.failed)}</td>
                                  <td className="px-3 py-2">{r.channel}</td>
                                  <td className="px-3 py-2">{r.deliveredAt}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'Research' && (
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Watchlist
                  </h3>
                  <input
                    value={watchlistQuery}
                    onChange={(e) => setWatchlistQuery(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                    placeholder="Search scheme or AMC..."
                  />
                  <div className="mt-3 overflow-x-auto">
                    {researchLoading ? (
                      <LoadingState label="Loading watchlist..." />
                    ) : researchError ? (
                      <ErrorState message={researchError} />
                    ) : watchlistRows.length === 0 ? (
                      <EmptyState title="No watchlist rows" detail="Try changing search text." />
                    ) : (
                      <table className="min-w-full text-xs">
                        <thead className="bg-navy-900 text-white">
                          <tr>
                            {[
                              'Scheme',
                              'AMC',
                              'NAV',
                              '1D %',
                              '1M %',
                              '1Y %',
                              '3Y CAGR %',
                              'AUM (Cr)',
                            ].map((h) => (
                              <th key={h} className="px-3 py-2 text-left">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {watchlistRows.map((w) => (
                            <tr key={w.id} className="border-b border-navy-900/10">
                              <td className="px-3 py-2 font-semibold">{w.scheme}</td>
                              <td className="px-3 py-2">{w.amc}</td>
                              <td className="px-3 py-2">{w.nav}</td>
                              <td className="px-3 py-2">{formatPercent(w.dayChange)}</td>
                              <td className="px-3 py-2">{formatPercent(w.return1m)}</td>
                              <td className="px-3 py-2">{formatPercent(w.return1y)}</td>
                              <td className="px-3 py-2">{formatPercent(w.cagr3y)}</td>
                              <td className="px-3 py-2">{formatNumber(w.aumCr)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Market Overview
                  </h3>
                  {researchLoading && !marketData ? (
                    <LoadingState label="Loading market snapshot..." />
                  ) : researchError && !marketData ? (
                    <ErrorState message={researchError} />
                  ) : (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {marketData
                        ? [
                            ['Nifty 50', marketData.nifty50.value, marketData.nifty50.changePct],
                            ['Sensex', marketData.sensex.value, marketData.sensex.changePct],
                            ['Nifty Midcap', marketData.niftyMidcap.value, marketData.niftyMidcap.changePct],
                            ['India VIX', marketData.vix.value, marketData.vix.changePct],
                          ].map(([name, value, change]) => (
                            <div
                              key={name}
                              className="rounded-xl border border-navy-900/10 bg-[#FAF9F6] p-4"
                            >
                              <p className="text-xs uppercase tracking-wider text-navy-900/50">
                                {name}
                              </p>
                              <p className="mt-1 text-lg font-black text-navy-900">
                                {formatNumber(value)}
                              </p>
                              <p className="text-xs text-navy-900/70">
                                Change: {formatPercent(change)}
                              </p>
                            </div>
                          ))
                        : null}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeModule === 'Import' && (
              <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                <h3 className="text-lg font-serif font-bold text-navy-900">
                  Import Wizard
                </h3>
                <div className="mt-3 grid gap-2 md:grid-cols-4">
                  {[
                    'Import Clients from Excel',
                    'Import Transactions',
                    'Import SIPs',
                    'Import CAS for All Clients',
                  ].map((action) => (
                    <button
                      key={action}
                      className="rounded-xl border border-navy-900/15 bg-[#FAF9F6] px-3 py-2 text-xs font-semibold text-navy-900/80"
                    >
                      {action}
                    </button>
                  ))}
                </div>
                <div className="mt-4 overflow-x-auto">
                  {importLoading ? (
                    <LoadingState label="Loading import jobs..." />
                  ) : importError ? (
                    <ErrorState message={importError} />
                  ) : importRows.length === 0 ? (
                    <EmptyState title="No import jobs" detail="Recent import jobs will appear here." />
                  ) : (
                    <table className="min-w-full text-xs">
                      <thead className="bg-navy-900 text-white">
                        <tr>
                          {[
                            'Job ID',
                            'Type',
                            'Status',
                            'Records',
                            'Success',
                            'Failed',
                            'Created At',
                          ].map((h) => (
                            <th key={h} className="px-3 py-2 text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importRows.map((r) => (
                          <tr key={r.id} className="border-b border-navy-900/10">
                            <td className="px-3 py-2 font-semibold">{r.id}</td>
                            <td className="px-3 py-2">{r.type}</td>
                            <td className="px-3 py-2">{r.status}</td>
                            <td className="px-3 py-2">{formatNumber(r.records)}</td>
                            <td className="px-3 py-2">{formatNumber(r.success)}</td>
                            <td className="px-3 py-2">{formatNumber(r.failed)}</td>
                            <td className="px-3 py-2">{r.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeModule === 'Mutual Fund' && (
              <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                  <Building2 size={18} className="text-gold" />
                  AUM Master (All 6 Subviews)
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                      Sub View
                    </label>
                    <select
                      value={aumViewId}
                      onChange={(e) => setAumViewId(e.target.value)}
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                    >
                      {aumViews.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                      As On Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-04-29"
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                      Search
                    </label>
                    <input
                      value={aumQuery}
                      onChange={(e) => setAumQuery(e.target.value)}
                      placeholder="AMC, scheme, client, registrar..."
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4 overflow-x-auto">{renderAumTable()}</div>
              </div>
            )}

            {activeModule === 'Brokerage' && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Brokerage Growth Report
                  </h3>
                  {brokerageLoading ? (
                    <LoadingState label="Loading brokerage growth..." />
                  ) : brokerageError ? (
                    <ErrorState message={brokerageError} />
                  ) : (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-navy-900 text-white">
                          <tr>
                            {[
                              'Month',
                              'Accrued',
                              'Payout',
                              'Net',
                              'AUM (Cr)',
                              'Ratio %',
                            ].map((h) => (
                              <th key={h} className="px-3 py-2 text-left">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {brokerageGrowthRows.map((r) => (
                            <tr key={r.month} className="border-b border-navy-900/10">
                              <td className="px-3 py-2 font-semibold">{r.month}</td>
                              <td className="px-3 py-2">{formatINR(r.brokerageAccrued)}</td>
                              <td className="px-3 py-2">
                                {r.payoutReceived ? formatINR(r.payoutReceived) : 'Pending'}
                              </td>
                              <td className="px-3 py-2">
                                {r.netBrokerage ? formatINR(r.netBrokerage) : 'Pending'}
                              </td>
                              <td className="px-3 py-2">{r.aumCr}</td>
                              <td className="px-3 py-2">{formatPercent(r.ratioPct, 2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Payout Report
                  </h3>
                  {brokerageLoading ? (
                    <LoadingState label="Loading payout report..." />
                  ) : brokerageError ? (
                    <ErrorState message={brokerageError} />
                  ) : (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-navy-900 text-white">
                          <tr>
                            {[
                              'Date',
                              'AMC',
                              'Scheme',
                              'AUM',
                              'Rate %',
                              'Accrued',
                              'TDS',
                              'Payout',
                            ].map((h) => (
                              <th key={h} className="px-3 py-2 text-left">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {brokeragePayoutRows.map((r) => (
                            <tr key={`${r.payoutDate}-${r.scheme}`} className="border-b border-navy-900/10">
                              <td className="px-3 py-2">{r.payoutDate}</td>
                              <td className="px-3 py-2 font-semibold">{r.amcName}</td>
                              <td className="px-3 py-2">{r.scheme}</td>
                              <td className="px-3 py-2">{formatINR(r.aum)}</td>
                              <td className="px-3 py-2">{formatPercent(r.brokerageRate, 2)}</td>
                              <td className="px-3 py-2">{formatINR(r.brokerageAccrued)}</td>
                              <td className="px-3 py-2">{formatINR(r.tds)}</td>
                              <td className="px-3 py-2">{formatINR(r.payoutAmount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                      Delete Brokerage (Protected Action)
                    </p>
                    <p className="mt-2 text-xs text-red-700/90">
                      Type <strong>CONFIRM</strong> to enable deletion workflow.
                    </p>
                    <input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-red-200 px-3 py-2 text-sm"
                      placeholder="Type CONFIRM"
                    />
                    <button
                      onClick={() => {
                        if (deleteConfirmText !== 'CONFIRM') {
                          setDeleteMessage(
                            'Confirmation text mismatch. Deletion blocked.',
                          );
                          return;
                        }
                        setDeleteMessage(
                          'Deletion request staged. Final approval required (simulated).',
                        );
                      }}
                      className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
                    >
                      Delete Brokerage Entries
                    </button>
                    {deleteMessage ? (
                      <p className="mt-2 text-xs text-red-700">{deleteMessage}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'Transact' && (
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                    <Activity size={18} className="text-gold" />
                    Transaction Forms
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                        Transaction Form
                      </label>
                      <select
                        value={selectedFormId}
                        onChange={(e) => setSelectedFormId(e.target.value)}
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      >
                        {transactForms.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900/60 mb-1">
                        Order Mode
                      </label>
                      <select
                        value={orderForm.mode}
                        onChange={(e) =>
                          setOrderForm((p) => ({ ...p, mode: e.target.value }))
                        }
                        className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      >
                        <option>Amount</option>
                        <option>Units</option>
                      </select>
                    </div>
                  </div>

                  <form onSubmit={submitOrder} className="mt-4 space-y-3">
                    <input
                      value={orderForm.client}
                      onChange={(e) =>
                        setOrderForm((p) => ({ ...p, client: e.target.value }))
                      }
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      placeholder="Client Name / PAN / Client ID"
                    />
                    <input
                      value={orderForm.folio}
                      onChange={(e) =>
                        setOrderForm((p) => ({ ...p, folio: e.target.value }))
                      }
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      placeholder="Folio Number"
                    />
                    <input
                      value={orderForm.scheme}
                      onChange={(e) =>
                        setOrderForm((p) => ({ ...p, scheme: e.target.value }))
                      }
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      placeholder="Scheme Name"
                    />
                    <input
                      value={orderForm.amount}
                      onChange={(e) =>
                        setOrderForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                      placeholder="Amount"
                    />
                    {orderError ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {orderError}
                      </div>
                    ) : null}
                    {orderSuccess ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        {orderSuccess}
                      </div>
                    ) : null}
                    <button className="w-full rounded-xl bg-gold py-3 text-sm font-bold text-navy-900">
                      Submit Transaction
                    </button>
                  </form>

                  <div className="mt-4 rounded-xl border border-navy-900/10 bg-[#FAF9F6] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-navy-900/60">
                      Required Fields from Spec
                    </p>
                    <ul className="mt-2 list-disc pl-4 text-xs text-navy-900/70 space-y-1">
                      {(transactForms.find((f) => f.id === selectedFormId)?.required ||
                        []
                      ).map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                    <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-navy-900">
                      <DollarSign size={18} className="text-gold" />
                      Bulk Order Validation
                    </h3>
                    <p className="mt-2 text-sm text-navy-900/60">
                      CSV upload validation matrix: row number, PAN, error description.
                    </p>
                    <button
                      onClick={runBulkValidation}
                      className="mt-3 rounded-xl border border-navy-900/15 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold"
                    >
                      Validate Sample Bulk File
                    </button>
                    {bulkErrors.length > 0 ? (
                      <div className="mt-3 overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead className="bg-navy-900 text-white">
                            <tr>
                              {['Row', 'PAN', 'Issue'].map((h) => (
                                <th key={h} className="px-3 py-2 text-left">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {bulkErrors.map((err) => (
                              <tr key={`${err.rowNo}-${err.pan}`} className="border-b border-navy-900/10">
                                <td className="px-3 py-2">{err.rowNo}</td>
                                <td className="px-3 py-2">{err.pan}</td>
                                <td className="px-3 py-2">{err.issue}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                    <h3 className="text-base font-serif font-bold text-navy-900">
                      Transaction Log
                    </h3>
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      <input
                        value={txnQuery}
                        onChange={(e) => setTxnQuery(e.target.value)}
                        placeholder="Search log..."
                        className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                      />
                      <select
                        value={txnType}
                        onChange={(e) => setTxnType(e.target.value)}
                        className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                      >
                        <option>All</option>
                        <option>Purchase</option>
                        <option>SIP</option>
                        <option>Redemption</option>
                        <option>Switch</option>
                        <option>STP</option>
                        <option>SWP</option>
                        <option>NFO</option>
                      </select>
                      <select
                        value={txnStatus}
                        onChange={(e) => setTxnStatus(e.target.value)}
                        className="rounded-xl border border-navy-900/15 px-3 py-2 text-xs"
                      >
                        <option>All</option>
                        <option>Success</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div className="mt-3 overflow-x-auto">
                      {txnLoading ? (
                        <LoadingState label="Loading transaction log..." />
                      ) : txnError ? (
                        <ErrorState message={txnError} />
                      ) : txnRows.length === 0 ? (
                        <EmptyState
                          title="No transactions found"
                          detail="No records matched current filters."
                        />
                      ) : (
                        <table className="min-w-full text-xs">
                          <thead className="bg-navy-900 text-white">
                            <tr>
                              {[
                                'Date',
                                'Order ID',
                                'Type',
                                'Client',
                                'Scheme',
                                'Folio',
                                'Amount',
                                'Status',
                              ].map((h) => (
                                <th key={h} className="px-3 py-2 text-left">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {txnRows.map((r) => (
                              <tr key={r.id} className="border-b border-navy-900/10">
                                <td className="px-3 py-2">{r.date}</td>
                                <td className="px-3 py-2 font-semibold">{r.id}</td>
                                <td className="px-3 py-2">{r.type}</td>
                                <td className="px-3 py-2">{r.client}</td>
                                <td className="px-3 py-2">{r.scheme}</td>
                                <td className="px-3 py-2">{r.folio}</td>
                                <td className="px-3 py-2">{formatINR(r.amount)}</td>
                                <td className="px-3 py-2">{r.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'Notifications' && (
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Notification Center
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['All', 'Unread', 'SIP', 'KYC', 'Orders'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setNotifTab(tab)}
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          notifTab === tab
                            ? 'bg-navy-900 text-white'
                            : 'border border-navy-900/15 text-navy-900/70'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    {filteredNotifications.length === 0 ? (
                      <EmptyState
                        title="No notifications"
                        detail="No alerts for selected filter."
                      />
                    ) : (
                      filteredNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-xl border border-navy-900/10 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-navy-900">
                              {n.type}
                            </p>
                            <span className="text-[11px] text-navy-900/50">
                              {n.unread ? 'Unread' : 'Read'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-navy-900/65">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <h3 className="text-lg font-serif font-bold text-navy-900">
                    Notification Preferences
                  </h3>
                  {notifLoading ? (
                    <LoadingState label="Loading preferences..." />
                  ) : notifError ? (
                    <ErrorState message={notifError} />
                  ) : (
                    <>
                      <DataGridTable
                        compact
                        headers={['Alert Type', 'Channels', 'Timing', 'Enabled']}
                        rows={notifPrefs.map((p) => (
                          <tr key={p.id} className="border-b border-navy-900/10">
                            <td className="px-3 py-2 font-semibold">{p.alertType}</td>
                            <td className="px-3 py-2">{p.channels.join(', ')}</td>
                            <td className="px-3 py-2">{p.timing}</td>
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={p.enabled}
                                onChange={(e) =>
                                  setNotifPrefs((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? { ...x, enabled: e.target.checked }
                                        : x,
                                    ),
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      />
                      <button
                        onClick={saveNotificationPrefs}
                        className="mt-3 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy-900"
                      >
                        Save Preferences
                      </button>
                      {prefSaveMsg ? (
                        <p className="mt-2 text-xs text-emerald-700">{prefSaveMsg}</p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </AnimatePresence>

        {showSessionWarning ? (
          <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-navy-900/10 bg-white p-6">
              <h4 className="text-lg font-serif font-bold text-navy-900">
                Session Timeout Warning
              </h4>
              <p className="mt-2 text-sm text-navy-900/70">
                Your session is about to expire due to inactivity.
              </p>
              <p className="mt-1 text-sm font-semibold text-red-600">
                Auto logout in {sessionCountdown}s
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={stayLoggedIn}
                  className="flex-1 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy-900"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl border border-navy-900/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy-900"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
          <h3 className="flex items-center gap-2 text-base font-serif font-bold text-navy-900">
            <Shield size={16} className="text-gold" />
            Trusted Data Source Mapping
          </h3>
          <p className="mt-2 text-xs text-navy-900/60">
            Primary live references for future API adapters: AMFI, SEBI, BSE Star MF,
            NSE NMF, CAMS/KFintech.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
