from autogm_api.schemas.backtests import BacktestMetric, BacktestSummaryResponse
from autogm_api.schemas.logs import SystemLog, SystemLogResponse
from autogm_api.schemas.market_data import Bar, BarSeriesResponse, DataQualityItem
from autogm_api.schemas.overview import EquityPoint, OverviewMetric, OverviewResponse
from autogm_api.schemas.risk import RiskCenterResponse, RiskEvent, RiskRule
from autogm_api.schemas.strategies import (
    StrategyListResponse,
    StrategyParameter,
    StrategyStatus,
)


def get_overview() -> OverviewResponse:
    return OverviewResponse(
        cash=63840,
        equity=102350,
        daily_pnl=850,
        daily_pnl_percent=0.84,
        running_strategies=2,
        risk_status="normal",
        data_completeness=98.7,
        metrics=[
            OverviewMetric(
                key="equity",
                label="账户权益",
                value="$102,350",
                meta="现金 $63,840",
                tone="green",
            ),
            OverviewMetric(
                key="daily_pnl",
                label="今日盈亏",
                value="+$850",
                meta="+0.84%",
                tone="green",
            ),
            OverviewMetric(
                key="strategies",
                label="运行策略",
                value="2 个",
                meta="1 个回测中",
                tone="blue",
            ),
            OverviewMetric(
                key="risk",
                label="风控状态",
                value="正常",
                meta="1 条拦截记录",
                tone="amber",
            ),
        ],
        equity_curve=[
            EquityPoint(date="06-14", equity=100000, drawdown=0),
            EquityPoint(date="06-15", equity=100680, drawdown=-0.2),
            EquityPoint(date="06-16", equity=100240, drawdown=-0.7),
            EquityPoint(date="06-17", equity=101180, drawdown=-0.1),
            EquityPoint(date="06-18", equity=101920, drawdown=0),
            EquityPoint(date="06-19", equity=101460, drawdown=-0.5),
            EquityPoint(date="06-20", equity=102350, drawdown=0),
        ],
    )


def get_mock_bars() -> BarSeriesResponse:
    return BarSeriesResponse(
        symbol="BTC/USDT",
        timeframe="1h",
        source="mock",
        bars=[
            Bar(time="09:30", open=101.2, close=101.8, high=102.1, low=100.9, volume=320),
            Bar(time="10:00", open=101.8, close=101.4, high=102.0, low=101.1, volume=260),
            Bar(time="10:30", open=101.4, close=102.3, high=102.6, low=101.2, volume=410),
            Bar(time="11:00", open=102.3, close=103.1, high=103.3, low=102.0, volume=540),
            Bar(time="13:30", open=103.1, close=102.7, high=103.4, low=102.4, volume=380),
            Bar(time="14:00", open=102.7, close=103.8, high=104.0, low=102.5, volume=610),
            Bar(time="14:30", open=103.8, close=104.2, high=104.5, low=103.3, volume=720),
        ],
        quality=[
            DataQualityItem(label="完整率", value="98.7%", tone="green"),
            DataQualityItem(label="重复时间", value="0", tone="green"),
            DataQualityItem(label="缺失区间", value="2", tone="amber"),
            DataQualityItem(label="异常价格", value="0", tone="green"),
        ],
    )


def get_mock_strategies() -> StrategyListResponse:
    return StrategyListResponse(
        active_strategy="双均线趋势",
        strategies=[
            StrategyStatus(
                name="双均线趋势",
                market="BTC/USDT 1h",
                status="running",
                status_label="运行中",
                signal="买入观察",
                pnl="+1.42%",
                risk="normal",
            ),
            StrategyStatus(
                name="RSI 均值回归",
                market="ETH/USDT 4h",
                status="idle",
                status_label="待启动",
                signal="无信号",
                pnl="+0.00%",
                risk="normal",
            ),
            StrategyStatus(
                name="突破确认",
                market="AAPL 1d",
                status="backtesting",
                status_label="回测中",
                signal="观望",
                pnl="-0.18%",
                risk="watch",
            ),
        ],
        parameters=[
            StrategyParameter(key="fast_window", value="12", tone="blue"),
            StrategyParameter(key="slow_window", value="48", tone="blue"),
            StrategyParameter(key="position_size", value="25%", tone="amber"),
            StrategyParameter(key="stop_loss", value="3%", tone="red"),
        ],
    )


def get_mock_backtest() -> BacktestSummaryResponse:
    return BacktestSummaryResponse(
        strategy="双均线趋势",
        symbol="BTC/USDT",
        timeframe="1h",
        initial_cash=100000,
        metrics=[
            BacktestMetric(name="收益", value=2.35, display_value="+2.35%", tone="green"),
            BacktestMetric(name="回撤", value=-0.92, display_value="-0.92%", tone="red"),
            BacktestMetric(name="胜率", value=58.4, display_value="58.4%", tone="blue"),
            BacktestMetric(name="换手", value=16.8, display_value="16.8%", tone="amber"),
        ],
    )


def get_mock_risk() -> RiskCenterResponse:
    return RiskCenterResponse(
        status="normal",
        rules=[
            RiskRule(title="最大单笔仓位", value="25%", status="enabled", status_label="启用"),
            RiskRule(title="最大总仓位", value="80%", status="enabled", status_label="启用"),
            RiskRule(title="最大日亏损", value="2.5%", status="enabled", status_label="启用"),
            RiskRule(title="熔断开关", value="Ready", status="standby", status_label="待命"),
        ],
        events=[
            RiskEvent(time="09:42:16", rule="最大单笔仓位", result="通过", level="ok"),
            RiskEvent(time="10:18:33", rule="现金余额检查", result="通过", level="ok"),
            RiskEvent(time="11:06:27", rule="价格偏离检查", result="拦截", level="danger"),
            RiskEvent(time="14:22:10", rule="重复开仓检查", result="通过", level="ok"),
        ],
    )


def get_mock_logs() -> SystemLogResponse:
    return SystemLogResponse(
        logs=[
            SystemLog(
                time="16:58:02",
                module="frontend",
                level="info",
                message="Dashboard shell rendered",
            ),
            SystemLog(
                time="16:58:04",
                module="mock",
                level="info",
                message="Overview metrics loaded",
            ),
            SystemLog(
                time="16:58:06",
                module="risk",
                level="warn",
                message="One mock order blocked by price deviation",
            ),
            SystemLog(
                time="16:58:08",
                module="system",
                level="info",
                message="Waiting for backend API integration",
            ),
        ]
    )

