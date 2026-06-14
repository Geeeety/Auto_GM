import { useMemo, useState } from 'react'
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
import './App.css'

type PageId =
  | 'overview'
  | 'data'
  | 'strategies'
  | 'backtest'
  | 'paper'
  | 'risk'
  | 'logs'

type NavItem = {
  id: PageId
  label: string
  icon: typeof LayoutDashboard
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

const equityCurve = [
  { date: '06-14', equity: 100000, drawdown: 0 },
  { date: '06-15', equity: 100680, drawdown: -0.2 },
  { date: '06-16', equity: 100240, drawdown: -0.7 },
  { date: '06-17', equity: 101180, drawdown: -0.1 },
  { date: '06-18', equity: 101920, drawdown: 0 },
  { date: '06-19', equity: 101460, drawdown: -0.5 },
  { date: '06-20', equity: 102350, drawdown: 0 },
]

const barData = [
  { time: '09:30', open: 101.2, close: 101.8, high: 102.1, low: 100.9, volume: 320 },
  { time: '10:00', open: 101.8, close: 101.4, high: 102.0, low: 101.1, volume: 260 },
  { time: '10:30', open: 101.4, close: 102.3, high: 102.6, low: 101.2, volume: 410 },
  { time: '11:00', open: 102.3, close: 103.1, high: 103.3, low: 102.0, volume: 540 },
  { time: '13:30', open: 103.1, close: 102.7, high: 103.4, low: 102.4, volume: 380 },
  { time: '14:00', open: 102.7, close: 103.8, high: 104.0, low: 102.5, volume: 610 },
  { time: '14:30', open: 103.8, close: 104.2, high: 104.5, low: 103.3, volume: 720 },
]

const backtestBars = [
  { name: '收益', value: 2.35, color: '#16a34a' },
  { name: '回撤', value: -0.92, color: '#dc2626' },
  { name: '胜率', value: 58.4, color: '#2563eb' },
  { name: '换手', value: 16.8, color: '#d97706' },
]

const strategies = [
  {
    name: '双均线趋势',
    market: 'BTC/USDT 1h',
    status: '运行中',
    signal: '买入观察',
    pnl: '+1.42%',
    risk: '正常',
  },
  {
    name: 'RSI 均值回归',
    market: 'ETH/USDT 4h',
    status: '待启动',
    signal: '无信号',
    pnl: '+0.00%',
    risk: '正常',
  },
  {
    name: '突破确认',
    market: 'AAPL 1d',
    status: '回测中',
    signal: '观望',
    pnl: '-0.18%',
    risk: '关注',
  },
]

const riskEvents = [
  { time: '09:42:16', rule: '最大单笔仓位', result: '通过', level: 'ok' },
  { time: '10:18:33', rule: '现金余额检查', result: '通过', level: 'ok' },
  { time: '11:06:27', rule: '价格偏离检查', result: '拦截', level: 'danger' },
  { time: '14:22:10', rule: '重复开仓检查', result: '通过', level: 'ok' },
]

const logs = [
  { time: '16:58:02', module: 'frontend', level: 'info', message: 'Dashboard shell rendered' },
  { time: '16:58:04', module: 'mock', level: 'info', message: 'Overview metrics loaded' },
  { time: '16:58:06', module: 'risk', level: 'warn', message: 'One mock order blocked by price deviation' },
  { time: '16:58:08', module: 'system', level: 'info', message: 'Waiting for backend API integration' },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [activePage, setActivePage] = useState<PageId>('overview')
  const activeLabel = navItems.find((item) => item.id === activePage)?.label ?? '总览'

  const snapshot = useMemo(
    () => ({
      cash: 63840,
      equity: 102350,
      dailyPnl: 850,
      runningStrategies: 2,
      riskStatus: '正常',
      dataCompleteness: 98.7,
    }),
    [],
  )

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
          <div className="status-dot" />
          <span>开发模式</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">第一周 · 第二步</p>
            <h1>{activeLabel}</h1>
          </div>
          <div className="topbar-actions">
            <div className="mode-chip">
              <Gauge size={16} strokeWidth={1.8} />
              <span>Mock 数据</span>
            </div>
            <button className="icon-button" type="button" title="通知">
              <Bell size={18} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {activePage === 'overview' && <OverviewPage snapshot={snapshot} />}
        {activePage === 'data' && <DataCenterPage />}
        {activePage === 'strategies' && <StrategyLabPage />}
        {activePage === 'backtest' && <BacktestPage />}
        {activePage === 'paper' && <PaperTradingPage />}
        {activePage === 'risk' && <RiskCenterPage />}
        {activePage === 'logs' && <LogsPage />}
      </main>
    </div>
  )
}

function OverviewPage({
  snapshot,
}: {
  snapshot: {
    cash: number
    equity: number
    dailyPnl: number
    runningStrategies: number
    riskStatus: string
    dataCompleteness: number
  }
}) {
  return (
    <div className="page-grid">
      <section className="metric-grid" aria-label="系统总览指标">
        <MetricCard
          icon={CircleDollarSign}
          label="账户权益"
          value={formatCurrency(snapshot.equity)}
          meta={`现金 ${formatCurrency(snapshot.cash)}`}
          tone="green"
        />
        <MetricCard icon={AreaChart} label="今日盈亏" value={`+${formatCurrency(snapshot.dailyPnl)}`} meta="+0.84%" tone="green" />
        <MetricCard icon={Bot} label="运行策略" value={`${snapshot.runningStrategies} 个`} meta="1 个回测中" tone="blue" />
        <MetricCard icon={ShieldCheck} label="风控状态" value={snapshot.riskStatus} meta="1 条拦截记录" tone="amber" />
      </section>

      <section className="panel panel-large">
        <PanelHeader icon={AreaChart} title="权益曲线" meta="mock / 7 days" />
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <ReAreaChart data={equityCurve} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
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
        <PanelHeader icon={ListChecks} title="策略状态" meta="3 strategies" />
        <StrategyTable compact />
      </section>

      <section className="panel">
        <PanelHeader icon={AlertTriangle} title="最近风控" meta="mock events" />
        <RiskEventList />
      </section>
    </div>
  )
}

function DataCenterPage() {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={CandlestickChart} title="行情快照" meta="BTC/USDT · 1h" />
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <ComposedChart data={barData} margin={{ top: 12, right: 18, bottom: 2, left: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="price" domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="volume" orientation="right" hide />
              <Tooltip />
              <Bar yAxisId="volume" dataKey="volume" barSize={14} fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              <Line yAxisId="price" type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={Database} title="数据质量" meta="local mock" />
        <div className="quality-stack">
          <QualityRow label="完整率" value="98.7%" tone="green" />
          <QualityRow label="重复时间" value="0" tone="green" />
          <QualityRow label="缺失区间" value="2" tone="amber" />
          <QualityRow label="异常价格" value="0" tone="green" />
        </div>
      </section>
    </div>
  )
}

function StrategyLabPage() {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={Bot} title="策略列表" meta="mock strategies" />
        <StrategyTable />
      </section>
      <section className="panel">
        <PanelHeader icon={SlidersHorizontal} title="参数预览" meta="双均线趋势" />
        <div className="param-list">
          <QualityRow label="fast_window" value="12" tone="blue" />
          <QualityRow label="slow_window" value="48" tone="blue" />
          <QualityRow label="position_size" value="25%" tone="amber" />
          <QualityRow label="stop_loss" value="3%" tone="red" />
        </div>
      </section>
    </div>
  )
}

function BacktestPage() {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={BarChart3} title="回测摘要" meta="双均线趋势 · mock" />
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <BarChart data={backtestBars} margin={{ top: 18, right: 18, bottom: 2, left: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 2, 2]}>
                {backtestBars.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={ScrollText} title="核心指标" meta="sample result" />
        <div className="quality-stack">
          <QualityRow label="总收益率" value="+2.35%" tone="green" />
          <QualityRow label="最大回撤" value="-0.92%" tone="red" />
          <QualityRow label="Sharpe" value="1.28" tone="blue" />
          <QualityRow label="交易次数" value="18" tone="amber" />
        </div>
      </section>
    </div>
  )
}

function PaperTradingPage() {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={PlayCircle} title="模拟账户" meta="paper mode" />
        <div className="account-strip">
          <MetricCard icon={CircleDollarSign} label="模拟权益" value="$100,820" meta="+0.82%" tone="green" />
          <MetricCard icon={Activity} label="未成交订单" value="2" meta="1 个限价单" tone="amber" />
          <MetricCard icon={CheckCircle2} label="今日成交" value="6" meta="手续费 $12" tone="blue" />
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={ListChecks} title="订单队列" meta="mock orders" />
        <RiskEventList />
      </section>
    </div>
  )
}

function RiskCenterPage() {
  return (
    <div className="page-grid two-column">
      <section className="panel panel-large">
        <PanelHeader icon={ShieldCheck} title="风控规则" meta="enabled" />
        <div className="rule-grid">
          <RuleCard title="最大单笔仓位" value="25%" status="启用" />
          <RuleCard title="最大总仓位" value="80%" status="启用" />
          <RuleCard title="最大日亏损" value="2.5%" status="启用" />
          <RuleCard title="熔断开关" value="Ready" status="待命" />
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={AlertTriangle} title="拦截记录" meta="today" />
        <RiskEventList />
      </section>
    </div>
  )
}

function LogsPage() {
  return (
    <section className="panel">
      <PanelHeader icon={TerminalSquare} title="系统日志" meta="frontend mock" />
      <div className="log-table">
        {logs.map((item) => (
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
  icon: typeof Activity
  label: string
  value: string
  meta: string
  tone: 'green' | 'blue' | 'amber' | 'red'
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

function PanelHeader({ icon: Icon, title, meta }: { icon: typeof Activity; title: string; meta: string }) {
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

function StrategyTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`strategy-table ${compact ? 'is-compact' : ''}`}>
      {strategies.map((strategy) => (
        <div className="strategy-row" key={strategy.name}>
          <div>
            <strong>{strategy.name}</strong>
            <span>{strategy.market}</span>
          </div>
          {!compact && <span>{strategy.signal}</span>}
          <span className="badge neutral">{strategy.status}</span>
          <span className={strategy.pnl.startsWith('+') ? 'profit' : 'loss'}>{strategy.pnl}</span>
        </div>
      ))}
    </div>
  )
}

function RiskEventList() {
  return (
    <div className="event-list">
      {riskEvents.map((event) => (
        <div className="event-row" key={`${event.time}-${event.rule}`}>
          <span className="mono">{event.time}</span>
          <span>{event.rule}</span>
          <span className={`badge ${event.level === 'danger' ? 'danger' : 'ok'}`}>{event.result}</span>
        </div>
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
  tone: 'green' | 'blue' | 'amber' | 'red'
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

export default App
