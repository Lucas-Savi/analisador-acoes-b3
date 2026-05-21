from fastapi import APIRouter, HTTPException

from app.schemas.stock import QuoteResponse
from app.services import brapi

router = APIRouter(prefix="/quotes", tags=["Cotações"])


@router.get("/{ticker}", response_model=QuoteResponse)
async def get_quote(ticker: str):
    ticker = ticker.upper()
    data = await brapi.get_quote(ticker)
    if not data:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} não encontrado")
    return data


@router.get("/", response_model=list[str])
async def list_tickers():
    return await brapi.list_available_tickers()
