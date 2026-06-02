export const moduleTabs = [
  'Home',
  'CRM',
  'Mutual Fund',
  'Reports',
  'Transact',
  'Brokerage',
  'Goals',
  'Research',
  'Utilities',
  'Settings',
  'Import',
];

export const kpiCards = [
  { id: 'aum', label: 'Total AUM', value: 842500000, changePct: 3.8 },
  { id: 'clients', label: 'Active Clients', value: 1284, changePct: 2.1 },
  { id: 'sipBook', label: 'Monthly SIP Book', value: 12450000, changePct: 5.4 },
  { id: 'brokerage', label: 'Trail Brokerage (MTD)', value: 1840000, changePct: 1.2 },
];

export const clients = [
  {
    id: 'C1021',
    name: 'Aarav Sharma',
    pan: 'ABCDE1234F',
    city: 'Gurugram',
    aum: 12800000,
    xirr: 14.2,
    risk: 'Aggressive',
    kyc: 'Verified',
    tag: 'HNI',
    family: 'Sharma Family',
  },
  {
    id: 'C1008',
    name: 'Riya Mehta',
    pan: 'PQRSM8921L',
    city: 'Delhi',
    aum: 4700000,
    xirr: 11.8,
    risk: 'Moderate',
    kyc: 'Pending',
    tag: 'NRI',
    family: 'Mehta Family',
  },
  {
    id: 'C1003',
    name: 'Nikhil Verma',
    pan: 'LMNOP4432T',
    city: 'Noida',
    aum: 9400000,
    xirr: 16.3,
    risk: 'Very Aggressive',
    kyc: 'Verified',
    tag: 'Corporate',
    family: 'Verma Family',
  },
];

export const notifications = [
  { id: 'N1', type: 'SIP Due', severity: 'medium', text: 'Aarav Sharma SIP due on 2026-05-02', unread: true },
  { id: 'N2', type: 'KYC Expiry', severity: 'high', text: 'Riya Mehta KYC expires in 90 days', unread: true },
  { id: 'N3', type: 'Order Success', severity: 'low', text: 'Nikhil Verma order confirmed. ID: ORD98271', unread: false },
];

export const notificationPreferences = [
  {
    id: 'NP-1',
    alertType: 'SIP Due',
    channels: ['App', 'WhatsApp', 'Email'],
    timing: '1 / 3 / 7 days before',
    enabled: true,
  },
  {
    id: 'NP-2',
    alertType: 'SIP Not Debited',
    channels: ['App', 'WhatsApp'],
    timing: '1 / 3 days after',
    enabled: true,
  },
  {
    id: 'NP-3',
    alertType: 'KYC Expiry',
    channels: ['App', 'Email'],
    timing: '30 / 60 / 90 days',
    enabled: true,
  },
  {
    id: 'NP-4',
    alertType: 'Portfolio Alert',
    channels: ['App'],
    timing: 'Threshold based',
    enabled: false,
  },
];

export const activityLogs = [
  { id: 'A1', user: 'admin', action: 'Generated Wealth Report', module: 'Reports', at: '2026-04-29 11:20' },
  { id: 'A2', user: 'advisor_01', action: 'Added client Riya Mehta', module: 'CRM', at: '2026-04-29 10:15' },
];

export const reportCatalog = [
  { id: 'wealth', label: 'Wealth Report' },
  { id: 'aumGrowth', label: 'AUM Growth Report' },
  { id: 'mis', label: 'Monthly MIS' },
  { id: 'xirrBetweenDates', label: 'Between Date XIRR' },
  { id: 'realisedXirr', label: 'Realised Funds XIRR' },
  { id: 'folioMaster', label: 'Folio Master' },
];

export const reportRows = {
  wealth: [
    {
      clientName: 'Aarav Sharma',
      pan: 'ABCDE1234F',
      folio: 'FOL-1021',
      invested: 10100000,
      currentValue: 12800000,
      gainLoss: 2700000,
      xirr: 14.2,
      benchmarkXirr: 12.1,
    },
    {
      clientName: 'Riya Mehta',
      pan: 'PQRSM8921L',
      folio: 'FOL-1008',
      invested: 4200000,
      currentValue: 4700000,
      gainLoss: 500000,
      xirr: 11.8,
      benchmarkXirr: 10.9,
    },
  ],
  aumGrowth: [
    { period: 'Jan 2026', openingAum: 792000000, closingAum: 804000000, growthAmount: 12000000, growthPct: 1.52 },
    { period: 'Feb 2026', openingAum: 804000000, closingAum: 818500000, growthAmount: 14500000, growthPct: 1.8 },
    { period: 'Mar 2026', openingAum: 818500000, closingAum: 830200000, growthAmount: 11700000, growthPct: 1.43 },
    { period: 'Apr 2026', openingAum: 830200000, closingAum: 842500000, growthAmount: 12300000, growthPct: 1.48 },
  ],
  mis: [
    {
      month: 'Apr 2026',
      openingAum: 830200000,
      inflow: 15400000,
      outflow: 7800000,
      netFlow: 7600000,
      closingAum: 842500000,
      sipCount: 624,
      sipAmount: 12450000,
      newClients: 24,
    },
    {
      month: 'Mar 2026',
      openingAum: 818500000,
      inflow: 14900000,
      outflow: 8200000,
      netFlow: 6700000,
      closingAum: 830200000,
      sipCount: 608,
      sipAmount: 11920000,
      newClients: 19,
    },
  ],
  xirrBetweenDates: [
    {
      clientName: 'Aarav Sharma',
      folio: 'FOL-1021',
      startValue: 11300000,
      endValue: 12800000,
      xirr: 14.2,
      benchmarkXirr: 12.1,
      alpha: 2.1,
    },
    {
      clientName: 'Nikhil Verma',
      folio: 'FOL-1003',
      startValue: 8210000,
      endValue: 9400000,
      xirr: 16.3,
      benchmarkXirr: 12.8,
      alpha: 3.5,
    },
  ],
  realisedXirr: [
    {
      clientName: 'Riya Mehta',
      scheme: 'HDFC Midcap Opportunities',
      folio: 'FOL-1008',
      investDate: '2023-02-11',
      redeemDate: '2026-03-15',
      invested: 900000,
      redeemed: 1230000,
      gainLoss: 330000,
      xirr: 12.7,
    },
    {
      clientName: 'Aarav Sharma',
      scheme: 'SBI Flexicap',
      folio: 'FOL-1021',
      investDate: '2022-09-03',
      redeemDate: '2026-01-22',
      invested: 600000,
      redeemed: 840000,
      gainLoss: 240000,
      xirr: 11.9,
    },
  ],
  folioMaster: [
    {
      clientName: 'Aarav Sharma',
      pan: 'ABCDE1234F',
      folio: 'FOL-1021',
      amc: 'SBI Mutual Fund',
      registrar: 'CAMS',
      value: 12800000,
      xirr: 14.2,
      createdOn: '2020-06-18',
    },
    {
      clientName: 'Nikhil Verma',
      pan: 'LMNOP4432T',
      folio: 'FOL-1003',
      amc: 'ICICI Prudential MF',
      registrar: 'KFintech',
      value: 9400000,
      xirr: 16.3,
      createdOn: '2019-11-05',
    },
  ],
};

export const transactForms = [
  {
    id: 'redemption',
    title: 'Redemption & SWP',
    required: ['Client', 'Folio', 'Scheme', 'Amount/Units', 'Redemption Bank'],
  },
  {
    id: 'switch',
    title: 'Switch',
    required: ['Client', 'Switch From Scheme', 'Switch To AMC', 'Switch To Scheme', 'Amount/Units'],
  },
  {
    id: 'stp',
    title: 'STP',
    required: ['Client', 'Source Scheme', 'Target Scheme', 'Amount', 'Frequency', 'Start/End Date'],
  },
  {
    id: 'sipCancellation',
    title: 'SIP Cancellation',
    required: ['Client', 'Active SIP Selection', 'Cancellation Reason'],
  },
  {
    id: 'nfoPurchase',
    title: 'NFO Purchase',
    required: ['Client', 'NFO Scheme', 'Amount', 'Folio (new/existing)', 'Payment Mode'],
  },
];

export const transactionLog = [
  {
    id: 'T-9821',
    date: '2026-04-29',
    type: 'Purchase',
    client: 'Aarav Sharma',
    scheme: 'SBI Flexicap',
    folio: 'FOL-1021',
    amount: 100000,
    status: 'Success',
  },
  {
    id: 'T-9820',
    date: '2026-04-28',
    type: 'SIP',
    client: 'Riya Mehta',
    scheme: 'HDFC Midcap Opportunities',
    folio: 'FOL-1008',
    amount: 15000,
    status: 'Pending',
  },
  {
    id: 'T-9817',
    date: '2026-04-27',
    type: 'Switch',
    client: 'Nikhil Verma',
    scheme: 'ICICI Contra -> ICICI Value Discovery',
    folio: 'FOL-1003',
    amount: 250000,
    status: 'Success',
  },
];

export const bulkUploadErrors = [
  { rowNo: 4, pan: 'ABCDE1234F', issue: 'Invalid Scheme Code' },
  { rowNo: 7, pan: 'PQRSM8921L', issue: 'Amount missing' },
  { rowNo: 12, pan: 'LMNOP4432T', issue: 'Folio not found for selected AMC' },
];

export const aumMasterViews = [
  { id: 'fundHouse', label: 'AUM By Fund House' },
  { id: 'schemes', label: 'AUM By Schemes' },
  { id: 'clients', label: 'AUM By Clients' },
  { id: 'assetAllocation', label: 'AUM By Asset Allocation' },
  { id: 'families', label: 'AUM By Families' },
  { id: 'registrar', label: 'AUM By Registrar' },
];

export const aumMasterRows = {
  fundHouse: [
    {
      amcName: 'SBI Mutual Fund',
      clientCount: 281,
      folioCount: 512,
      investedAmount: 188000000,
      currentValue: 214000000,
      gainLoss: 26000000,
      xirr: 12.4,
      shareOfAum: 25.4,
    },
    {
      amcName: 'HDFC Mutual Fund',
      clientCount: 244,
      folioCount: 498,
      investedAmount: 174000000,
      currentValue: 198000000,
      gainLoss: 24000000,
      xirr: 11.8,
      shareOfAum: 23.5,
    },
  ],
  schemes: [
    {
      schemeName: 'SBI Flexicap',
      amc: 'SBI Mutual Fund',
      clientCount: 143,
      folioCount: 201,
      investedAmount: 54000000,
      currentValue: 63200000,
      xirr: 13.2,
    },
    {
      schemeName: 'HDFC Midcap Opportunities',
      amc: 'HDFC Mutual Fund',
      clientCount: 112,
      folioCount: 164,
      investedAmount: 48000000,
      currentValue: 55800000,
      xirr: 14.1,
    },
  ],
  clients: [
    {
      rank: 1,
      clientName: 'Aarav Sharma',
      pan: 'ABCDE1234F',
      folioCount: 11,
      investedAmount: 10100000,
      currentValue: 12800000,
      gainLoss: 2700000,
      xirr: 14.2,
      sipBook: 120000,
    },
    {
      rank: 2,
      clientName: 'Nikhil Verma',
      pan: 'LMNOP4432T',
      folioCount: 9,
      investedAmount: 7500000,
      currentValue: 9400000,
      gainLoss: 1900000,
      xirr: 16.3,
      sipBook: 90000,
    },
  ],
  assetAllocation: [
    {
      assetType: 'Equity',
      clientCount: 712,
      investedAmount: 472000000,
      currentValue: 551000000,
      gainLoss: 79000000,
      xirr: 14.6,
      allocationPct: 65.4,
    },
    {
      assetType: 'Debt',
      clientCount: 398,
      investedAmount: 181000000,
      currentValue: 194000000,
      gainLoss: 13000000,
      xirr: 7.9,
      allocationPct: 23.0,
    },
    {
      assetType: 'Hybrid',
      clientCount: 274,
      investedAmount: 76000000,
      currentValue: 83000000,
      gainLoss: 7000000,
      xirr: 9.8,
      allocationPct: 9.8,
    },
  ],
  families: [
    {
      familyName: 'Sharma Family',
      members: 4,
      folioCount: 17,
      investedAmount: 15800000,
      currentValue: 19800000,
      combinedSipBook: 145000,
      xirr: 13.9,
    },
    {
      familyName: 'Mehta Family',
      members: 3,
      folioCount: 8,
      investedAmount: 6900000,
      currentValue: 8020000,
      combinedSipBook: 65000,
      xirr: 11.2,
    },
  ],
  registrar: [
    {
      registrar: 'CAMS',
      clientCount: 801,
      folioCount: 1488,
      investedAmount: 514000000,
      currentValue: 586000000,
      gainLoss: 72000000,
      xirr: 12.7,
    },
    {
      registrar: 'KFintech',
      clientCount: 483,
      folioCount: 934,
      investedAmount: 266000000,
      currentValue: 301000000,
      gainLoss: 35000000,
      xirr: 11.6,
    },
  ],
};

export const brokerageRows = {
  growth: [
    {
      month: 'Jan 2026',
      brokerageAccrued: 1620000,
      payoutReceived: 1582000,
      netBrokerage: 1582000,
      aumCr: 79.2,
      ratioPct: 0.2,
    },
    {
      month: 'Feb 2026',
      brokerageAccrued: 1710000,
      payoutReceived: 1681000,
      netBrokerage: 1681000,
      aumCr: 80.5,
      ratioPct: 0.21,
    },
    {
      month: 'Mar 2026',
      brokerageAccrued: 1790000,
      payoutReceived: 1764000,
      netBrokerage: 1764000,
      aumCr: 82.1,
      ratioPct: 0.22,
    },
    {
      month: 'Apr 2026',
      brokerageAccrued: 1840000,
      payoutReceived: 0,
      netBrokerage: 0,
      aumCr: 84.2,
      ratioPct: 0.22,
    },
  ],
  payout: [
    {
      payoutDate: '2026-04-10',
      amcName: 'SBI Mutual Fund',
      scheme: 'SBI Flexicap',
      aum: 63200000,
      brokerageRate: 0.68,
      brokerageAccrued: 358000,
      tds: 3580,
      payoutAmount: 354420,
      notes: 'Paid on time',
    },
    {
      payoutDate: '2026-04-12',
      amcName: 'HDFC Mutual Fund',
      scheme: 'HDFC Midcap Opportunities',
      aum: 55800000,
      brokerageRate: 0.62,
      brokerageAccrued: 288000,
      tds: 2880,
      payoutAmount: 285120,
      notes: 'Minor reconciliation pending',
    },
  ],
};

export const goals = [
  {
    id: 'G-1001',
    clientName: 'Aarav Sharma',
    goalName: 'Child Education',
    category: 'Education',
    targetAmount: 5000000,
    currentValue: 2180000,
    requiredSip: 32000,
    actualSip: 22000,
    progressPct: 44,
    status: 'Behind',
    yearsRemaining: 8,
  },
  {
    id: 'G-1002',
    clientName: 'Nikhil Verma',
    goalName: 'Retirement Corpus',
    category: 'Retirement',
    targetAmount: 30000000,
    currentValue: 11200000,
    requiredSip: 78000,
    actualSip: 82000,
    progressPct: 37,
    status: 'On Track',
    yearsRemaining: 18,
  },
];

export const campaignTemplates = [
  {
    id: 'CT-01',
    name: 'SIP Due Reminder',
    channel: 'WhatsApp + App',
    trigger: '3 days before SIP date',
    variables: ['{ClientName}', '{SIPAmount}', '{SIPDate}', '{SchemeName}'],
  },
  {
    id: 'CT-02',
    name: 'KYC Expiry Alert',
    channel: 'WhatsApp + Email',
    trigger: '90 days before expiry',
    variables: ['{ClientName}', '{ExpiryDate}'],
  },
  {
    id: 'CT-03',
    name: 'Portfolio Update',
    channel: 'Email',
    trigger: 'Monthly',
    variables: ['{ClientName}', '{PortfolioValue}', '{XIRR}', '{Gain}'],
  },
];

export const campaignDeliveries = [
  {
    id: 'CD-901',
    campaignName: 'April SIP Reminder Batch',
    delivered: 612,
    failed: 21,
    channel: 'WhatsApp',
    deliveredAt: '2026-04-27 08:30',
  },
  {
    id: 'CD-902',
    campaignName: 'KYC Expiry Outreach',
    delivered: 188,
    failed: 9,
    channel: 'Email',
    deliveredAt: '2026-04-25 14:05',
  },
];

export const watchlist = [
  {
    id: 'W-101',
    scheme: 'Parag Parikh Flexi Cap',
    amc: 'PPFAS',
    nav: 67.41,
    dayChange: 0.6,
    return1m: 3.1,
    return1y: 17.4,
    cagr3y: 15.2,
    aumCr: 72100,
  },
  {
    id: 'W-102',
    scheme: 'Nippon Small Cap',
    amc: 'Nippon',
    nav: 112.8,
    dayChange: -0.4,
    return1m: 2.2,
    return1y: 21.8,
    cagr3y: 19.3,
    aumCr: 48700,
  },
];

export const marketOverview = {
  nifty50: { value: 24110, changePct: 0.43 },
  sensex: { value: 79280, changePct: 0.39 },
  niftyMidcap: { value: 51520, changePct: 0.65 },
  vix: { value: 12.7, changePct: -1.8 },
};

export const importJobs = [
  {
    id: 'IMP-3001',
    type: 'Client Import',
    status: 'Completed',
    records: 248,
    success: 243,
    failed: 5,
    createdAt: '2026-04-28 12:22',
  },
  {
    id: 'IMP-3002',
    type: 'Transaction Import',
    status: 'Completed',
    records: 1024,
    success: 1009,
    failed: 15,
    createdAt: '2026-04-26 16:47',
  },
];

export const dashboardWidgets = [
  { id: 'sipBusiness', label: 'SIP Business', enabled: true },
  { id: 'monthlyMis', label: 'Monthly MIS', enabled: true },
  { id: 'aumBreakup', label: 'AUM Breakup', enabled: true },
  { id: 'clientStats', label: 'Client Statistics', enabled: true },
  { id: 'compliance', label: 'Compliance', enabled: true },
  { id: 'todaysTxn', label: "Today's Transactions", enabled: true },
  { id: 'shortcuts', label: 'Shortcuts', enabled: true },
  { id: 'marketOverview', label: 'Market Overview', enabled: false },
  { id: 'upcomingEvents', label: 'Upcoming Events', enabled: false },
  { id: 'recentClients', label: 'Recent Clients', enabled: false },
];

export const speedDialActions = [
  { id: 'addClient', label: 'Add Client', color: 'green', path: '/mfd-dashboard' },
  { id: 'newSip', label: 'New SIP', color: 'blue', path: '/mfd-dashboard' },
  { id: 'quickRedeem', label: 'Quick Redeem', color: 'orange', path: '/mfd-dashboard' },
  { id: 'uploadCas', label: 'Upload CAS', color: 'teal', path: '/mfd-dashboard' },
  { id: 'sendWhatsApp', label: 'Send WhatsApp', color: 'green', path: '/mfd-dashboard' },
  { id: 'generateReport', label: 'Generate Report', color: 'purple', path: '/mfd-dashboard' },
];

export const scheduledReports = [
  {
    id: 'SR-1001',
    reportType: 'Portfolio Statement',
    frequency: 'Monthly',
    sendTo: 'All Clients',
    nextRun: '2026-05-01 08:00',
    status: 'Active',
  },
  {
    id: 'SR-1002',
    reportType: 'SIP Report',
    frequency: 'Weekly',
    sendTo: 'Tag: HNI',
    nextRun: '2026-04-30 09:30',
    status: 'Active',
  },
];
