import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API Route to fetch current gold prices from PNJ and save to database
 * Based on the Python scraper logic provided
 */

interface GoldPrice {
  type: string;
  buyPrice: number;  // Price in millions VND
  sellPrice: number; // Price in millions VND
}

interface PNJGoldPrices {
  date: string;
  pnj: GoldPrice;
  sjc: GoldPrice;
  timestamp: string;
}

/**
 * Parse price from Vietnamese format (e.g., "85.500") to number in millions
 */
function parsePrice(text: string): number | null {
  try {
    // Remove dots and convert to number, then divide by 1000 to get millions
    const clean = text.replace(/\./g, '').trim();
    const value = parseInt(clean);
    return Math.round((value / 1000) * 100) / 100; // Round to 2 decimals
  } catch {
    return null;
  }
}

/**
 * Fetch gold prices from PNJ website for a specific date
 */
async function fetchGoldPricesForDate(date: Date): Promise<PNJGoldPrices | null> {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  const url = `https://giavang.pnj.com.vn/history?gold_history_day=${day}&gold_history_month=${month}&gold_history_year=${year}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    if (!response.ok) {
      console.error(`PNJ fetch failed with status: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    console.log('Fetched HTML length:', html.length);
    
    // More flexible regex patterns to match table data
    // Try multiple patterns for better matching
    let pnjBuyPrice: number | null = null;
    let pnjSellPrice: number | null = null;
    let sjcBuyPrice: number | null = null;
    let sjcSellPrice: number | null = null;
    
    // Pattern 1: Direct table cell matching for PNJ
    const pnjRowMatch = html.match(/PNJ.*?<tr[^>]*>[\s\S]*?<td[^>]*>([\d.,]+)<\/td>[\s\S]*?<td[^>]*>([\d.,]+)<\/td>/i);
    if (pnjRowMatch) {
      pnjBuyPrice = parsePrice(pnjRowMatch[1]);
      pnjSellPrice = parsePrice(pnjRowMatch[2]);
      console.log('PNJ prices found:', { buy: pnjBuyPrice, sell: pnjSellPrice });
    }
    
    // Pattern 2: Direct table cell matching for SJC
    const sjcRowMatch = html.match(/SJC.*?<tr[^>]*>[\s\S]*?<td[^>]*>([\d.,]+)<\/td>[\s\S]*?<td[^>]*>([\d.,]+)<\/td>/i);
    if (sjcRowMatch) {
      sjcBuyPrice = parsePrice(sjcRowMatch[1]);
      sjcSellPrice = parsePrice(sjcRowMatch[2]);
      console.log('SJC prices found:', { buy: sjcBuyPrice, sell: sjcSellPrice });
    }
    
    // Fallback: Try to find any price-like numbers near PNJ/SJC text
    if (!pnjBuyPrice || !pnjSellPrice) {
      const pnjSection = html.match(/PNJ[\s\S]{0,500}?([\d.,]+)[\s\S]{0,50}?([\d.,]+)/i);
      if (pnjSection) {
        pnjBuyPrice = pnjBuyPrice || parsePrice(pnjSection[1]);
        pnjSellPrice = pnjSellPrice || parsePrice(pnjSection[2]);
        console.log('PNJ prices (fallback):', { buy: pnjBuyPrice, sell: pnjSellPrice });
      }
    }
    
    if (!sjcBuyPrice || !sjcSellPrice) {
      const sjcSection = html.match(/SJC[\s\S]{0,500}?([\d.,]+)[\s\S]{0,50}?([\d.,]+)/i);
      if (sjcSection) {
        sjcBuyPrice = sjcBuyPrice || parsePrice(sjcSection[1]);
        sjcSellPrice = sjcSellPrice || parsePrice(sjcSection[2]);
        console.log('SJC prices (fallback):', { buy: sjcBuyPrice, sell: sjcSellPrice });
      }
    }
    
    if (!pnjBuyPrice && !sjcBuyPrice) {
      console.error('No prices found in HTML');
      return null;
    }
    
    return {
      date: `${year}-${month}-${day}`,
      pnj: {
        type: 'PNJ',
        buyPrice: pnjBuyPrice || 0,
        sellPrice: pnjSellPrice || 0
      },
      sjc: {
        type: 'SJC',
        buyPrice: sjcBuyPrice || 0,
        sellPrice: sjcSellPrice || 0
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching PNJ gold prices:', error);
    return null;
  }
}

/**
 * GET /api/gold-prices/pnj
 * Query params:
 *   - date: YYYY-MM-DD (optional, defaults to today)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    let targetDate: Date;
    if (dateParam) {
      targetDate = new Date(dateParam);
      if (isNaN(targetDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        );
      }
    } else {
      targetDate = new Date();
    }
    
    const prices = await fetchGoldPricesForDate(targetDate);
    
    if (!prices) {
      return NextResponse.json(
        { error: 'Could not fetch gold prices for the specified date' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(prices);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gold-prices/pnj
 * Save gold prices from PNJ to database (PriceHistory table)
 * Also updates current prices for matching gold assets
 */
export async function POST(request: Request) {
  try {
    // Fetch current prices from PNJ
    const prices = await fetchGoldPricesForDate(new Date());
    
    if (!prices) {
      return NextResponse.json(
        { error: 'Could not fetch current gold prices from PNJ' },
        { status: 404 }
      );
    }
    
    // Save to PriceHistory table
    const priceHistoryRecords = [];
    
    // Save PNJ price (jewelry gold 24K)
    if (prices.pnj.buyPrice > 0) {
      const pnjHistory = await prisma.priceHistory.create({
        data: {
          assetType: 'GOLD',
          assetId: 'PNJ_JEWELRY_GOLD',
          symbol: 'PNJ-24K',
          price: prices.pnj.sellPrice, // Use sell price as market price
          currency: 'VND_MILLION',
          source: 'PNJ_WEBSITE',
          timestamp: new Date()
        }
      });
      priceHistoryRecords.push(pnjHistory);
    }
    
    // Save SJC price (gold bars)
    if (prices.sjc.buyPrice > 0) {
      const sjcHistory = await prisma.priceHistory.create({
        data: {
          assetType: 'GOLD',
          assetId: 'SJC_GOLD_BAR',
          symbol: 'SJC-BAR',
          price: prices.sjc.sellPrice, // Use sell price as market price
          currency: 'VND_MILLION',
          source: 'PNJ_WEBSITE',
          timestamp: new Date()
        }
      });
      priceHistoryRecords.push(sjcHistory);
    }
    
    // Update current prices for existing gold assets
    // Update all JEWELRY_GOLD assets with PNJ price
    const jewelryUpdateCount = await prisma.goldSilverAsset.updateMany({
      where: {
        type: 'JEWELRY_GOLD'
      },
      data: {
        currentPrice: prices.pnj.sellPrice
      }
    });
    
    // Update all SJC_GOLD_BAR assets with SJC price
    const sjcUpdateCount = await prisma.goldSilverAsset.updateMany({
      where: {
        type: 'SJC_GOLD_BAR'
      },
      data: {
        currentPrice: prices.sjc.sellPrice
      }
    });
    
    return NextResponse.json({
      success: true,
      prices,
      priceHistoryRecords: priceHistoryRecords.length,
      assetsUpdated: {
        jewelryGold: jewelryUpdateCount.count,
        sjcGoldBars: sjcUpdateCount.count
      },
      message: 'Giá vàng đã được cập nhật vào database thành công'
    }, { status: 201 });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving prices' },
      { status: 500 }
    );
  }
}
