# 💰 Super App - Quản lý Tài chính Cá nhân

Ứng dụng quản lý tài chính cá nhân toàn diện với các tính năng đầu tư và tối ưu dòng tiền thông minh.

## 🌟 Tính năng chính

### 1. Quản lý Danh mục Đầu tư Mở rộng

#### 🪙 Tiền mã hóa (Crypto)
- **Kết nối API**: Hỗ trợ kết nối Read-only API từ các sàn phổ biến:
  - Binance
  - OKX
  - Bybit
- **Theo dõi USDT/VND**: Tỷ giá tùy chỉnh để tính toán chính xác giá trị tài sản VND
- **Cảnh báo biến động**: Thiết lập ngưỡng cảnh báo cho từng đồng coin
  - Cắt lỗ (Stop Loss)
  - Chốt lời (Take Profit)
  - Biến động giá theo phần trăm

#### 🥇 Vàng & Bạc
- **Phân loại chi tiết**:
  - Vàng miếng SJC
  - Vàng nhẫn/Trang sức
  - Bạc
- **Giá trong nước**: Cập nhật từ các đơn vị lớn
  - SJC
  - Doji
  - PNJ

#### 📊 Quỹ đầu tư (Open-ended Funds & ETF)
- **Cập nhật NAV**: Tự động cập nhật giá trị tài sản ròng
- **So sánh hiệu suất**: Biểu đồ so sánh với VN-Index
- **Hỗ trợ các quỹ phổ biến**:
  - Dragon Capital
  - VinaCapital
  - SSIAM

### 2. 🎯 Tối ưu Thẻ Tín dụng (Credit Card Arbitrage) - TÍNH NĂNG KILLER

#### ⚡ Smart Swipe - Gợi ý thẻ quẹt thông minh
- Phân tích tất cả thẻ tín dụng của bạn
- Tính toán chu kỳ miễn lãi cho từng thẻ
- **Gợi ý thẻ tối ưu** để tận dụng tối đa thời gian miễn lãi (lên đến 55 ngày)
- Hiển thị ngày sao kê và hạn thanh toán

#### 💰 Cash-to-Savings - Gợi ý gửi tiết kiệm
Sau khi ghi nhận giao dịch thẻ, hệ thống tự động:
- Tính toán số ngày đến hạn thanh toán
- **Nếu còn >35 ngày**: Gợi ý gửi tiết kiệm kỳ hạn 1 tháng (lãi suất ~4.5%/năm)
- **Nếu còn 20-35 ngày**: Gợi ý tích lũy linh hoạt (Tikop, Finhay, iSave)
- **Nếu còn 10-20 ngày**: Gợi ý quỹ trái phiếu ngắn hạn (MMF)
- Tính toán **lãi dự kiến** so với trả ngay

#### ⏰ Auto Reminder - Nhắc nợ tự động
- Thông báo trước hạn thanh toán (tùy chỉnh 1-7 ngày)
- Nhắc đáo hạn sổ tiết kiệm để rút tiền thanh toán thẻ
- Tránh phí phạt và lãi suất cao

## 🚀 Bắt đầu

### Yêu cầu
- Node.js 18+
- npm hoặc yarn
- Tài khoản Supabase (miễn phí)
- Tài khoản Vercel (miễn phí) - nếu muốn deploy

### Development Local

```bash
# Clone repository
git clone https://github.com/tibicrypto/quan-ly-tai-san.git
cd quan-ly-tai-san

# Cài đặt dependencies
npm install

# Setup environment variables
cp .env.example .env
# Điền thông tin Supabase vào file .env

# Khởi tạo database
npx prisma db push

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

### 🌐 Deploy lên Production (Vercel + Supabase)

**Hướng dẫn chi tiết**: Xem [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

**Tóm tắt nhanh**:
1. Tạo project trên [Supabase](https://supabase.com) (chọn region Singapore)
2. Copy DATABASE_URL và DIRECT_URL từ Supabase
3. Deploy lên [Vercel](https://vercel.com) từ GitHub repository
4. Thêm environment variables trên Vercel
5. Chạy `npx prisma db push` để tạo tables

✅ Done! App sẵn sàng trên production với database cloud.

## 📱 Sử dụng

### Quản lý Đầu tư
1. Truy cập **Đầu tư** từ menu
2. Chọn loại tài sản (Crypto, Vàng/Bạc, Quỹ)
3. Thêm tài sản và theo dõi hiệu suất

### Tối ưu Thẻ Tín dụng

#### Thiết lập thẻ
1. Vào **Thẻ tín dụng** → **Thêm thẻ**
2. Nhập thông tin:
   - Ngân hàng
   - Tên thẻ
   - Ngày sao kê (1-31)
   - Chu kỳ miễn lãi (45-55 ngày)
   - Số ngày thanh toán sau sao kê (15-20 ngày)

#### Sử dụng Smart Swipe
1. Trước khi thanh toán, mở **Smart Swipe Optimizer**
2. Nhập số tiền dự định chi
3. Xem gợi ý thẻ tối ưu và thời gian miễn lãi
4. Xem gợi ý gửi tiết kiệm với lãi dự kiến

## 🏗️ Công nghệ

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Lucide Icons
- **Database**: SQLite + Prisma ORM
- **Language**: TypeScript
- **Biểu đồ**: Recharts
- **Date Utils**: date-fns

## 📊 Cấu trúc Database

### Đầu tư
- `CryptoAsset`: Tài sản crypto
- `GoldSilverAsset`: Vàng và bạc
- `FundAsset`: Quỹ đầu tư
- `PriceHistory`: Lịch sử giá

### Thẻ tín dụng
- `CreditCard`: Thông tin thẻ
- `CardTransaction`: Giao dịch thẻ
- `PaymentReminder`: Nhắc nhở thanh toán
- `SavingsRecommendation`: Gợi ý tiết kiệm

### Khác
- `ExchangeApiKey`: API keys (encrypted)
- `Settings`: Cài đặt ứng dụng

## 🔐 Bảo mật

- API Keys được mã hóa trong database
- Chỉ hỗ trợ Read-only API keys
- Không lưu trữ thông tin nhạy cảm như CVV, mật khẩu

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo Pull Request hoặc Issue.

## 📄 License

MIT License

## 💡 Ví dụ Sử dụng

### Scenario: Mua iPhone 30 triệu

1. **Bước 1**: Mở Smart Swipe, nhập 30,000,000 ₫
2. **Kết quả**: App gợi ý dùng thẻ VIB Online Plus
   - Vừa qua ngày sao kê ngày 20
   - Được miễn lãi đến 05/04 (43 ngày)
3. **Bước 2**: App gợi ý gửi tiết kiệm
   - Gửi 30 triệu vào sổ tiết kiệm 1 tháng
   - Lãi suất 4.5%/năm
   - **Lãi dự kiến: ~112,500 ₫**
4. **Bước 3**: Nhận thông báo trước 2 ngày
   - App nhắc rút tiền từ sổ tiết kiệm
   - Thanh toán thẻ đúng hạn

**Kết quả**: Có iPhone dùng ngay + kiếm được 112k lãi từ vốn ngân hàng! 🎉

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo Issue trên GitHub.