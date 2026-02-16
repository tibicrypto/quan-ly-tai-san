# 🏗️ Technical Architecture

## System Overview

The Personal Finance Super App is built as a modern, full-stack Next.js application with the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js App Router + React + TailwindCSS)                 │
├─────────────────────────────────────────────────────────────┤
│  • Homepage (Dashboard)                                      │
│  • Investment Management (Crypto/Gold/Funds)                │
│  • Credit Card Optimizer                                     │
│  • Settings                                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│         (Server Components + API Routes)                     │
├─────────────────────────────────────────────────────────────┤
│  • Business Logic                                            │
│  • Credit Card Optimization Algorithm                        │
│  • Savings Calculation Engine                                │
│  • Investment Portfolio Calculator                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│              (Prisma ORM + SQLite)                          │
├─────────────────────────────────────────────────────────────┤
│  • Investment Data (Crypto, Gold, Funds)                    │
│  • Credit Card Data                                          │
│  • Transaction History                                       │
│  • User Settings                                             │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14.2+**: React framework with App Router
- **React 18.3+**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **date-fns**: Date manipulation library

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **Prisma 5.14+**: Modern ORM for database access
- **SQLite**: Lightweight, file-based database

### Additional Libraries
- **Recharts**: Charting library (ready for future use)
- **Zod**: Schema validation

## Database Schema

### Investment Management

#### CryptoAsset
```prisma
model CryptoAsset {
  id              String   @id @default(cuid())
  name            String   // Bitcoin, Ethereum
  symbol          String   // BTC, ETH
  exchange        String   // Binance, OKX, Bybit
  apiKeyId        String?
  balance         Float
  averagePrice    Float    // USDT
  currentPrice    Float?
  usdtVndRate     Float    // Custom rate
  alertThreshold  Float?
  stopLoss        Float?
  takeProfit      Float?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  transactions    CryptoTransaction[]
}
```

#### GoldSilverAsset
```prisma
model GoldSilverAsset {
  id              String   @id @default(cuid())
  type            String   // SJC_GOLD_BAR, JEWELRY_GOLD, SILVER
  name            String
  weight          Float
  unit            String   // gram, chỉ, lượng
  purchasePrice   Float    // VND per unit
  currentPrice    Float?
  vendor          String?  // SJC, DOJI, PNJ
  purchaseDate    DateTime
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### FundAsset
```prisma
model FundAsset {
  id              String   @id @default(cuid())
  name            String
  fundCode        String
  fundCompany     String   // Dragon Capital, VinaCapital
  type            String   // OPEN_ENDED, ETF
  units           Float
  avgNavPrice     Float
  currentNav      Float?
  purchaseDate    DateTime
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  transactions    FundTransaction[]
}
```

### Credit Card Management

#### CreditCard
```prisma
model CreditCard {
  id                  String   @id @default(cuid())
  bankName            String
  cardName            String
  lastFourDigits      String
  statementDay        Int      // 1-31
  interestFreeDays    Int      // 45, 55
  paymentDueDays      Int      // 15-20
  creditLimit         Float?
  notes               String?
  isActive            Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  transactions        CardTransaction[]
  reminders           PaymentReminder[]
}
```

#### CardTransaction
```prisma
model CardTransaction {
  id                  String       @id @default(cuid())
  cardId              String
  card                CreditCard   @relation(...)
  amount              Float        // VND
  description         String
  transactionDate     DateTime
  statementDate       DateTime?
  dueDate             DateTime?
  isPaid              Boolean      @default(false)
  savingsRecommended  Boolean      @default(false)
  savingsAmount       Float?
  savingsInterest     Float?
  actualInterest      Float?
  notes               String?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
}
```

## Key Algorithms

### 1. Smart Swipe Optimizer

**File**: `lib/credit-card-optimizer.ts`

**Function**: `calculateOptimalCard()`

**Algorithm**:
```typescript
For each active credit card:
  1. Get current date and statement day
  2. Calculate next statement date:
     - If today >= statement day: next month
     - Else: this month
  3. Calculate due date = statement date + payment due days
  4. Calculate interest-free period = due date - today
  5. Assign recommendation based on period:
     - >= 50 days: "Tối ưu nhất"
     - >= 35 days: "Tốt"
     - >= 20 days: "Trung bình"
     - < 20 days: "Không khuyến nghị"
  
Sort cards by interest-free period (descending)
Return sorted list
```

**Time Complexity**: O(n log n) where n = number of cards

### 2. Cash-to-Savings Calculator

**File**: `lib/credit-card-optimizer.ts`

**Function**: `calculateSavingsRecommendation()`

**Algorithm**:
```typescript
Input: amount, transaction date, due date

1. Calculate days_available = due_date - transaction_date

2. If days_available >= 35:
   - Type: TERM_DEPOSIT_1M
   - Rate: 4.5% annual
   - Interest = amount × (4.5/100/365) × 30 days
   - Message: Recommend 1-month term deposit

3. Else if days_available >= 20:
   - Type: FLEXIBLE_SAVINGS
   - Rate: 3.5% annual
   - Interest = amount × (3.5/100/365) × days_available
   - Message: Recommend flexible savings

4. Else if days_available >= 10:
   - Type: MMF
   - Rate: 3.0% annual
   - Interest = amount × (3.0/100/365) × days_available
   - Message: Recommend money market fund

5. Else:
   - Type: NO_RECOMMENDATION
   - Message: Too short, keep cash

Return recommendation object
```

**Time Complexity**: O(1)

### 3. PnL Calculator

**File**: `lib/utils.ts`

**Function**: `calculatePnL()`

**Algorithm**:
```typescript
Input: current_price, average_price, quantity

PnL_amount = (current_price - average_price) × quantity
PnL_percent = ((current_price - average_price) / average_price) × 100

Return { pnl: PnL_amount, pnlPercent: PnL_percent }
```

**Time Complexity**: O(1)

## API Endpoints

### Credit Card Optimization

#### POST `/api/credit-cards/optimize`

**Request**:
```json
{
  "amount": 30000000,
  "transactionDate": "2026-02-22T00:00:00Z"
}
```

**Response**:
```json
{
  "bestCard": {
    "cardId": "1",
    "cardName": "Online Plus",
    "bankName": "VIB",
    "interestFreePeriod": 43,
    "dueDate": "2026-04-05T00:00:00Z",
    "recommendation": "Tối ưu nhất!"
  },
  "allOptions": [...],
  "savingsRecommendation": {
    "type": "TERM_DEPOSIT_1M",
    "amount": 30000000,
    "estimatedInterest": 112500,
    "interestRate": 4.5,
    "message": "...",
    "daysAvailable": 43
  },
  "amount": 30000000,
  "transactionDate": "2026-02-22T00:00:00Z"
}
```

## File Structure

```
quan-ly-tai-san/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── credit-cards/
│   │       └── optimize/
│   │           └── route.ts      # Optimization endpoint
│   ├── credit-cards/
│   │   └── page.tsx              # Credit cards main page
│   ├── investments/
│   │   ├── page.tsx              # Investments dashboard
│   │   ├── crypto/
│   │   │   └── page.tsx          # Crypto management
│   │   ├── gold/
│   │   │   └── page.tsx          # Gold/Silver management
│   │   └── funds/
│   │       └── page.tsx          # Funds management
│   ├── settings/
│   │   └── page.tsx              # Settings page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   └── Navigation.tsx            # Navigation component
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Utility functions
│   └── credit-card-optimizer.ts  # Optimization logic
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── dev.db                    # SQLite database (gitignored)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.js                # Next.js config
├── README.md                     # Main documentation
├── USAGE_GUIDE.md                # User guide
└── ARCHITECTURE.md               # This file
```

## Security Considerations

### API Keys
1. **Encryption at Rest**: API keys stored encrypted in database
2. **Read-Only Only**: Only accept read-only API keys
3. **No Withdrawal Permissions**: Never request keys with withdrawal rights
4. **Secure Storage**: Keys never exposed to client

### Data Privacy
1. **Local Storage**: SQLite database stored locally
2. **No External Transmission**: Data not sent to external servers
3. **No Sensitive Data**: CVV, passwords never stored
4. **User Control**: Users have full control over their data

### Input Validation
1. **Type Safety**: TypeScript for compile-time checks
2. **Runtime Validation**: Zod schemas for API inputs
3. **Sanitization**: All user inputs sanitized
4. **SQL Injection Prevention**: Prisma ORM handles parameterization

## Performance Optimization

### Frontend
- **Static Generation**: Most pages pre-rendered at build time
- **Code Splitting**: Automatic by Next.js
- **Image Optimization**: Next.js Image component (ready for future use)
- **CSS Optimization**: Tailwind CSS purges unused styles

### Backend
- **Database Indexing**: Proper indexes on frequently queried fields
- **Query Optimization**: Efficient Prisma queries
- **Caching**: Ready for Redis integration if needed

### Build Output
```
Route (app)                              Size     First Load JS
┌ ○ /                                    178 B          96.1 kB
├ ○ /credit-cards                        3.35 kB        99.3 kB
├ ○ /investments                         178 B          96.1 kB
├ ○ /investments/crypto                  3.44 kB        99.4 kB
├ ○ /investments/funds                   3.37 kB        99.3 kB
├ ○ /investments/gold                    3.06 kB          99 kB
└ ○ /settings                            2.94 kB        90.2 kB
```

## Future Enhancements

### Phase 1: Data Integration
1. Real-time price feeds from exchanges
2. Actual NAV updates from fund companies
3. Gold price API integration (SJC, DOJI, PNJ)
4. SMS parsing for automatic transaction recording

### Phase 2: Advanced Features
1. Portfolio rebalancing recommendations
2. Tax calculation and reporting
3. Multi-currency support
4. Expense tracking and budgeting
5. Investment goal planning

### Phase 3: AI/ML Features
1. Predictive analytics for price movements
2. Personalized investment recommendations
3. Anomaly detection for unusual spending
4. Smart alerts based on user behavior

### Phase 4: Social Features
1. Compare performance with friends (anonymized)
2. Share investment strategies
3. Community-driven fund ratings
4. Expert advice marketplace

### Phase 5: Mobile App
1. React Native mobile app
2. Push notifications
3. Biometric authentication
4. Offline mode support

## Deployment

### Development
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Production
```bash
npm run build
npm start
# Or deploy to Vercel/Netlify
```

### Environment Variables
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# API Keys (future)
BINANCE_API_URL="https://api.binance.com"
OKX_API_URL="https://www.okx.com/api"

# Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Testing Strategy

### Unit Tests (Future)
- Credit card optimizer logic
- PnL calculations
- Date calculations
- Utility functions

### Integration Tests (Future)
- API endpoint testing
- Database operations
- Full user flows

### E2E Tests (Future)
- Complete user journeys
- Cross-browser testing
- Mobile responsiveness

## Monitoring and Analytics

### Metrics to Track (Future)
1. **User Engagement**
   - Daily active users
   - Feature usage frequency
   - Session duration

2. **Financial Impact**
   - Average interest earned per user
   - Total savings generated
   - Optimal card usage rate

3. **System Performance**
   - API response times
   - Database query performance
   - Error rates

## Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (future)
- Conventional commits (future)

### Git Workflow
1. Create feature branch
2. Implement changes
3. Write tests
4. Submit pull request
5. Code review
6. Merge to main

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions:
- GitHub Issues: Create an issue
- Email: (to be added)
- Documentation: README.md and USAGE_GUIDE.md

---

**Built with ❤️ for Vietnamese personal finance management**
