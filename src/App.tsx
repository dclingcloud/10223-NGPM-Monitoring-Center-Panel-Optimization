import React, { useState, useMemo } from 'react';
import {
  Search,
  Maximize2,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Cloud,
  Network,
  Bell,
  Crosshair,
  Gauge,
  Server,
  Cpu,
  LayoutGrid,
  SlidersHorizontal,
  Globe,
  Film,
  Monitor,
  HardDrive,
  Settings,
  X,
  ChevronDown,
  RotateCcw,
  EyeOff,
  Eye,
  Filter,
  Check,
  RotateCw,
  AlertCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';

// Metric options as provided in Image 2
export const METRIC_OPTIONS = [
  { key: 'zeroWindow', name: '零窗口数', unit: '个', isRate: false, higherIsBetter: false },
  { key: 'netLatency', name: '网络延迟', unit: 'ms', isRate: false, higherIsBetter: false },
  { key: 'responseTime', name: '响应时间', unit: 'ms', isRate: false, higherIsBetter: false },
  { key: 'clientLatency', name: '客户端延迟', unit: 'ms', isRate: false, higherIsBetter: false },
  { key: 'serverLatency', name: '服务器延迟', unit: 'ms', isRate: false, higherIsBetter: false },
  { key: 'clientRate', name: '客户端速率', unit: 'MB/s', isRate: false, higherIsBetter: true },
  { key: 'serverRate', name: '服务器速率', unit: 'MB/s', isRate: false, higherIsBetter: true },
  { key: 'lossRate', name: '丢包率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'clientLossRate', name: '客户端丢包率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'serverLossRate', name: '服务器丢包率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'retransmitRate', name: '重传率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'clientRetransmitRate', name: '客户端重传率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'serverRetransmitRate', name: '服务器重传率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'connFailRate', name: '建连失败率', unit: '%', isRate: true, higherIsBetter: false },
  { key: 'connSuccessRate', name: '建连成功率', unit: '%', isRate: true, higherIsBetter: true },
] as const;

export type MetricKey = typeof METRIC_OPTIONS[number]['key'];

export const SORT_OPTIONS = [
  { key: 'id_desc', name: '拓扑ID降序' },
  { key: 'id_asc', name: '拓扑ID升序' },
  { key: 'primary_desc', name: '主要指标降序' },
  { key: 'primary_asc', name: '主要指标升序' },
  { key: 'name_asc', name: '应用名称升序' },
];

export const OPERATOR_OPTIONS = [
  { key: '>', name: '大于 (>)' },
  { key: '>=', name: '大于等于 (>=)' },
  { key: '=', name: '等于 (=)' },
  { key: '<=', name: '小于等于 (<=)' },
  { key: '<', name: '小于 (<)' },
  { key: '!=', name: '不等于 (!=)' },
];

export type OperatorKey = typeof OPERATOR_OPTIONS[number]['key'];

export interface MetricConditionRule {
  enabled: boolean;
  operator: OperatorKey;
  threshold: number;
}

export interface MultiHideCondition {
  masterEnabled: boolean;
  primaryRule: MetricConditionRule;
  secondaryRule: MetricConditionRule;
  pieRule: MetricConditionRule;
}

export interface NodeMetrics {
  id: number;
  topologyId: string;
  name: string;
  isAlert: boolean;
  blockStatus: 'gray' | 'green' | 'red';
  zeroWindow: number;
  netLatency: number;
  responseTime: number;
  clientLatency: number;
  serverLatency: number;
  clientRate: number;
  serverRate: number;
  lossRate: number;
  clientLossRate: number;
  serverLossRate: number;
  retransmitRate: number;
  clientRetransmitRate: number;
  serverRetransmitRate: number;
  connFailRate: number;
  connSuccessRate: number;
}

interface CardCustomConfig {
  primaryMetric: MetricKey;
  secondaryMetric: MetricKey;
  pieMetric: MetricKey;
}

const INITIAL_NODES: NodeMetrics[] = [
  {
    id: 1,
    topologyId: 'TOP-1012',
    name: '审计日志',
    isAlert: false,
    blockStatus: 'gray',
    zeroWindow: 0,
    netLatency: 0,
    responseTime: 0,
    clientLatency: 0,
    serverLatency: 0,
    clientRate: 0,
    serverRate: 0,
    lossRate: 0,
    clientLossRate: 0,
    serverLossRate: 0,
    retransmitRate: 0,
    clientRetransmitRate: 0,
    serverRetransmitRate: 0,
    connFailRate: 0,
    connSuccessRate: 0,
  },
  {
    id: 2,
    topologyId: 'TOP-1011',
    name: '禅道拓扑',
    isAlert: false,
    blockStatus: 'green',
    zeroWindow: 0,
    netLatency: 14.2,
    responseTime: 36.8,
    clientLatency: 5.1,
    serverLatency: 9.1,
    clientRate: 24.6,
    serverRate: 48.2,
    lossRate: 0.12,
    clientLossRate: 0.05,
    serverLossRate: 0.07,
    retransmitRate: 0.45,
    clientRetransmitRate: 0.21,
    serverRetransmitRate: 0.24,
    connFailRate: 1.01,
    connSuccessRate: 98.99,
  },
  {
    id: 3,
    topologyId: 'TOP-1010',
    name: 'test',
    isAlert: false,
    blockStatus: 'gray',
    zeroWindow: 0,
    netLatency: 0,
    responseTime: 0,
    clientLatency: 0,
    serverLatency: 0,
    clientRate: 0,
    serverRate: 0,
    lossRate: 0,
    clientLossRate: 0,
    serverLossRate: 0,
    retransmitRate: 0,
    clientRetransmitRate: 0,
    serverRetransmitRate: 0,
    connFailRate: 0,
    connSuccessRate: 0,
  },
  {
    id: 4,
    topologyId: 'TOP-1009',
    name: 'CRM System',
    isAlert: false,
    blockStatus: 'gray',
    zeroWindow: 0,
    netLatency: 0,
    responseTime: 0,
    clientLatency: 0,
    serverLatency: 0,
    clientRate: 0,
    serverRate: 0,
    lossRate: 0,
    clientLossRate: 0,
    serverLossRate: 0,
    retransmitRate: 0,
    clientRetransmitRate: 0,
    serverRetransmitRate: 0,
    connFailRate: 0,
    connSuccessRate: 0,
  },
  {
    id: 5,
    topologyId: 'TOP-1008',
    name: 'External Agency Leased Line',
    isAlert: true,
    blockStatus: 'red',
    zeroWindow: 48,
    netLatency: 98.6,
    responseTime: 245.0,
    clientLatency: 42.1,
    serverLatency: 56.5,
    clientRate: 8.2,
    serverRate: 14.5,
    lossRate: 18.6,
    clientLossRate: 9.2,
    serverLossRate: 9.4,
    retransmitRate: 22.4,
    clientRetransmitRate: 11.5,
    serverRetransmitRate: 10.9,
    connFailRate: 65.23,
    connSuccessRate: 34.77,
  },
  {
    id: 6,
    topologyId: 'TOP-1007',
    name: 'Production Core Zone',
    isAlert: false,
    blockStatus: 'green',
    zeroWindow: 2,
    netLatency: 28.4,
    responseTime: 62.1,
    clientLatency: 12.0,
    serverLatency: 16.4,
    clientRate: 35.8,
    serverRate: 72.4,
    lossRate: 1.25,
    clientLossRate: 0.6,
    serverLossRate: 0.65,
    retransmitRate: 2.1,
    clientRetransmitRate: 0.9,
    serverRetransmitRate: 1.2,
    connFailRate: 50.31,
    connSuccessRate: 49.69,
  },
  {
    id: 7,
    topologyId: 'TOP-1006',
    name: 'Production Core Zone',
    isAlert: false,
    blockStatus: 'gray',
    zeroWindow: 0,
    netLatency: 0,
    responseTime: 0,
    clientLatency: 0,
    serverLatency: 0,
    clientRate: 0,
    serverRate: 0,
    lossRate: 0,
    clientLossRate: 0,
    serverLossRate: 0,
    retransmitRate: 0,
    clientRetransmitRate: 0,
    serverRetransmitRate: 0,
    connFailRate: 0,
    connSuccessRate: 0,
  },
  {
    id: 8,
    topologyId: 'TOP-1005',
    name: 'Low-Risk Assets',
    isAlert: false,
    blockStatus: 'gray',
    zeroWindow: 0,
    netLatency: 0,
    responseTime: 0,
    clientLatency: 0,
    serverLatency: 0,
    clientRate: 0,
    serverRate: 0,
    lossRate: 0,
    clientLossRate: 0,
    serverLossRate: 0,
    retransmitRate: 0,
    clientRetransmitRate: 0,
    serverRetransmitRate: 0,
    connFailRate: 0,
    connSuccessRate: 0,
  },
  {
    id: 9,
    topologyId: 'TOP-1004',
    name: 'Important Assets',
    isAlert: false,
    blockStatus: 'gray',
    zeroWindow: 0,
    netLatency: 0,
    responseTime: 0,
    clientLatency: 0,
    serverLatency: 0,
    clientRate: 0,
    serverRate: 0,
    lossRate: 0,
    clientLossRate: 0,
    serverLossRate: 0,
    retransmitRate: 0,
    clientRetransmitRate: 0,
    serverRetransmitRate: 0,
    connFailRate: 0,
    connSuccessRate: 0,
  },
  {
    id: 10,
    topologyId: 'TOP-1003',
    name: 'Medium-Risk Assets',
    isAlert: true,
    blockStatus: 'red',
    zeroWindow: 89,
    netLatency: 145.2,
    responseTime: 412.0,
    clientLatency: 68.0,
    serverLatency: 77.2,
    clientRate: 1.8,
    serverRate: 3.4,
    lossRate: 34.8,
    clientLossRate: 18.2,
    serverLossRate: 16.6,
    retransmitRate: 42.1,
    clientRetransmitRate: 20.5,
    serverRetransmitRate: 21.6,
    connFailRate: 100,
    connSuccessRate: 0,
  },
  {
    id: 11,
    topologyId: 'TOP-1002',
    name: 'Internet Egress to Business Zone',
    isAlert: true,
    blockStatus: 'red',
    zeroWindow: 35,
    netLatency: 84.5,
    responseTime: 189.0,
    clientLatency: 38.2,
    serverLatency: 46.3,
    clientRate: 11.4,
    serverRate: 22.0,
    lossRate: 14.2,
    clientLossRate: 7.0,
    serverLossRate: 7.2,
    retransmitRate: 16.8,
    clientRetransmitRate: 8.3,
    serverRetransmitRate: 8.5,
    connFailRate: 58.97,
    connSuccessRate: 41.03,
  },
  {
    id: 12,
    topologyId: 'TOP-1001',
    name: 'Internet Egress to Business Zone',
    isAlert: true,
    blockStatus: 'red',
    zeroWindow: 42,
    netLatency: 92.1,
    responseTime: 210.4,
    clientLatency: 41.5,
    serverLatency: 50.6,
    clientRate: 9.8,
    serverRate: 18.6,
    lossRate: 16.5,
    clientLossRate: 8.1,
    serverLossRate: 8.4,
    retransmitRate: 19.3,
    clientRetransmitRate: 9.6,
    serverRetransmitRate: 9.7,
    connFailRate: 61.37,
    connSuccessRate: 38.63,
  },
];

// Helper to format values
function formatMetricValue(value: number, key: MetricKey): { valStr: string; unitStr: string } {
  const metric = METRIC_OPTIONS.find((m) => m.key === key);
  const unit = metric ? metric.unit : '';

  if (value === 0 && (key === 'zeroWindow' || key === 'connSuccessRate' || key === 'lossRate')) {
    return { valStr: '0', unitStr: unit };
  }
  if (metric?.isRate) {
    return { valStr: value.toFixed(2), unitStr: unit };
  }
  if (value % 1 !== 0) {
    return { valStr: value.toFixed(1), unitStr: unit };
  }
  return { valStr: String(value), unitStr: unit };
}

// Evaluate condition
function checkNodeMeetsCondition(
  node: NodeMetrics,
  metric: MetricKey,
  operator: OperatorKey,
  threshold: number
): boolean {
  const val = Number(node[metric] ?? 0);
  const thresh = Number(threshold);
  switch (operator) {
    case '>':
      return val > thresh;
    case '>=':
      return val >= thresh;
    case '<':
      return val < thresh;
    case '<=':
      return val <= thresh;
    case '=':
      return Math.abs(val - thresh) < 0.001;
    case '!=':
      return Math.abs(val - thresh) >= 0.001;
    default:
      return false;
  }
}

// Mini SVG Donut / Pie Chart Component for Cards
function MiniPieChart({
  value,
  metricKey,
  status,
}: {
  value: number;
  metricKey: MetricKey;
  status: 'gray' | 'green' | 'red';
}) {
  const metric = METRIC_OPTIONS.find((m) => m.key === metricKey);
  const isRate = metric?.isRate ?? false;
  let percentage = isRate ? Math.min(100, Math.max(0, value)) : Math.min(100, (value / 200) * 100);
  if (value === 0) percentage = 0;

  const size = 38;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#00c02e';
  if (status === 'red' || (!metric?.higherIsBetter && percentage > 10)) {
    strokeColor = '#f53f3f';
  } else if (status === 'gray' || percentage === 0) {
    strokeColor = '#d9d9d9';
  }

  return (
    <div className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0f2f5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-bold tracking-tight text-gray-700">
          {percentage > 0 ? `${Math.round(percentage)}%` : '0%'}
        </span>
      </div>
    </div>
  );
}

// Custom Select Component matching the dropdown style in Image 1 and Image 2
function CustomSelect({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: string;
  options: { key: string; name: string }[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.key === value) || options[0];

  return (
    <div className="flex items-center flex-1">
      {label && (
        <span className="w-[84px] shrink-0 text-right text-[13px] text-[#595959] pr-3">
          {label}
        </span>
      )}
      <div className="relative flex-1 min-w-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex h-[32px] w-full items-center justify-between rounded-[3px] border bg-white px-2.5 text-left text-[13px] transition-colors ${
            open ? 'border-[#4096ff] shadow-[0_0_0_2px_rgba(5,145,255,0.1)]' : 'border-[#d9d9d9] hover:border-[#4096ff]'
          }`}
        >
          <span className="truncate text-gray-800">{selectedOption?.name}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-[36px] z-50 max-h-[220px] w-full overflow-y-auto rounded-[3px] border border-[#e8e8e8] bg-white py-1 shadow-lg">
              {options.map((opt) => {
                const isSelected = opt.key === value;
                return (
                  <div
                    key={opt.key}
                    onClick={() => {
                      onChange(opt.key);
                      setOpen(false);
                    }}
                    className={`flex cursor-pointer items-center px-3 py-1.5 text-[13px] transition-colors ${
                      isSelected
                        ? 'bg-[#e6e6e6] font-medium text-gray-900'
                        : 'text-gray-700 hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {opt.name}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // Global Configuration States
  const [globalPrimaryMetric, setGlobalPrimaryMetric] = useState<MetricKey>('connSuccessRate');
  const [globalSecondaryMetric, setGlobalSecondaryMetric] = useState<MetricKey>('netLatency');
  const [globalPieMetric, setGlobalPieMetric] = useState<MetricKey>('lossRate');
  const [sortOrder, setSortOrder] = useState<string>('id_desc');

  // Conditional Hiding State
  const [hideCondition, setHideCondition] = useState<MultiHideCondition>({
    masterEnabled: false,
    primaryRule: { enabled: true, operator: '=', threshold: 0 },
    secondaryRule: { enabled: false, operator: '>', threshold: 100 },
    pieRule: { enabled: false, operator: '>', threshold: 10 },
  });

  // Manually Hidden Card IDs
  const [manuallyHiddenIds, setManuallyHiddenIds] = useState<number[]>([]);

  // Toast feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unrestorable Alert Dialog State
  const [unrestorableAlert, setUnrestorableAlert] = useState<{
    open: boolean;
    cardName: string;
    reason: string;
  }>({
    open: false,
    cardName: '',
    reason: '',
  });

  // Custom configuration overrides per card (cardId -> config)
  const [cardOverrides, setCardOverrides] = useState<Record<number, CardCustomConfig>>({});

  // Configuration Modal state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  // Tab switching state inside Modal ('metrics' | 'condition' | 'alerts' | 'hiddenList')
  const [modalTab, setModalTab] = useState<'metrics' | 'condition' | 'alerts' | 'hiddenList'>('metrics');

  // Search Bar Expand State (Requirement 1: 在右上角配置前加一个搜索图标按钮，点击按钮后出现完整的搜索框)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // "仅显示告警应用" 状态 (Requirement 2: 移至配置tab中)
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const [tempOnlyAlerts, setTempOnlyAlerts] = useState(false);

  // Temporary Form States for Modal
  const [tempPrimary, setTempPrimary] = useState<MetricKey>('connSuccessRate');
  const [tempSecondary, setTempSecondary] = useState<MetricKey>('netLatency');
  const [tempPie, setTempPie] = useState<MetricKey>('lossRate');
  const [tempSort, setTempSort] = useState<string>('id_desc');
  const [tempHideCondition, setTempHideCondition] = useState<MultiHideCondition>({
    masterEnabled: false,
    primaryRule: { enabled: true, operator: '=', threshold: 0 },
    secondaryRule: { enabled: false, operator: '>', threshold: 100 },
    pieRule: { enabled: false, operator: '>', threshold: 10 },
  });

  // Open Global Config Modal
  const handleOpenGlobalConfig = (initialTab: 'metrics' | 'condition' | 'alerts' | 'hiddenList' = 'metrics') => {
    setEditingCardId(null);
    setModalTab(initialTab);
    setTempPrimary(globalPrimaryMetric);
    setTempSecondary(globalSecondaryMetric);
    setTempPie(globalPieMetric);
    setTempSort(sortOrder);
    setTempOnlyAlerts(onlyAlerts);
    setTempHideCondition(JSON.parse(JSON.stringify(hideCondition)));
    setIsConfigModalOpen(true);
  };

  // Open Single Card Config Modal
  const handleOpenCardConfig = (cardId: number) => {
    setEditingCardId(cardId);
    setModalTab('metrics');
    const existing = cardOverrides[cardId];
    setTempPrimary(existing?.primaryMetric || globalPrimaryMetric);
    setTempSecondary(existing?.secondaryMetric || globalSecondaryMetric);
    setTempPie(existing?.pieMetric || globalPieMetric);
    setTempSort(sortOrder);
    setIsConfigModalOpen(true);
  };

  // Confirm Modal Handler
  const handleConfirmConfig = () => {
    if (editingCardId === null) {
      // Update global configuration
      setGlobalPrimaryMetric(tempPrimary);
      setGlobalSecondaryMetric(tempSecondary);
      setGlobalPieMetric(tempPie);
      setSortOrder(tempSort);
      setOnlyAlerts(tempOnlyAlerts);
      setHideCondition(JSON.parse(JSON.stringify(tempHideCondition)));
    } else {
      // Update specific card's configuration
      setCardOverrides((prev) => ({
        ...prev,
        [editingCardId]: {
          primaryMetric: tempPrimary,
          secondaryMetric: tempSecondary,
          pieMetric: tempPie,
        },
      }));
    }
    setIsConfigModalOpen(false);
  };

  // Reset single card to global default
  const handleResetCardToGlobal = () => {
    if (editingCardId !== null) {
      setCardOverrides((prev) => {
        const next = { ...prev };
        delete next[editingCardId];
        return next;
      });
      setIsConfigModalOpen(false);
    }
  };

  // 单独隐藏卡片
  const handleHideSingleCard = (cardId: number, cardName: string) => {
    setManuallyHiddenIds((prev) => {
      if (prev.includes(cardId)) return prev;
      return [...prev, cardId];
    });
    setToastMessage(`已隐藏卡片「${cardName}」`);
    setTimeout(() => {
      setToastMessage((cur) => (cur?.includes(cardName) ? null : cur));
    }, 3500);
  };

  // Global metric definitions for badge display
  const globalPrimaryDef = useMemo(
    () => METRIC_OPTIONS.find((m) => m.key === globalPrimaryMetric) || METRIC_OPTIONS[14],
    [globalPrimaryMetric]
  );
  const globalSecondaryDef = useMemo(
    () => METRIC_OPTIONS.find((m) => m.key === globalSecondaryMetric) || METRIC_OPTIONS[1],
    [globalSecondaryMetric]
  );
  const globalPieDef = useMemo(
    () => METRIC_OPTIONS.find((m) => m.key === globalPieMetric) || METRIC_OPTIONS[7],
    [globalPieMetric]
  );

  // Temp metric definitions for the modal condition tab
  const tempPrimaryDef = useMemo(
    () => METRIC_OPTIONS.find((m) => m.key === tempPrimary) || METRIC_OPTIONS[14],
    [tempPrimary]
  );
  const tempSecondaryDef = useMemo(
    () => METRIC_OPTIONS.find((m) => m.key === tempSecondary) || METRIC_OPTIONS[1],
    [tempSecondary]
  );
  const tempPieDef = useMemo(
    () => METRIC_OPTIONS.find((m) => m.key === tempPie) || METRIC_OPTIONS[7],
    [tempPie]
  );

  // Helper: check if a node triggers current condition rules
  const getConditionRuleTriggerReason = (node: NodeMetrics, condition: MultiHideCondition) => {
    if (!condition.masterEnabled) return null;

    if (
      condition.primaryRule.enabled &&
      checkNodeMeetsCondition(node, globalPrimaryMetric, condition.primaryRule.operator, condition.primaryRule.threshold)
    ) {
      const val = node[globalPrimaryMetric];
      return `主要指标「${globalPrimaryDef.name}」${condition.primaryRule.operator} ${condition.primaryRule.threshold}${globalPrimaryDef.unit} (实际值: ${val}${globalPrimaryDef.unit})`;
    }

    if (
      condition.secondaryRule.enabled &&
      checkNodeMeetsCondition(node, globalSecondaryMetric, condition.secondaryRule.operator, condition.secondaryRule.threshold)
    ) {
      const val = node[globalSecondaryMetric];
      return `次要指标「${globalSecondaryDef.name}」${condition.secondaryRule.operator} ${condition.secondaryRule.threshold}${globalSecondaryDef.unit} (实际值: ${val}${globalSecondaryDef.unit})`;
    }

    if (
      condition.pieRule.enabled &&
      checkNodeMeetsCondition(node, globalPieMetric, condition.pieRule.operator, condition.pieRule.threshold)
    ) {
      const val = node[globalPieMetric];
      return `饼图指标「${globalPieDef.name}」${condition.pieRule.operator} ${condition.pieRule.threshold}${globalPieDef.unit} (实际值: ${val}${globalPieDef.unit})`;
    }

    return null;
  };

  // Check if node is hidden by condition or manually
  const getNodeHiddenStatus = (node: NodeMetrics, conditionToUse: MultiHideCondition = hideCondition) => {
    // 1. Condition check has priority
    const conditionReason = getConditionRuleTriggerReason(node, conditionToUse);
    if (conditionReason) {
      return {
        isHidden: true,
        reason: conditionReason,
        type: 'condition' as const,
        isConditionActive: true,
      };
    }

    // 2. Manually hidden check
    if (manuallyHiddenIds.includes(node.id)) {
      return {
        isHidden: true,
        reason: '手动单独隐藏',
        type: 'manual' as const,
        isConditionActive: false,
      };
    }

    return { isHidden: false, reason: null, type: null, isConditionActive: false };
  };

  // Restore single card
  const handleRestoreCard = (node: NodeMetrics) => {
    const status = getNodeHiddenStatus(node, hideCondition);

    // If condition hiding is enabled and this card meets the rule, trigger alert!
    if (hideCondition.masterEnabled && status.isConditionActive) {
      setUnrestorableAlert({
        open: true,
        cardName: node.name,
        reason: status.reason || '满足当前条件隐藏规则',
      });
      return;
    }

    // Otherwise, this card is manually hidden and can be restored:
    setManuallyHiddenIds((prev) => prev.filter((id) => id !== node.id));
    setToastMessage(`已恢复显示卡片「${node.name}」`);
    setTimeout(() => {
      setToastMessage((cur) => (cur?.includes(node.name) ? null : cur));
    }, 3500);
  };

  // Restore all hidden cards
  const handleRestoreAllHidden = () => {
    if (hideCondition.masterEnabled) {
      const conditionTriggeredCount = INITIAL_NODES.filter((n) =>
        getConditionRuleTriggerReason(n, hideCondition)
      ).length;

      if (conditionTriggeredCount > 0) {
        setManuallyHiddenIds([]);
        setUnrestorableAlert({
          open: true,
          cardName: '条件匹配的卡片',
          reason: `当前存在 ${conditionTriggeredCount} 个卡片符合条件隐藏规则。条件隐藏开关处于开启状态，这些卡片不可直接恢复显示。`,
        });
        return;
      }
    }

    setManuallyHiddenIds([]);
    setToastMessage('已恢复所有隐藏的卡片');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get effective configuration for a given card
  const getCardConfig = (cardId: number) => {
    const override = cardOverrides[cardId];
    return {
      primary: override?.primaryMetric || globalPrimaryMetric,
      secondary: override?.secondaryMetric || globalSecondaryMetric,
      pie: override?.pieMetric || globalPieMetric,
      isCustom: !!override,
    };
  };

  // List of all currently hidden cards
  const allHiddenNodes = useMemo(() => {
    return INITIAL_NODES.map((node) => ({
      node,
      status: getNodeHiddenStatus(node),
    })).filter((item) => item.status.isHidden);
  }, [manuallyHiddenIds, hideCondition, globalPrimaryMetric, globalSecondaryMetric, globalPieMetric]);

  const hiddenCount = allHiddenNodes.length;

  // Total alert count
  const alertNodesCount = useMemo(() => {
    return INITIAL_NODES.filter((n) => n.blockStatus === 'red' || n.isAlert).length;
  }, []);

  // Filter & Sort Nodes for Main Grid
  const displayedNodes = useMemo(() => {
    let result = [...INITIAL_NODES];

    // Filter out hidden cards
    result = result.filter((n) => !getNodeHiddenStatus(n).isHidden);

    // Filter by alerts
    if (onlyAlerts) {
      result = result.filter((n) => n.blockStatus === 'red' || n.isAlert);
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.topologyId.toLowerCase().includes(q)
      );
    }

    // Sort according to global primary metric or selected sort option
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'id_desc':
          return b.id - a.id;
        case 'id_asc':
          return a.id - b.id;
        case 'primary_desc':
          return (b[globalPrimaryMetric] as number) - (a[globalPrimaryMetric] as number);
        case 'primary_asc':
          return (a[globalPrimaryMetric] as number) - (b[globalPrimaryMetric] as number);
        case 'name_asc':
          return a.name.localeCompare(b.name, 'zh-Hans-CN');
        default:
          return 0;
      }
    });

    return result;
  }, [onlyAlerts, searchQuery, sortOrder, globalPrimaryMetric, manuallyHiddenIds, hideCondition]);

  const editingCardName = useMemo(() => {
    if (editingCardId === null) return '全局';
    return INITIAL_NODES.find((n) => n.id === editingCardId)?.name || '卡片';
  }, [editingCardId]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#18191c] font-sans text-gray-800 select-none">
      {/* Top Header Bar */}
      <header className="flex h-[38px] w-full shrink-0 items-center justify-between bg-[#141518] px-3 border-b border-[#24252a]">
        <div className="flex items-center space-x-2">
          <span className="text-[17px] font-bold tracking-wider text-white font-mono">
            NGPM
          </span>
        </div>

        <div className="flex items-center space-x-3 text-gray-300">
          <button
            type="button"
            className="flex items-center justify-center p-1 text-gray-400 hover:text-white"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-1 text-gray-400 hover:text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center space-x-1.5 pl-1">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-600/60 text-gray-300">
              <User className="h-3 w-3" />
            </div>
            <span className="text-[12px] text-gray-200">admin</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="flex w-[40px] shrink-0 flex-col items-center bg-[#191a1e] py-1 border-r border-[#26282f] text-gray-400">
          <div className="flex h-7 w-full items-center justify-center border-b border-[#26282f]/60 text-gray-400 hover:text-gray-200 cursor-pointer">
            <ChevronLeft className="h-3.5 w-3.5" />
          </div>

          <div className="flex flex-col items-center space-y-3.5 pt-3">
            <div className="cursor-pointer hover:text-white">
              <Search className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <BarChart2 className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Cloud className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Network className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Bell className="h-3.5 w-3.5" />
            </div>
            <div className="relative flex h-6 w-6 items-center justify-center rounded text-white bg-white/15 cursor-pointer">
              <Crosshair className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Server className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Cpu className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <LayoutGrid className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Film className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <Monitor className="h-3.5 w-3.5" />
            </div>
            <div className="cursor-pointer hover:text-white">
              <HardDrive className="h-3.5 w-3.5" />
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#edf0f5]">
          {/* Breadcrumb Bar */}
          <div className="flex h-[36px] w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3">
            <div className="flex items-center space-x-1.5">
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-[#fa8c16]">
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-gray-800">
                监控中心
              </span>
            </div>

            {/* Toast Notification message if any */}
            {toastMessage && (
              <div className="flex items-center space-x-2 rounded bg-blue-50 px-2.5 py-0.5 text-[11px] text-[#1677ff] border border-blue-200 animate-fadeIn">
                <span>{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* White Card Section inside Page Body */}
          <div className="flex flex-1 flex-col overflow-y-auto p-2.5">
            <div className="flex min-h-full flex-1 flex-col justify-between rounded-[2px] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-gray-200/80">
              {/* Upper Section */}
              <div className="flex flex-col">
                {/* Top Control Bar (Requirement 1: 去掉图中所示部分内容，把时间放在最左边，在右上角配置前加一个搜索图标按钮，点击按钮后出现完整的搜索框) */}
                <div className="flex h-[36px] w-full items-center justify-between rounded-[2px] bg-[#f5f7fa] px-3">
                  {/* Left: Time (放在最左边) */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-[#1677ff] to-[#69c0ff] opacity-80" />
                      <div className="absolute top-[2px] right-[2px] h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <span className="text-[12px] font-normal text-gray-700 font-mono tracking-tight">
                      2026-10-15 17:26 ~ 2026-10-15 17:41
                    </span>

                    {/* Active Alert filter indicator tag if turned on via config tab */}
                    {onlyAlerts && (
                      <span className="ml-2 rounded bg-red-50 px-2 py-0.5 text-[10px] text-red-600 border border-red-200 font-medium flex items-center space-x-1">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span>仅显示告警应用中</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Search Icon Button (expandable) & Global Config Button */}
                  <div className="flex items-center space-x-2">
                    {/* Expandable Search Input (Requirement 1) */}
                    {isSearchOpen ? (
                      <div className="relative flex items-center animate-fadeIn">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                          <Search className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="请输入内容"
                          className="h-[28px] w-[210px] rounded-[2px] border border-[#d9d9d9] bg-white pl-8 pr-7 text-[12px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4096ff]"
                        />
                        {searchQuery ? (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-6 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                            title="清空"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="ml-1 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                          title="收起搜索框"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="flex h-[28px] w-[28px] items-center justify-center rounded-[2px] border border-gray-200 bg-white text-gray-500 hover:border-[#4096ff] hover:text-[#1677ff] transition-colors cursor-pointer shadow-2xs"
                        title="搜索应用"
                      >
                        <Search className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Global Configuration Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenGlobalConfig('metrics')}
                      className="flex items-center space-x-1 rounded-[2px] bg-[#0090ff] px-2.5 py-1 text-[12px] font-normal text-white shadow-xs hover:bg-[#007fe0] transition-colors cursor-pointer active:scale-98"
                      title="全局配置参数及隐藏规则"
                    >
                      <Settings className="h-3 w-3" />
                      <span>配置</span>
                    </button>
                  </div>
                </div>

                {/* Grid of 5 Cards per row (Clean mt-3 spacing with old standalone search bar removed) */}
                <div className="grid grid-cols-5 gap-3 mt-3">
                  {displayedNodes.map((node) => {
                    const cardConfig = getCardConfig(node.id);
                    const pDef = METRIC_OPTIONS.find((m) => m.key === cardConfig.primary) || globalPrimaryDef;
                    const sDef = METRIC_OPTIONS.find((m) => m.key === cardConfig.secondary) || globalSecondaryDef;
                    const pieDef = METRIC_OPTIONS.find((m) => m.key === cardConfig.pie) || globalPieDef;

                    const primaryVal = node[cardConfig.primary] as number;
                    const secondaryVal = node[cardConfig.secondary] as number;
                    const pieVal = node[cardConfig.pie] as number;

                    const pFormatted = formatMetricValue(primaryVal, cardConfig.primary);
                    const sFormatted = formatMetricValue(secondaryVal, cardConfig.secondary);

                    return (
                      <div
                        key={node.id}
                        className={`group relative flex flex-col justify-between rounded-[3px] border bg-white p-3 transition-all ${
                          cardConfig.isCustom
                            ? 'border-[#91caff] shadow-[0_1px_4px_rgba(22,119,255,0.08)]'
                            : 'border-[#bce0fd]'
                        } hover:border-[#1677ff] hover:shadow-[0_2px_10px_rgba(22,119,255,0.15)]`}
                      >
                        {/* Card Header: Title + Hover Action Buttons (Hide & Config) */}
                        <div className="flex h-5 items-center justify-between border-b border-gray-100 pb-1.5">
                          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                            <span
                              className="truncate text-[13px] font-semibold text-[#096dd9]"
                              title={node.name}
                            >
                              {node.name}
                            </span>
                            {/* Custom config indicator tag */}
                            {cardConfig.isCustom && (
                              <span
                                className="shrink-0 rounded bg-blue-50 px-1 py-[1px] text-[9px] text-[#1677ff] border border-blue-200"
                                title="该卡片已单独定制配置参数"
                              >
                                定制
                              </span>
                            )}
                          </div>

                          {/* Hover Action Buttons */}
                          <div className="shrink-0 flex items-center space-x-1">
                            {/* 单独隐藏按钮 */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHideSingleCard(node.id, node.name);
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-[2px] text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                              title="单独隐藏此卡片"
                            >
                              <EyeOff className="h-3.5 w-3.5" />
                            </button>

                            {/* 单独配置按钮 */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCardConfig(node.id);
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-[2px] text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-[#e6f4ff] hover:text-[#1677ff] transition-all cursor-pointer"
                              title="配置该卡片展示参数"
                            >
                              <Settings className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Middle Content: Metrics + Donut Pie Display */}
                        <div className="my-2.5 flex items-center justify-between gap-2 px-0.5">
                          {/* Left: Primary & Secondary Metric */}
                          <div className="flex flex-col flex-1 min-w-0">
                            {/* Primary Metric Value */}
                            <div className="flex items-baseline font-bold text-gray-800">
                              <span className="text-[23px] tracking-tight leading-tight">
                                {pFormatted.valStr}
                              </span>
                              <span className="ml-1 text-[13px] font-normal text-gray-500">
                                {pFormatted.unitStr}
                              </span>
                            </div>

                            {/* Primary Metric Name */}
                            <div className="truncate text-[11px] text-gray-500 mt-0.5">
                              {pDef.name}
                            </div>

                            {/* Secondary Metric Info Tag */}
                            <div className="mt-1.5 flex items-center space-x-1 rounded bg-[#f6f8fa] px-1.5 py-0.5 text-[10px] text-gray-600 border border-gray-100 max-w-fit truncate">
                              <span className="text-gray-400 truncate">
                                {sDef.name}:
                              </span>
                              <span className="font-semibold text-gray-700">
                                {sFormatted.valStr}
                                {sFormatted.unitStr}
                              </span>
                            </div>
                          </div>

                          {/* Right: Pie Chart Metric */}
                          <div className="flex flex-col items-center shrink-0 pl-1">
                            <MiniPieChart
                              value={pieVal}
                              metricKey={cardConfig.pie}
                              status={node.blockStatus}
                            />
                            <span
                              className="mt-1 text-[9px] text-gray-400 max-w-[54px] truncate text-center"
                              title={pieDef.name}
                            >
                              {pieDef.name}
                            </span>
                          </div>
                        </div>

                        {/* Bottom: 15 Status Timeline Blocks */}
                        <div className="mt-1 pt-1.5 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center space-x-[2.5px] w-full justify-between">
                            {Array.from({ length: 15 }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-[8px] flex-1 rounded-[1px] transition-colors ${
                                  node.blockStatus === 'green'
                                    ? 'bg-[#00c02e]'
                                    : node.blockStatus === 'red'
                                    ? 'bg-[#f53f3f]'
                                    : 'bg-[#d9d9d9]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {displayedNodes.length === 0 && (
                  <div className="py-16 text-center text-gray-400 text-xs">
                    <EyeOff className="mx-auto mb-2 h-7 w-7 text-gray-300" />
                    <div>所有卡片均已被隐藏或筛选过滤</div>
                    {hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenGlobalConfig('hiddenList')}
                        className="mt-2 text-xs text-[#1677ff] hover:underline cursor-pointer block mx-auto"
                      >
                        打开隐藏列表管理卡片 (共 {hiddenCount} 个隐藏)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Pagination Pill */}
              <div className="mt-8 mb-2 flex justify-center">
                <div className="flex items-center space-x-2 rounded-full bg-[#4a4e57] px-3 py-1 text-[11px] text-white shadow-xs">
                  <button
                    type="button"
                    className="hover:text-gray-300 cursor-pointer"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <span className="font-mono px-1">1/1</span>
                  <button
                    type="button"
                    className="hover:text-gray-300 cursor-pointer"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Configuration Modal Dialog with 4 Tabs */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px]">
          <div className="w-[520px] max-h-[92vh] overflow-hidden rounded-[4px] bg-white shadow-2xl flex flex-col transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-[15px] font-medium text-gray-900">配置</span>
                {editingCardId !== null && (
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-normal text-[#1677ff] border border-blue-200">
                    单卡片: {editingCardName}
                  </span>
                )}
                {editingCardId === null && (
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-normal text-gray-600">
                    全局设置
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs Header (Requirement 2: 配置tab中增加一个tab，放置仅显示告警应用) */}
            {editingCardId === null ? (
              <div className="flex border-b border-gray-200 bg-[#f9fafb] px-5">
                <button
                  type="button"
                  onClick={() => setModalTab('metrics')}
                  className={`flex items-center space-x-1.5 py-2.5 px-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                    modalTab === 'metrics'
                      ? 'border-[#1677ff] text-[#1677ff] bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>指标配置</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('condition')}
                  className={`flex items-center space-x-1.5 py-2.5 px-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                    modalTab === 'condition'
                      ? 'border-[#1677ff] text-[#1677ff] bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>条件隐藏卡片</span>
                  {tempHideCondition.masterEnabled && (
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  )}
                </button>

                {/* Requirement 2: 告警应用 Tab (仅显示告警应用勾选开启按钮放置于此) */}
                <button
                  type="button"
                  onClick={() => setModalTab('alerts')}
                  className={`flex items-center space-x-1.5 py-2.5 px-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                    modalTab === 'alerts'
                      ? 'border-[#1677ff] text-[#1677ff] bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>告警应用</span>
                  {tempOnlyAlerts && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('hiddenList')}
                  className={`flex items-center space-x-1.5 py-2.5 px-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                    modalTab === 'hiddenList'
                      ? 'border-[#1677ff] text-[#1677ff] bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>隐藏列表</span>
                  {hiddenCount > 0 && (
                    <span className="rounded-full bg-red-100 px-1.5 py-[1px] text-[10px] font-bold text-red-600">
                      {hiddenCount}
                    </span>
                  )}
                </button>
              </div>
            ) : null}

            {/* Modal Body with Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Tab 1: 指标配置 */}
              {modalTab === 'metrics' && (
                <div className="space-y-4">
                  {/* 主要指标 */}
                  <CustomSelect
                    label="主要指标"
                    value={tempPrimary}
                    options={METRIC_OPTIONS.map((m) => ({ key: m.key, name: m.name }))}
                    onChange={(val) => setTempPrimary(val as MetricKey)}
                  />

                  {/* 次要指标 */}
                  <CustomSelect
                    label="次要指标"
                    value={tempSecondary}
                    options={METRIC_OPTIONS.map((m) => ({ key: m.key, name: m.name }))}
                    onChange={(val) => setTempSecondary(val as MetricKey)}
                  />

                  {/* 饼图指标 */}
                  <CustomSelect
                    label="饼图指标"
                    value={tempPie}
                    options={METRIC_OPTIONS.map((m) => ({ key: m.key, name: m.name }))}
                    onChange={(val) => setTempPie(val as MetricKey)}
                  />

                  {/* 排序方式 */}
                  {editingCardId === null && (
                    <CustomSelect
                      label="排序方式"
                      value={tempSort}
                      options={SORT_OPTIONS}
                      onChange={(val) => setTempSort(val)}
                    />
                  )}
                </div>
              )}

              {/* Tab 2: 条件隐藏卡片 */}
              {modalTab === 'condition' && editingCardId === null && (
                <div className="space-y-4">
                  {/* 条件隐藏卡片启动单独使用开关展示 */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-[#1677ff]" />
                      <span className="text-[14px] font-medium text-gray-800">
                        条件隐藏卡片
                      </span>
                    </div>

                    {/* 启动 Switch 开关 */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tempHideCondition.masterEnabled}
                      onClick={() =>
                        setTempHideCondition((prev) => ({
                          ...prev,
                          masterEnabled: !prev.masterEnabled,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        tempHideCondition.masterEnabled ? 'bg-[#1677ff]' : 'bg-gray-300'
                      }`}
                      title={tempHideCondition.masterEnabled ? '已开启条件隐藏' : '已关闭条件隐藏'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          tempHideCondition.masterEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 默认直接展示配置中的3个指标名称及条件与值 */}
                  <div className={`space-y-3 transition-opacity ${tempHideCondition.masterEnabled ? 'opacity-100' : 'opacity-60'}`}>
                    <div className="text-[12px] text-gray-500 mb-2">
                      获取自「指标配置」中的三个指标，设置条件与阈值后，触发即隐藏对应卡片：
                    </div>

                    {/* 1. 主要指标行 */}
                    <div className="flex items-center space-x-2.5 rounded-[3px] border border-gray-200 bg-[#fbfcfd] p-2.5">
                      <label className="flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={tempHideCondition.primaryRule.enabled}
                          onChange={(e) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              primaryRule: { ...prev.primaryRule, enabled: e.target.checked },
                            }))
                          }
                          className="h-3.5 w-3.5 rounded-[2px] border-gray-300 text-[#1677ff] focus:ring-0 cursor-pointer"
                        />
                      </label>

                      <div className="w-[125px] shrink-0 truncate flex items-center space-x-1" title={tempPrimaryDef.name}>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-100 shrink-0">
                          主要
                        </span>
                        <span className="text-[13px] font-medium text-gray-800 truncate">
                          {tempPrimaryDef.name}
                        </span>
                      </div>

                      <div className="w-[115px] shrink-0">
                        <CustomSelect
                          value={tempHideCondition.primaryRule.operator}
                          options={OPERATOR_OPTIONS}
                          onChange={(val) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              primaryRule: { ...prev.primaryRule, operator: val as OperatorKey },
                            }))
                          }
                        />
                      </div>

                      <div className="relative flex-1 min-w-0">
                        <input
                          type="number"
                          value={tempHideCondition.primaryRule.threshold}
                          onChange={(e) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              primaryRule: { ...prev.primaryRule, threshold: Number(e.target.value) },
                            }))
                          }
                          className="h-[32px] w-full rounded-[3px] border border-[#d9d9d9] bg-white px-2.5 pr-8 text-[13px] text-gray-800 focus:border-[#4096ff] focus:outline-none"
                          placeholder="数值"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-gray-400">
                          {tempPrimaryDef.unit}
                        </span>
                      </div>
                    </div>

                    {/* 2. 次要指标行 */}
                    <div className="flex items-center space-x-2.5 rounded-[3px] border border-gray-200 bg-[#fbfcfd] p-2.5">
                      <label className="flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={tempHideCondition.secondaryRule.enabled}
                          onChange={(e) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              secondaryRule: { ...prev.secondaryRule, enabled: e.target.checked },
                            }))
                          }
                          className="h-3.5 w-3.5 rounded-[2px] border-gray-300 text-[#1677ff] focus:ring-0 cursor-pointer"
                        />
                      </label>

                      <div className="w-[125px] shrink-0 truncate flex items-center space-x-1" title={tempSecondaryDef.name}>
                        <span className="text-[10px] text-gray-600 bg-gray-100 px-1 py-0.5 rounded border border-gray-200 shrink-0">
                          次要
                        </span>
                        <span className="text-[13px] font-medium text-gray-800 truncate">
                          {tempSecondaryDef.name}
                        </span>
                      </div>

                      <div className="w-[115px] shrink-0">
                        <CustomSelect
                          value={tempHideCondition.secondaryRule.operator}
                          options={OPERATOR_OPTIONS}
                          onChange={(val) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              secondaryRule: { ...prev.secondaryRule, operator: val as OperatorKey },
                            }))
                          }
                        />
                      </div>

                      <div className="relative flex-1 min-w-0">
                        <input
                          type="number"
                          value={tempHideCondition.secondaryRule.threshold}
                          onChange={(e) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              secondaryRule: { ...prev.secondaryRule, threshold: Number(e.target.value) },
                            }))
                          }
                          className="h-[32px] w-full rounded-[3px] border border-[#d9d9d9] bg-white px-2.5 pr-8 text-[13px] text-gray-800 focus:border-[#4096ff] focus:outline-none"
                          placeholder="数值"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-gray-400">
                          {tempSecondaryDef.unit}
                        </span>
                      </div>
                    </div>

                    {/* 3. 饼图指标行 */}
                    <div className="flex items-center space-x-2.5 rounded-[3px] border border-gray-200 bg-[#fbfcfd] p-2.5">
                      <label className="flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={tempHideCondition.pieRule.enabled}
                          onChange={(e) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              pieRule: { ...prev.pieRule, enabled: e.target.checked },
                            }))
                          }
                          className="h-3.5 w-3.5 rounded-[2px] border-gray-300 text-[#1677ff] focus:ring-0 cursor-pointer"
                        />
                      </label>

                      <div className="w-[125px] shrink-0 truncate flex items-center space-x-1" title={tempPieDef.name}>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 shrink-0">
                          饼图
                        </span>
                        <span className="text-[13px] font-medium text-gray-800 truncate">
                          {tempPieDef.name}
                        </span>
                      </div>

                      <div className="w-[115px] shrink-0">
                        <CustomSelect
                          value={tempHideCondition.pieRule.operator}
                          options={OPERATOR_OPTIONS}
                          onChange={(val) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              pieRule: { ...prev.pieRule, operator: val as OperatorKey },
                            }))
                          }
                        />
                      </div>

                      <div className="relative flex-1 min-w-0">
                        <input
                          type="number"
                          value={tempHideCondition.pieRule.threshold}
                          onChange={(e) =>
                            setTempHideCondition((prev) => ({
                              ...prev,
                              pieRule: { ...prev.pieRule, threshold: Number(e.target.value) },
                            }))
                          }
                          className="h-[32px] w-full rounded-[3px] border border-[#d9d9d9] bg-white px-2.5 pr-8 text-[13px] text-gray-800 focus:border-[#4096ff] focus:outline-none"
                          placeholder="数值"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-gray-400">
                          {tempPieDef.unit}
                        </span>
                      </div>
                    </div>

                    {/* Rule Interpretation */}
                    <div className="mt-3 rounded bg-blue-50/80 p-2.5 text-[11px] text-[#0958d9] border border-blue-100">
                      {tempHideCondition.masterEnabled ? (
                        <div>
                          <span className="font-medium">当前触发逻辑：</span>
                          当卡片满足勾选的任一条件时自动隐藏。
                          {tempHideCondition.primaryRule.enabled && (
                            <span className="ml-1">
                              [主要: {tempPrimaryDef.name} {tempHideCondition.primaryRule.operator} {tempHideCondition.primaryRule.threshold}{tempPrimaryDef.unit}]
                            </span>
                          )}
                          {tempHideCondition.secondaryRule.enabled && (
                            <span className="ml-1">
                              [次要: {tempSecondaryDef.name} {tempHideCondition.secondaryRule.operator} {tempHideCondition.secondaryRule.threshold}{tempSecondaryDef.unit}]
                            </span>
                          )}
                          {tempHideCondition.pieRule.enabled && (
                            <span className="ml-1">
                              [饼图: {tempPieDef.name} {tempHideCondition.pieRule.operator} {tempHideCondition.pieRule.threshold}{tempPieDef.unit}]
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          条件隐藏总开关当前处于关闭状态，请点击右上方开关启动。
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: 告警应用 (Requirement 2: 配置tab中增加一个tab，把仅显示告警应用勾选开启按钮放在这个tab中) */}
              {modalTab === 'alerts' && editingCardId === null && (
                <div className="space-y-4">
                  <div className="rounded-[4px] border border-gray-200 bg-[#fbfcfd] p-4">
                    <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                      <div className="flex items-center space-x-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[14px] font-semibold text-gray-800">
                            仅显示告警应用
                          </span>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            开启后大屏仅保留处于异常和告警状态的应用卡片
                          </p>
                        </div>
                      </div>

                      {/* Switch 切换开关 */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={tempOnlyAlerts}
                        onClick={() => setTempOnlyAlerts(!tempOnlyAlerts)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          tempOnlyAlerts ? 'bg-[#1677ff]' : 'bg-gray-300'
                        }`}
                        title={tempOnlyAlerts ? '已开启仅显示告警应用' : '已关闭仅显示告警应用'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            tempOnlyAlerts ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[12px] text-gray-600">
                        <span>系统监控应用总数：</span>
                        <span className="font-semibold text-gray-800">{INITIAL_NODES.length} 个</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-gray-600">
                        <span>当前处于告警状态应用：</span>
                        <span className="font-semibold text-red-600">{alertNodesCount} 个</span>
                      </div>

                      <div className="mt-2.5 rounded bg-amber-50/80 p-2.5 text-[11px] text-amber-800 border border-amber-200">
                        {tempOnlyAlerts ? (
                          <span>
                            已勾选开启：确认后大屏将只保留 <b>{alertNodesCount}</b> 个发生异常与告警的应用（如 External Agency Leased Line、Medium-Risk Assets 等），隐藏其他正常系统。
                          </span>
                        ) : (
                          <span>
                            当前未开启：大屏将同时展示正常应用与告警应用。
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: 隐藏列表 */}
              {modalTab === 'hiddenList' && editingCardId === null && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-[12px] font-medium text-gray-700">
                      已隐藏卡片管理 (共 {allHiddenNodes.length} 个)
                    </span>
                    {allHiddenNodes.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRestoreAllHidden}
                        className="flex items-center space-x-1 text-[12px] text-[#1677ff] hover:underline cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>恢复全部卡片</span>
                      </button>
                    )}
                  </div>

                  {allHiddenNodes.length > 0 ? (
                    <div className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto pr-1">
                      {allHiddenNodes.map(({ node, status }) => {
                        const isConditionProtected = hideCondition.masterEnabled && status.isConditionActive;

                        return (
                          <div
                            key={node.id}
                            className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-50 rounded transition-colors"
                          >
                            <div className="flex flex-col min-w-0 pr-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-[13px] font-medium text-gray-800 truncate">
                                  {node.name}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400">
                                  {node.topologyId}
                                </span>
                                {isConditionProtected && (
                                  <span className="inline-flex items-center space-x-0.5 rounded bg-amber-50 px-1.5 py-[1px] text-[10px] text-amber-700 border border-amber-200">
                                    <Lock className="h-2.5 w-2.5" />
                                    <span>条件生效中</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                                原因: {status.reason}
                              </span>
                            </div>

                            {/* 恢复该卡片按钮 */}
                            <button
                              type="button"
                              onClick={() => handleRestoreCard(node)}
                              className={`shrink-0 flex items-center space-x-1 rounded px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer ${
                                isConditionProtected
                                  ? 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-transparent'
                                  : 'bg-[#e6f4ff] hover:bg-[#bae0ff] text-[#1677ff]'
                              }`}
                              title={isConditionProtected ? '点击查看不可恢复原因' : '恢复此卡片'}
                            >
                              <RotateCw className="h-3 w-3" />
                              <span>恢复显示</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400 text-xs">
                      <Eye className="mx-auto mb-2 h-7 w-7 text-gray-300" />
                      <div>暂无任何隐藏卡片</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        在卡片右上角点击隐藏按钮，或启用条件隐藏后即可在此管理
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex items-center justify-center space-x-3 px-5 py-3 border-t border-gray-100 bg-[#fafafa]">
              {/* If editing individual card and has custom override, allow restoring to global */}
              {editingCardId !== null && cardOverrides[editingCardId] && (
                <button
                  type="button"
                  onClick={handleResetCardToGlobal}
                  className="flex items-center space-x-1 h-[28px] rounded-[3px] border border-gray-200 bg-white px-3 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer mr-2"
                >
                  <RotateCcw className="h-3 w-3 text-gray-400" />
                  <span>恢复全局</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="h-[28px] min-w-[64px] rounded-[3px] bg-[#f0f0f0] px-4 text-[13px] text-gray-700 hover:bg-[#e4e4e4] transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmConfig}
                className="h-[28px] min-w-[64px] rounded-[3px] bg-[#0090ff] px-4 text-[13px] text-white hover:bg-[#007fe0] shadow-xs transition-colors cursor-pointer active:scale-98"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 不可恢复提示弹窗 */}
      {unrestorableAlert.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-[0.5px]">
          <div className="w-[420px] rounded-[4px] bg-white p-5 shadow-2xl border border-gray-100 animate-scaleIn">
            <div className="flex items-start space-x-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-200">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-gray-900">
                  不可恢复提示
                </h4>
                <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
                  当前条件隐藏功能处于开启状态，卡片 <b className="text-gray-900">「{unrestorableAlert.cardName}」</b> 满足设定规则，<b className="text-red-600">不可恢复显示</b>。
                </p>
                <div className="mt-2.5 rounded bg-gray-50 p-2.5 text-[11px] text-gray-600 border border-gray-200/80 leading-snug">
                  <span className="font-semibold text-gray-700">触发规则：</span>
                  {unrestorableAlert.reason}
                </div>
                <p className="mt-2 text-[11px] text-gray-400">
                  若需恢复展示该卡片，请在「条件隐藏卡片」中关闭启动开关或调整对应指标的过滤条件。
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setUnrestorableAlert({ open: false, cardName: '', reason: '' });
                  setModalTab('condition');
                }}
                className="rounded-[3px] bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-[#1677ff] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                前往调整条件
              </button>
              <button
                type="button"
                onClick={() =>
                  setUnrestorableAlert({ open: false, cardName: '', reason: '' })
                }
                className="rounded-[3px] bg-[#0090ff] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#007fe0] transition-colors cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
