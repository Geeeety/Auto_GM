import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  AreaChart,
  BarChart3,
  Bell,
  Bot,
  CandlestickChart,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Gauge,
  LayoutDashboard,
  ListChecks,
  PlayCircle,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  SlidersHorizontal,
  TerminalSquare,
} from 'lucide-react'
import {
  Area,
  AreaChart as ReAreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchDashboardData } from './api/client'
import { fallbackDashboardData } from './api/mockFallback'
import type {
  BacktestMetric,
  DashboardData,
  DataQualityItem,
  RiskEvent,
  StrategyParameter,
  StrategyStatus,
  Tone,
} from './api/types'
import './App.css'

type PageId =
  | 'overview'
  | 'data'
  | 'strategies'
  | 'backtest'
  | 'paper'
  | 'risk'
  | 'logs'

type IconComponent = typeof LayoutDashboard

type NavItem = {
  id: PageId
  label: string
  icon: IconComponent
}

const navItems: NavItem[] = [
  { id: 'overview', label: '总览', icon: LayoutDashboard },
  { id: 'data', label: '数据中心', icon: Database },
  { id: 'strategies', label: '策略实验室', icon: Bot },
  { id: 'backtest', label: '回测中心', icon: BarChart3 },
  { id: 'paper', label: '模拟交易', icon: PlayCircle },
  { id: 'risk', label: '风控中心', icon: ShieldCheck },
  { id: 'logs', label: '系统日志', icon: TerminalSquare },
]

const metricIcons: Record<string, IconComponent> = {
  equity: CircleDollarSign,
  daily_pnl: AreaChart,
  strategies: Bot,
  risk: ShieldCheck,
}

const chartColors: Record<Tone, string> = {
  green: '#16a34a',
  blue: '#2563eb',
  amber: '#d97706',
  red: '#dc2626',
  neutral: '#64748b',
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('overview')
  const [dashboardData, setDashboardData] = useState<DashboardData>(fallbackDashboardData)
  const [apiSource, setApiSource] = useState<'loading' | 'api' | 'fallback'>('loading')
  const [apiError, setApiError] = useState<string | undefined>()

  const activeLabel = navItems.find((item) => item.id === activePage)?.label ?? '总览'

  const applyDashboardResult = useCallback((result: Awaited<ReturnType<typeof fetchDashboardData>>) => {
    setDashboardData(result.data)
    setApiSource(result.source)
    setApiError(result.error)
  }, [])

  const loadDashboard = useCallback(async () => {
    setApiSource('loading')
    const result = await fetchDashboardData()
    applyDashboardResult(result)
  }, [applyDashboardResult])

  useEffect(() => {
    let active = true

    void fetchDashboardData().then((result) => {
      if (active) {
        applyDashboardResult(result)
      }
    })

    return () => {
      active = false
    }
  }, [applyDashboardResult])

  const statusText = useMemo(() => {
    if (apiSource === 'loading') return '加载中'
    if (apiSource === 'api') return 'API 已连接'
    return '本地兜底'
  }, [apiSource])

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="主导航">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="brand-name">Auto_GM</p>
            <p className="brand-subtitle">Quant Console</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id
            return (
              <button
                className={`nav-button ${active ? 'is-active' : ''}`}
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                title={item.label}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className={`status-dot ${apiSource === 'fallback' ? 'is-fallback' : ''}`} />
          <span>{statusText}</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">第一周 · 第四/五步</p>
            <h1>{activeLabel}</h1>
            {apiError && <p className="api-note">后端未连接，当前显示本地兜底数据：{apiError}</p>}
          </div>
          <div className="topbar-actions">
            <div className={`mode-chip source-${apiSource}`}>
              <Gauge size={16} strokeWidth={1.8} />
              <span>{statusText}</span>
            </div>
            <button className="icon-button" type="button" title="重新加载数据" onClick={loadDashboard}>
              <RefreshCw size={18} strokeWidth={1.8} />
            </button>
            <button className="icon-button" type="button" title="通知">
              <Bell size={18} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {activePage === 'overview' && <OverviewPage data={dashboardData} />}
        {activePage === 'data' && <DataCenterPage data={dashboardData} />}
        {activePage === 'strategies' && <StrategyLabPage data={dashboardData} />}
        {activePage === 'backtest' && <BacktestPage data={dashboardData} />}
        {activePage === 'paper' && <PaperTradingPage data={dashboardData} />}
        {activePage === 'risk' && <RiskCenterPage data={dashboardData} />}
        {activePage === 'logs' && <LogsPage data={dashboardData} source={apiSource} />}
      </main>
    </div>
  )
}

function OverviewPage({ data }: { data: DashboardData }) {
  return (
    <div className="page-grid">
      <section className="metric-grid" aria-label="系统总览指标">
        {data.overview.metrics.map((metric) => {
          const Icon = metricIcons[metric.key] ?? Activity
          return (
            <MetricCard
              icon={Icon}
              key={metric.key}
              label={metric.label}
              value={metric.value}
              meta={metric.meta}
              tone={metric.tone}
            />
          )
        })}
      </section>

      <section className="panel panel-large">
        <PanelHeader icon={AreaChart} title="权益曲线" meta="API / 7 days" />
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <ReAreaChart data={data.overview.equity_curve} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="equityFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                width={64}
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="equity" stroke="#15803d" strokeWidth={2.5} fill="url(#equityFill)" />
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={ListChecks} title="策略状态" meta={`${data.strategies.strategies.length} strategies`} />
        <StrategyTable compact strategies={data.strategies.strategies} />
      </section>

      <section className="panel">
        <PanelHeader icon={AlertTriangle} title="最近风控" meta="API events" />
        <RiskEventList events={data.risk.events} />
      </section>
    </div>
  )
}

function DataCenterPage({ data }: { data: DashboardData }) {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={CandlestickChart} title="行情快照" meta={`${data.market.symbol} · ${data.market.timeframe}`} />
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <ComposedChart data={data.market.bars} margin={{ top: 12, right: 18, bottom: 2, left: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                yAxisId="price"
                domain={['dataMin - 1', 'dataMax + 1']}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis yAxisId="volume" orientation="right" hide />
              <Tooltip />
              <Bar yAxisId="volume" dataKey="volume" barSize={14} fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              <Line yAxisId="price" type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={Database} title="数据质量" meta={data.market.source} />
        <QualityStack items={data.market.quality} />
      </section>
    </div>
  )
}

function StrategyLabPage({ data }: { data: DashboardData }) {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={Bot} title="策略列表" meta="API strategies" />
        <StrategyTable strategies={data.strategies.strategies} />
      </section>
      <section className="panel">
        <PanelHeader icon={SlidersHorizontal} title="参数预览" meta={data.strategies.active_strategy} />
        <ParameterList parameters={data.strategies.parameters} />
      </section>
    </div>
  )
}

function BacktestPage({ data }: { data: DashboardData }) {
  const chartData = data.backtest.metrics.map((metric) => ({
    ...metric,
    color: chartColors[metric.tone],
  }))

  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader
          icon={BarChart3}
          title="回测摘要"
          meta={`${data.backtest.strategy} · ${data.backtest.symbol}`}
        />
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <BarChart data={chartData} margin={{ top: 18, right: 18, bottom: 2, left: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 2, 2]}>
                {chartData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={ScrollText} title="核心指标" meta={`${formatCurrency(data.backtest.initial_cash)} initial`} />
        <BacktestMetricList metrics={data.backtest.metrics} />
      </section>
    </div>
  )
}

function PaperTradingPage({ data }: { data: DashboardData }) {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={PlayCircle} title="模拟账户" meta="paper mode" />
        <div className="account-strip">
          <MetricCard
            icon={CircleDollarSign}
            label="模拟权益"
            value={formatCurrency(data.overview.equity)}
            meta={`${data.overview.daily_pnl_percent >= 0 ? '+' : ''}${data.overview.daily_pnl_percent}%`}
            tone="green"
          />
          <MetricCard icon={Activity} label="未成交订单" value="2" meta="1 个限价单" tone="amber" />
          <MetricCard icon={CheckCircle2} label="今日成交" value="6" meta="手续费 $12" tone="blue" />
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={ListChecks} title="订单队列" meta="using risk mock" />
        <RiskEventList events={data.risk.events} />
      </section>
    </div>
  )
}

function RiskCenterPage({ data }: { data: DashboardData }) {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={ShieldCheck} title="风控规则" meta={data.risk.status} />
        <div className="rule-grid">
          {data.risk.rules.map((rule) => (
            <RuleCard key={rule.title} title={rule.title} value={rule.value} status={rule.status_label} />
          ))}
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={AlertTriangle} title="拦截记录" meta="today" />
        <RiskEventList events={data.risk.events} />
      </section>
    </div>
  )
}

function LogsPage({ data, source }: { data: DashboardData; source: 'loading' | 'api' | 'fallback' }) {
  return (
    <section className="panel">
      <PanelHeader icon={TerminalSquare} title="系统日志" meta={source === 'api' ? 'backend API' : 'local fallback'} />
      <div className="log-table">
        {data.logs.logs.map((item) => (
          <div className="log-row" key={`${item.time}-${item.message}`}>
            <span className="mono">{item.time}</span>
            <span>{item.module}</span>
            <span className={`log-level ${item.level}`}>{item.level}</span>
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  meta,
  tone,
}: {
  icon: IconComponent
  label: string
  value: string
  meta: string
  tone: Tone
}) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-icon">
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div>
        <p className="metric-label">{label}</p>
        <strong>{value}</strong>
        <span>{meta}</span>
      </div>
    </article>
  )
}

function PanelHeader({ icon: Icon, title, meta }: { icon: IconComponent; title: string; meta: string }) {
  return (
    <div className="panel-header">
      <div>
        <Icon size={18} strokeWidth={1.8} />
        <h2>{title}</h2>
      </div>
      <span>{meta}</span>
    </div>
  )
}

function StrategyTable({
  strategies,
  compact = false,
}: {
  strategies: StrategyStatus[]
  compact?: boolean
}) {
  return (
    <div className={`strategy-table ${compact ? 'is-compact' : ''}`}>
      {strategies.map((strategy) => (
        <div className="strategy-row" key={strategy.name}>
          <div>
            <strong>{strategy.name}</strong>
            <span>{strategy.market}</span>
          </div>
          {!compact && <span>{strategy.signal}</span>}
          <span className="badge neutral">{strategy.status_label}</span>
          <span className={strategy.pnl.startsWith('+') ? 'profit' : 'loss'}>{strategy.pnl}</span>
        </div>
      ))}
    </div>
  )
}

function RiskEventList({ events }: { events: RiskEvent[] }) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <div className="event-row" key={`${event.time}-${event.rule}`}>
          <span className="mono">{event.time}</span>
          <span>{event.rule}</span>
          <span className={`badge ${event.level === 'danger' ? 'danger' : 'ok'}`}>{event.result}</span>
        </div>
      ))}
    </div>
  )
}

function QualityStack({ items }: { items: DataQualityItem[] }) {
  return (
    <div className="quality-stack">
      {items.map((item) => (
        <QualityRow key={item.label} label={item.label} value={item.value} tone={item.tone} />
      ))}
    </div>
  )
}

function ParameterList({ parameters }: { parameters: StrategyParameter[] }) {
  return (
    <div className="param-list">
      {parameters.map((parameter) => (
        <QualityRow key={parameter.key} label={parameter.key} value={parameter.value} tone={parameter.tone} />
      ))}
    </div>
  )
}

function BacktestMetricList({ metrics }: { metrics: BacktestMetric[] }) {
  return (
    <div className="quality-stack">
      {metrics.map((metric) => (
        <QualityRow key={metric.name} label={metric.name} value={metric.display_value} tone={metric.tone} />
      ))}
    </div>
  )
}

function QualityRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: Tone
}) {
  return (
    <div className="quality-row">
      <span>{label}</span>
      <strong className={`text-${tone}`}>{value}</strong>
    </div>
  )
}

function RuleCard({ title, value, status }: { title: string; value: string; status: string }) {
  return (
    <article className="rule-card">
      <span>{status}</span>
      <strong>{value}</strong>
      <p>{title}</p>
    </article>
  )
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default App
