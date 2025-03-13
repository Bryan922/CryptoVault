import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';
import type { CryptoData } from '../types';

interface CryptoCardProps {
  crypto: CryptoData;
}

interface ChartData {
  timestamp: number;
  price: number;
  marketCap: number;
  volume: number;
}

const generateHistoricalData = (
  currentPrice: number,
  currentMarketCap: number,
  currentVolume: number,
  dataPoints: number = 24
): ChartData[] => {
  const data: ChartData[] = [];
  const volatility = 0.001; // Réduit à 0.1% de volatilité pour plus de stabilité
  const now = Date.now();
  const hourInMs = 3600000;

  let lastPrice = currentPrice;
  let lastMarketCap = currentMarketCap;
  let lastVolume = currentVolume;

  // Générer les données en partant de maintenant et en remontant 24h en arrière
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = now - (i * hourInMs);
    const priceChange = (Math.random() - 0.5) * volatility;
    // Pour le dernier point (i=0), utiliser le prix actuel
    const price = i === 0 ? currentPrice : lastPrice * (1 + priceChange);
    const marketCap = price * (currentMarketCap / currentPrice); // Ajuster le market cap en fonction du prix
    const volume = lastVolume * (1 + (Math.random() - 0.5) * 0.05); // Réduit à 5% de variation sur le volume

    data.push({
      timestamp,
      price,
      marketCap,
      volume,
    });

    lastPrice = price;
    lastMarketCap = marketCap;
    lastVolume = volume;
  }

  return data;
};

export const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const isPositive = crypto.price_change_percentage_24h > 0;
  const isStarnova = crypto.id === 'starnova';
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [livePrice, setLivePrice] = useState(crypto.current_price);
  const [liveMarketCap, setLiveMarketCap] = useState(crypto.market_cap);
  const [liveVolume, setLiveVolume] = useState(crypto.total_volume);
  const [livePriceChange, setLivePriceChange] = useState(crypto.price_change_percentage_24h);

  useEffect(() => {
    if (isStarnova) {
      const data = generateHistoricalData(
        crypto.current_price,
        crypto.market_cap,
        crypto.total_volume,
        24
      );
      setChartData(data);
      setLivePrice(crypto.current_price);
      setLivePriceChange(crypto.price_change_percentage_24h);

      const interval = setInterval(() => {
        const newData = generateHistoricalData(
          crypto.current_price,
          crypto.market_cap,
          crypto.total_volume,
          24
        );
        setChartData(newData);
      }, 30000); // Mise à jour toutes les 30 secondes au lieu de 5 secondes

      return () => clearInterval(interval);
    } else {
      let isMounted = true;
      const controller = new AbortController();

      const fetchRealTimeData = async () => {
        try {
          // Get current price and market data from Binance
          const symbol = `${crypto.symbol.toUpperCase()}USDT`;
          const [tickerResponse, klineResponse] = await Promise.all([
            axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
            axios.get('https://api.binance.com/api/v3/klines', {
              params: {
                symbol: symbol,
                interval: '1h', // Changer à 1h pour être cohérent avec Starnova
                limit: 24 // 24h de données en intervalles d'1 heure
              }
            })
          ]);

          if (!isMounted) return;

          // Update live data
          const ticker = tickerResponse.data;
          setLivePrice(parseFloat(ticker.lastPrice));
          setLiveMarketCap(parseFloat(ticker.quoteVolume) * parseFloat(ticker.lastPrice));
          setLiveVolume(parseFloat(ticker.volume));
          setLivePriceChange(parseFloat(ticker.priceChangePercent));

          // Transform kline data for the chart
          const historicalData = klineResponse.data.map((kline: any) => ({
            timestamp: kline[0], // timestamp
            price: parseFloat(kline[4]), // close price
            marketCap: parseFloat(kline[7]) * parseFloat(kline[4]), // quote volume * close price
            volume: parseFloat(kline[5]) // volume
          }));

          setChartData(historicalData);
        } catch (error: any) {
          console.error('Error fetching Binance data:', error.message);
          // En cas d'erreur, utiliser les données simulées
          const fallbackData = generateHistoricalData(
            crypto.current_price,
            crypto.market_cap,
            crypto.total_volume
          );
          if (isMounted) {
            setChartData(fallbackData);
          }
        }
      };

      fetchRealTimeData();
      const interval = setInterval(fetchRealTimeData, 5000); // Update every 5 seconds

      return () => {
        isMounted = false;
        controller.abort();
        clearInterval(interval);
      };
    }
  }, [crypto.id, isStarnova]);

  const formatTooltipValue = (value: number) => {
    if (value < 0.01) {
      return value.toFixed(8);
    }
    return value.toFixed(2);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            {format(new Date(data.timestamp), 'MMM dd, HH:mm')}
          </p>
          <p className="font-bold text-gray-900 dark:text-white">
            Price: ${formatTooltipValue(data.price)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            MC: ${(data.marketCap / 1000000).toFixed(2)}M
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Vol: ${(data.volume / 1000000).toFixed(2)}M
          </p>
        </div>
      );
    }
    return null;
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toFixed(1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
          <div>
            <h3 className="font-bold text-lg dark:text-white">{crypto.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        {(livePriceChange > 0) ? (
          <TrendingUp className="w-6 h-6 text-green-500" />
        ) : (
          <TrendingDown className="w-6 h-6 text-red-500" />
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold dark:text-white">
          ${livePrice.toLocaleString(undefined, {
            minimumFractionDigits: livePrice < 0.01 ? 6 : 2,
            maximumFractionDigits: livePrice < 0.01 ? 6 : 2,
          })}
        </p>
        <p className={`flex items-center ${
          livePriceChange > 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {livePriceChange.toFixed(2)}%
        </p>
        <div className="h-40 mt-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`colorPrice-${crypto.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm')}
                stroke="#9ca3af"
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => formatTooltipValue(value)}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fillOpacity={1}
                fill={`url(#colorPrice-${crypto.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {crypto.audit_status && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Audit Verified</span>
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Market Cap: ${formatValue(isStarnova ? crypto.market_cap : liveMarketCap)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Liquidity: ${formatValue(isStarnova ? crypto.total_volume : liveVolume)}
          </p>
          {crypto.max_supply && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Supply: {(crypto.max_supply / 1000000).toFixed(0)}M
            </p>
          )}
        </div>
      </div>
    </div>
  );
};