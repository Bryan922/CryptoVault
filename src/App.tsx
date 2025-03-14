import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Coins, 
  Moon, 
  Sun, 
  TrendingUp, 
  Globe, 
  BarChart2, 
  DollarSign,
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { CryptoCard } from './components/CryptoCard';
import type { CryptoData } from './types';

const STARNOVA: CryptoData = {
  id: 'starnova',
  symbol: 'snova',
  name: 'Starnova',
  current_price: 0.000085,
  price_change_percentage_24h: 2.45,
  market_cap: 69000,
  total_volume: 7000,
  image: '/StarNovaLogo.jpg', // Logo local Starnova
  launch_date: '2023-10-15',
  max_supply: 1000000000,
  audit_status: 'verified'
};

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [starnovaPrice, setStarnovaPrice] = React.useState(STARNOVA.current_price);
  const [starnovaPriceChange, setStarnovaPriceChange] = React.useState(STARNOVA.price_change_percentage_24h);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('24h');

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    const updateStarnovaPrice = () => {
      const newPrice = starnovaPrice * (1 + (Math.random() - 0.5) * 0.01);
      const newPriceChange = ((Math.random() - 0.5) * 4) + 2;
      setStarnovaPrice(newPrice);
      setStarnovaPriceChange(newPriceChange);
    };

    const interval = setInterval(updateStarnovaPrice, 5000);
    return () => clearInterval(interval);
  }, [starnovaPrice]);

  const { data: cryptos, isLoading, error } = useQuery<CryptoData[]>(
    'cryptos',
    async () => {
      try {
        const symbols = [
          'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
          'DOGEUSDT', 'XRPUSDT', 'TRXUSDT', 'MATICUSDT', 'DOTUSDT',
          'AVAXUSDT', 'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'LTCUSDT',
          'NEARUSDT', 'AAVEUSDT', 'ALGOUSDT', 'FILUSDT', 'VETUSDT',
          'ICPUSDT', 'SANDUSDT', 'MANAUSDT', 'AXSUSDT', 'FTMUSDT'
        ];

        const response = await axios.get('/api/binance/ticker/24hr', {
          params: {
            symbols: JSON.stringify(symbols)
          }
        });

        const symbolMapping: { [key: string]: string } = {
          'BTCUSDT': 'bitcoin',
          'ETHUSDT': 'ethereum',
          'BNBUSDT': 'binancecoin',
          'SOLUSDT': 'solana',
          'ADAUSDT': 'cardano',
          'DOGEUSDT': 'dogecoin',
          'XRPUSDT': 'ripple',
          'TRXUSDT': 'tron',
          'MATICUSDT': 'polygon',
          'DOTUSDT': 'polkadot',
          'AVAXUSDT': 'avalanche',
          'LINKUSDT': 'chainlink',
          'UNIUSDT': 'uniswap',
          'ATOMUSDT': 'cosmos',
          'LTCUSDT': 'litecoin',
          'NEARUSDT': 'near',
          'AAVEUSDT': 'aave',
          'ALGOUSDT': 'algorand',
          'FILUSDT': 'filecoin',
          'VETUSDT': 'vechain',
          'ICPUSDT': 'internet-computer',
          'SANDUSDT': 'the-sandbox',
          'MANAUSDT': 'decentraland',
          'AXSUSDT': 'axie-infinity',
          'FTMUSDT': 'fantom',
          'SHIBUSDT': 'shiba-inu',
          'FLOKIUSDT': 'floki',
          'PEPEUSDT': 'pepe',
          'BONKUSDT': 'bonk',
          'BABYDOGEUSDT': 'baby-doge-coin',
          'CATUSDT': 'big-cat-rescue',
          'WOJAK': 'wojak',
          'MEMESUSDT': 'memecoin',
          'POTATOUSDT': 'potato',
          'ORDIUSDT': 'ordinals'
        };

        const logoMapping: { [key: string]: string } = {
          'BTCUSDT': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          'ETHUSDT': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          'BNBUSDT': 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
          'SOLUSDT': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          'ADAUSDT': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
          'DOGEUSDT': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
          'XRPUSDT': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
          'TRXUSDT': 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
          'MATICUSDT': 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
          'DOTUSDT': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
          'AVAXUSDT': 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
          'LINKUSDT': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
          'UNIUSDT': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
          'ATOMUSDT': 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
          'LTCUSDT': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
          'NEARUSDT': 'https://assets.coingecko.com/coins/images/10365/large/near.jpg',
          'AAVEUSDT': 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
          'ALGOUSDT': 'https://assets.coingecko.com/coins/images/4380/large/download.png',
          'FILUSDT': 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
          'VETUSDT': 'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png',
          'ICPUSDT': 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png',
          'SANDUSDT': 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg',
          'MANAUSDT': 'https://assets.coingecko.com/coins/images/878/large/decentraland-mana.png',
          'AXSUSDT': 'https://assets.coingecko.com/coins/images/13029/large/axie_infinity_logo.png',
          'FTMUSDT': 'https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png',
          'SHIBUSDT': 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
          'FLOKIUSDT': 'https://assets.coingecko.com/coins/images/16746/large/PNG_image.png',
          'PEPEUSDT': 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
          'BONKUSDT': 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg',
          'BABYDOGEUSDT': 'https://assets.coingecko.com/coins/images/16125/large/babydoge.png',
          'CATUSDT': 'https://assets.coingecko.com/coins/images/18421/large/cat.png',
          'WOJAK': 'https://assets.coingecko.com/coins/images/29039/large/wojak.png',
          'MEMESUSDT': 'https://assets.coingecko.com/coins/images/31102/large/memecoin.png',
          'POTATOUSDT': 'https://assets.coingecko.com/coins/images/31103/large/potato.png',
          'ORDIUSDT': 'https://assets.coingecko.com/coins/images/30162/large/ordi.png'
        };

        const nameMapping: { [key: string]: string } = {
          'BTCUSDT': 'Bitcoin',
          'ETHUSDT': 'Ethereum',
          'BNBUSDT': 'Binance Coin',
          'SOLUSDT': 'Solana',
          'ADAUSDT': 'Cardano',
          'DOGEUSDT': 'Dogecoin',
          'XRPUSDT': 'Ripple',
          'TRXUSDT': 'Tron',
          'MATICUSDT': 'Polygon',
          'DOTUSDT': 'Polkadot',
          'AVAXUSDT': 'Avalanche',
          'LINKUSDT': 'Chainlink',
          'UNIUSDT': 'Uniswap',
          'ATOMUSDT': 'Cosmos',
          'LTCUSDT': 'Litecoin',
          'NEARUSDT': 'NEAR Protocol',
          'AAVEUSDT': 'Aave',
          'ALGOUSDT': 'Algorand',
          'FILUSDT': 'Filecoin',
          'VETUSDT': 'VeChain',
          'ICPUSDT': 'Internet Computer',
          'SANDUSDT': 'The Sandbox',
          'MANAUSDT': 'Decentraland',
          'AXSUSDT': 'Axie Infinity',
          'FTMUSDT': 'Fantom',
          'SHIBUSDT': 'Shiba Inu',
          'FLOKIUSDT': 'Floki',
          'PEPEUSDT': 'Pepe',
          'BONKUSDT': 'Bonk',
          'BABYDOGEUSDT': 'Baby Doge Coin',
          'CATUSDT': 'Big Cat Rescue',
          'WOJAK': 'Wojak',
          'MEMESUSDT': 'Memecoin',
          'POTATOUSDT': 'Potato',
          'ORDIUSDT': 'Ordinals'
        };

        // Transform the response data to match our CryptoData interface
        const transformedData = response.data.map((ticker: any) => ({
          id: symbolMapping[ticker.symbol] || ticker.symbol.toLowerCase(),
          symbol: ticker.symbol.replace('USDT', '').toLowerCase(),
          name: nameMapping[ticker.symbol] || ticker.symbol.replace('USDT', ''),
          current_price: parseFloat(ticker.lastPrice),
          price_change_percentage_24h: parseFloat(ticker.priceChangePercent),
          market_cap: parseFloat(ticker.quoteVolume) * parseFloat(ticker.lastPrice),
          total_volume: parseFloat(ticker.volume),
          image: logoMapping[ticker.symbol],
          max_supply: null,
          audit_status: 'verified'
        }));

        // Créer une copie de STARNOVA avec le prix mis à jour
        const updatedStarnova = {
          ...STARNOVA,
          current_price: starnovaPrice,
          price_change_percentage_24h: starnovaPriceChange
        };

        return [...transformedData, updatedStarnova];
      } catch (error: any) {
        console.error('Error fetching Binance data:', error);
        throw error;
      }
    },
    {
      refetchInterval: 5000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
      onError: (error: any) => {
        console.error('Error fetching market data:', error.message);
      }
    }
  );

  // Données du marché global (simulées)
  const globalMarketData = {
    totalMarketCap: 2.85,
    totalVolume24h: 98.4,
    btcDominance: 52.3,
    activeCoins: 12847,
    totalGainers: 63,
    averageChange: 2.8
  };

  const timeframes = ['1h', '24h', '7d', '30d'];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">Error loading data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                CryptoVault
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Markets
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Exchange
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Analytics
                </button>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Statistiques Globales */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${globalMarketData.totalMarketCap}T</p>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Volume 24h</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${globalMarketData.totalVolume24h}B</p>
                </div>
                <BarChart2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">BTC Dominance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{globalMarketData.btcDominance}%</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Tendances */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tendances du Marché</h2>
            <div className="flex space-x-2">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-lg ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cryptos Actives</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{globalMarketData.activeCoins}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gagnants 24h</p>
                  <p className="text-2xl font-bold text-green-500">{globalMarketData.totalGainers}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variation Moyenne</p>
                  <p className="text-2xl font-bold text-blue-500">+{globalMarketData.averageChange}%</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Principal des Cryptos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Principales Cryptomonnaies
            </h2>
            <Clock className="h-6 w-6 text-gray-400" />
          </div>

          {isLoading ? (
            <div className="grid place-items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cryptos?.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-lg mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">À Propos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Notre Mission</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Équipe</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Produits</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Market Data</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">API</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Contact</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Confidentialité</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Conditions</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © 2024 CryptoVault. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App