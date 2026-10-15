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
  label: string;
  value: string;
  options: { key: string; name: string }[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.key === value) || options[0];

  return (
    <div className="flex items-center">
      <span className="w-[84px] shrink-0 text-right text-[13px] text-[#595959] pr-3">
        {label}
      </span>
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex h-[32px] w-full items-center justify-between rounded-[3px] border bg-white px-3 text-left text-[13px] transition-colors ${
            open ? 'border-[#4096ff] shadow-[0_0_0_2px_rgba(5,145,255,0.1)]' : 'border-[#d9d9d9] hover:border-[#4096ff]'
          }`}
        >
          <span className="truncate text-gray-800">{selectedOption?.name}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
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

  // Custom configuration overrides per card (cardId -> config)
  const [cardOverrides, setCardOverrides] = useState<Record<number, CardCustomConfig>>({});

  // Configuration Modal state
  // editingCardId === null means Global config; editingCardId === number means Single card config
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  // Temporary Form States for Modal
  const [tempPrimary, setTempPrimary] = useState<MetricKey>('connSuccessRate');
  const [tempSecondary, setTempSecondary] = useState<MetricKey>('netLatency');
  const [tempPie, setTempPie] = useState<MetricKey>('lossRate');
  const [tempSort, setTempSort] = useState<string>('id_desc');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAlerts, setOnlyAlerts] = useState(false);

  // Open Global Config Modal
  const handleOpenGlobalConfig = () => {
    setEditingCardId(null);
    setTempPrimary(globalPrimaryMetric);
    setTempSecondary(globalSecondaryMetric);
    setTempPie(globalPieMetric);
    setTempSort(sortOrder);
    setIsConfigModalOpen(true);
  };

  // Open Single Card Config Modal
  const handleOpenCardConfig = (cardId: number) => {
    setEditingCardId(cardId);
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

  // Filter & Sort Nodes
  const displayedNodes = useMemo(() => {
    let result = [...INITIAL_NODES];

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
  }, [onlyAlerts, searchQuery, sortOrder, globalPrimaryMetric]);

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
          <div className="flex h-[36px] w-full shrink-0 items-center border-b border-gray-200 bg-white px-3">
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
          </div>

          {/* White Card Section inside Page Body */}
          <div className="flex flex-1 flex-col overflow-y-auto p-2.5">
            <div className="flex min-h-full flex-1 flex-col justify-between rounded-[2px] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-gray-200/80">
              {/* Upper Section */}
              <div className="flex flex-col">
                {/* Top Control Bar */}
                <div className="flex h-[34px] w-full items-center justify-between rounded-[2px] bg-[#f5f7fa] px-3">
                  {/* Current Active Global Config Summary Badges */}
                  <div className="flex items-center space-x-1.5 text-[11px] text-gray-500">
                    <span className="text-[11px] font-medium text-gray-400 mr-0.5">
                      全局配置:
                    </span>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[#1677ff] border border-blue-100">
                      主: {globalPrimaryDef.name}
                    </span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">
                      次: {globalSecondaryDef.name}
                    </span>
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 border border-amber-100">
                      饼图: {globalPieDef.name}
                    </span>
                  </div>

                  {/* Centered Time Range */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-[#1677ff] to-[#69c0ff] opacity-80" />
                      <div className="absolute top-[2px] right-[2px] h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <span className="text-[12px] font-normal text-gray-700 font-mono tracking-tight">
                      2026-10-15 17:26 ~ 2026-10-15 17:41
                    </span>
                  </div>

                  {/* Right Controls: Checkbox & Global Config Button */}
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyAlerts}
                        onChange={(e) => setOnlyAlerts(e.target.checked)}
                        className="h-3.5 w-3.5 rounded-[2px] border-gray-300 text-[#1677ff] focus:ring-0 cursor-pointer"
                      />
                      <span className="text-[12px] text-gray-600">
                        仅显示告警应用
                      </span>
                    </label>

                    {/* Global Configuration Button */}
                    <button
                      type="button"
                      onClick={handleOpenGlobalConfig}
                      className="flex items-center space-x-1 rounded-[2px] bg-[#0090ff] px-2.5 py-1 text-[12px] font-normal text-white shadow-xs hover:bg-[#007fe0] transition-colors cursor-pointer active:scale-98"
                      title="全局配置参数"
                    >
                      <Settings className="h-3 w-3" />
                      <span>配置</span>
                    </button>
                  </div>
                </div>

                {/* Centered Search Bar */}
                <div className="my-3 flex justify-center">
                  <div className="relative w-[420px]">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                      <Search className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="请输入内容"
                      className="h-[28px] w-full rounded-[2px] border border-[#d9d9d9] bg-white pl-8 pr-7 text-[12px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4096ff]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Requirement 1: 一行展示5个卡片 (grid-cols-5) */}
                <div className="grid grid-cols-5 gap-3">
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
                        {/* Card Header: Title + Hover Config Button */}
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

                          {/* Requirement 3: 鼠标移入卡片，卡片右上角展示配置按钮 (移除了TOP排序标签) */}
                          <div className="shrink-0 flex items-center">
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
                    暂无符合条件的指标监控应用
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

      {/* Configuration Modal Dialog (Supported for Global & Individual Card) */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px]">
          <div className="w-[460px] rounded-[4px] bg-white p-5 shadow-2xl transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-[15px] font-medium text-gray-900">配置</span>
                {editingCardId !== null && (
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-normal text-[#1677ff] border border-blue-200">
                    单卡片: {editingCardName}
                  </span>
                )}
                {editingCardId === null && (
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-normal text-gray-600">
                    全局默认
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

            {/* Modal Form Fields */}
            <div className="space-y-4 py-2">
              {/* 1. 主要指标 */}
              <CustomSelect
                label="主要指标"
                value={tempPrimary}
                options={METRIC_OPTIONS.map((m) => ({ key: m.key, name: m.name }))}
                onChange={(val) => setTempPrimary(val as MetricKey)}
              />

              {/* 2. 次要指标 */}
              <CustomSelect
                label="次要指标"
                value={tempSecondary}
                options={METRIC_OPTIONS.map((m) => ({ key: m.key, name: m.name }))}
                onChange={(val) => setTempSecondary(val as MetricKey)}
              />

              {/* 3. 饼图指标 */}
              <CustomSelect
                label="饼图指标"
                value={tempPie}
                options={METRIC_OPTIONS.map((m) => ({ key: m.key, name: m.name }))}
                onChange={(val) => setTempPie(val as MetricKey)}
              />

              {/* 4. 排序方式 (全局配置时可调整) */}
              {editingCardId === null && (
                <CustomSelect
                  label="排序方式"
                  value={tempSort}
                  options={SORT_OPTIONS}
                  onChange={(val) => setTempSort(val)}
                />
              )}
            </div>

            {/* Modal Footer Buttons */}
            <div className="mt-7 flex items-center justify-center space-x-3">
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
    </div>
  );
}
