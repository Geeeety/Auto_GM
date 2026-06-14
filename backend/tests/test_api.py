from fastapi.testclient import TestClient

from autogm_api.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_overview_mock_data() -> None:
    response = client.get("/api/overview")

    assert response.status_code == 200
    payload = response.json()
    assert payload["equity"] == 102350
    assert len(payload["equity_curve"]) == 7


def test_market_bars_mock_data() -> None:
    response = client.get("/api/market/bars/mock")

    assert response.status_code == 200
    payload = response.json()
    assert payload["symbol"] == "BTC/USDT"
    assert len(payload["bars"]) == 7


def test_strategy_mock_data() -> None:
    response = client.get("/api/strategies/mock")

    assert response.status_code == 200
    assert len(response.json()["strategies"]) == 3

