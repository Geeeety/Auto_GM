import { fallbackDashboardData } from './mockFallback'
import type {
  BacktestSummaryResponse,
  BarSeriesResponse,
  DashboardData,
  OverviewResponse,
  RiskCenterResponse,
  StrategyListResponse,
  SystemLogResponse,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchDashboardData(): Promise<{
  data: DashboardData
  source: 'api' | 'fallback'
  error?: string
}> {
  try {
    const [overview, market, strategies, backtest, risk, logs] = await Promise.all([
      getJson<OverviewResponse>('/api/overview'),
      getJson<BarSeriesResponse>('/api/market/bars/mock'),
      getJson<StrategyListResponse>('/api/strategies/mock'),
      getJson<BacktestSummaryResponse>('/api/backtests/mock'),
      getJson<RiskCenterResponse>('/api/risk/mock'),
      getJson<SystemLogResponse>('/api/logs/mock'),
    ])

    return {
      data: { overview, market, strategies, backtest, risk, logs },
      source: 'api',
    }
  } catch (error) {
    return {
      data: fallbackDashboardData,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown API error',
    }
  }
}

