export type Tone = 'green' | 'blue' | 'amber' | 'red' | 'neutral'

export type OverviewMetric = {
  key: string
  label: string
  value: string
  meta: string
  tone: Tone
}

export type EquityPoint = {
  date: string
  equity: number
  drawdown: number
}

export type OverviewResponse = {
  cash: number
  equity: number
  daily_pnl: number
  daily_pnl_percent: number
  running_strategies: number
  risk_status: 'normal' | 'warning' | 'blocked'
  data_completeness: number
  metrics: OverviewMetric[]
  equity_curve: EquityPoint[]
}

export type MarketBar = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type DataQualityItem = {
  label: string
  value: string
  tone: Tone
}

export type BarSeriesResponse = {
  symbol: string
  timeframe: string
  source: string
  bars: MarketBar[]
  quality: DataQualityItem[]
}

export type StrategyStatus = {
  name: string
  market: string
  status: 'running' | 'idle' | 'backtesting'
  status_label: string
  signal: string
  pnl: string
  risk: 'normal' | 'watch' | 'blocked'
}

export type StrategyParameter = {
  key: string
  value: string
  tone: Tone
}

export type StrategyListResponse = {
  strategies: StrategyStatus[]
  active_strategy: string
  parameters: StrategyParameter[]
}

export type BacktestMetric = {
  name: string
  value: number
  display_value: string
  tone: Tone
}

export type BacktestSummaryResponse = {
  strategy: string
  symbol: string
  timeframe: string
  initial_cash: number
  metrics: BacktestMetric[]
}

export type RiskRule = {
  title: string
  value: string
  status: 'enabled' | 'standby' | 'disabled'
  status_label: string
}

export type RiskEvent = {
  time: string
  rule: string
  result: string
  level: 'ok' | 'danger' | 'warning'
}

export type RiskCenterResponse = {
  status: 'normal' | 'warning' | 'blocked'
  rules: RiskRule[]
  events: RiskEvent[]
}

export type SystemLog = {
  time: string
  module: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
}

export type SystemLogResponse = {
  logs: SystemLog[]
}

export type DashboardData = {
  overview: OverviewResponse
  market: BarSeriesResponse
  strategies: StrategyListResponse
  backtest: BacktestSummaryResponse
  risk: RiskCenterResponse
  logs: SystemLogResponse
}

