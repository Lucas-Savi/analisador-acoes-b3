import asyncio
from functools import partial

import yfinance as yf


def _fetch_fundamentals(ticker: str) -> dict:
    yf_ticker = yf.Ticker(f"{ticker}.SA")
    info = yf_ticker.info

    return {
        "ticker": ticker,
        "lpa": info.get("trailingEps"),
        "vpa": _calc_vpa(info),
        "pl": info.get("trailingPE"),
        "pvpa": info.get("priceToBook"),
        "liquidez_corrente": info.get("currentRatio"),
        "divida_patrimonio": info.get("debtToEquity"),
    }


def _calc_vpa(info: dict) -> float | None:
    book_value = info.get("bookValue")
    return round(book_value, 2) if book_value is not None else None


async def get_fundamentals(ticker: str) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(_fetch_fundamentals, ticker))


def _fetch_history(ticker: str, period: str) -> list[dict]:
    yf_ticker = yf.Ticker(f"{ticker}.SA")
    hist = yf_ticker.history(period=period)
    hist = hist.reset_index()
    return [
        {
            "date": str(row["Date"].date()),
            "close": round(row["Close"], 2),
            "volume": int(row["Volume"]),
        }
        for _, row in hist.iterrows()
    ]


async def get_history(ticker: str, period: str = "1y") -> list[dict]:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(_fetch_history, ticker, period))
