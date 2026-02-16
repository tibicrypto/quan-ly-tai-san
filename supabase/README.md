# Supabase Setup Guide

Hướng dẫn cấu hình và import database schema vào Supabase cho ứng dụng Quản lý Tài sản.

## 📋 Yêu cầu

- Tài khoản Supabase (miễn phí tại [supabase.com](https://supabase.com))
- Project Supabase đã được tạo

## 🚀 Các bước cài đặt

### Bước 1: Tạo Project trên Supabase

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Điền thông tin:
   - **Project Name**: quan-ly-tai-san (hoặc tên bạn muốn)
   - **Database Password**: Tạo mật khẩu mạnh và **LƯU LẠI**
   - **Region**: Singapore (hoặc gần Việt Nam nhất)
   - **Pricing Plan**: Free
4. Click "Create new project" và đợi vài phút để project được khởi tạo

### Bước 2: Lấy thông tin kết nối

Sau khi project được tạo, vào **Settings** → **Database**:

#### Connection String
Tìm mục "Connection string" và copy các giá trị:

- **URI**: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
- **Connection pooling**: `postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

#### API Keys
Vào **Settings** → **API**:

- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **anon public**: `eyJhbGc...` (key dài)
- **service_role**: `eyJhbGc...` (key dài - **BẢO MẬT**)

### Bước 3: Cấu hình Environment Variables

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Điền các thông tin vừa lấy được:

```env
# Database URLs
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Lưu ý quan trọng**:
- `DATABASE_URL`: Dùng connection pooling (port 6543) cho production
- `DIRECT_URL`: Dùng direct connection (port 5432) cho migrations
- **KHÔNG** commit file `.env.local` lên git
- Service role key có quyền admin, **giữ bí mật**

### Bước 4: Import Database Schema

Có 2 cách để import schema vào Supabase:

#### Cách 1: Sử dụng SQL Editor (Khuyến nghị)

1. Mở **SQL Editor** trong Supabase Dashboard
2. Click "New query"
3. Copy toàn bộ nội dung file `migrations/20260216_init_schema.sql`
4. Paste vào editor
5. Click "Run" hoặc nhấn `Ctrl+Enter`
6. Đợi vài giây để tất cả tables được tạo

#### Cách 2: Sử dụng Prisma CLI

```bash
# Cài đặt dependencies
npm install

# Push schema to Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Bước 5: Xác nhận cài đặt thành công

1. Trong Supabase Dashboard, vào **Table Editor**
2. Kiểm tra xem các bảng sau đã được tạo:
   - ✅ CryptoAsset
   - ✅ CryptoTransaction
   - ✅ GoldSilverAsset
   - ✅ FundAsset
   - ✅ FundTransaction
   - ✅ CreditCard
   - ✅ CardTransaction
   - ✅ PaymentReminder
   - ✅ SavingsRecommendation
   - ✅ ExchangeApiKey
   - ✅ PriceHistory
   - ✅ Settings

3. Kiểm tra RLS (Row Level Security) đã được bật:
   - Vào mỗi table, tab "Policies"
   - Xem policy "Enable all access for authenticated users"

### Bước 6: Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Truy cập [http://localhost:3000](http://localhost:3000) để sử dụng ứng dụng.

## 🔐 Bảo mật

### Row Level Security (RLS)

Tất cả các bảng đã được cấu hình với RLS policies:
- Chỉ authenticated users mới có thể truy cập dữ liệu
- Mỗi user chỉ thấy dữ liệu của mình (có thể tùy chỉnh thêm)

### Authentication

Để sử dụng authentication, cần cấu hình thêm:

1. Vào **Authentication** → **Providers**
2. Bật các providers bạn muốn:
   - Email/Password
   - Google OAuth
   - GitHub OAuth
   - etc.

3. Cập nhật code authentication trong app:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## 📊 Quản lý Database

### Xem dữ liệu
- Sử dụng **Table Editor** trong Supabase Dashboard
- Hoặc dùng Prisma Studio: `npx prisma studio`

### Backup Database
1. Vào **Database** → **Backups**
2. Supabase tự động backup hàng ngày (Free plan: giữ 7 ngày)
3. Có thể tạo manual backup bất kỳ lúc nào

### Migration mới
Khi có thay đổi schema:

```bash
# Cập nhật schema.prisma
# Sau đó chạy:
npx prisma db push

# Hoặc tạo migration file mới
npx prisma migrate dev --name your_migration_name
```

## 🐛 Troubleshooting

### Lỗi kết nối database
- Kiểm tra password có đúng không
- Kiểm tra project-ref trong URL
- Đảm bảo sử dụng đúng URL (pooling vs direct)

### Lỗi RLS
Nếu không thể query dữ liệu:
- Kiểm tra user đã authenticated chưa
- Xem lại policies trong Table Editor
- Tạm thời disable RLS để test (không khuyến nghị ở production)

### Lỗi migration
Nếu `prisma db push` lỗi:
- Sử dụng DIRECT_URL thay vì DATABASE_URL
- Đảm bảo không có connection pooling trong migration
- Xóa tables và import lại SQL file

## 📚 Tài liệu tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 💡 Lưu ý quan trọng

1. **Free Plan Limits**:
   - 500 MB database storage
   - 1 GB file storage
   - 2 GB bandwidth/month
   - Pause sau 1 tuần inactive

2. **Connection Limits**:
   - Sử dụng connection pooling (DATABASE_URL) để tránh hết connection
   - Direct URL chỉ dùng cho migrations

3. **Security**:
   - Không bao giờ commit service role key lên git
   - Sử dụng environment variables cho sensitive data
   - Cấu hình RLS policies phù hợp với use case

## 🆘 Hỗ trợ

Nếu gặp vấn đề, tạo Issue trên GitHub repository hoặc liên hệ support của Supabase.
