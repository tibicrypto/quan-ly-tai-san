# Hướng dẫn Import SQL vào Supabase

Tài liệu này hướng dẫn chi tiết cách import cấu trúc database vào Supabase cho ứng dụng Quản lý Tài sản.

## 📦 File SQL đã tạo

File SQL migration được lưu tại: `supabase/migrations/20260216_init_schema.sql`

File này bao gồm:
- ✅ Tất cả các bảng (tables) từ Prisma schema
- ✅ Foreign keys và relationships
- ✅ Indexes cho performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers để tự động cập nhật `updatedAt`
- ✅ Dữ liệu khởi tạo (default settings)
- ✅ Comments cho documentation

## 🎯 Phương pháp Import

### Phương pháp 1: SQL Editor (Khuyến nghị - Dễ nhất)

**Ưu điểm**: 
- Không cần cài đặt gì thêm
- Visual feedback ngay lập tức
- Dễ debug nếu có lỗi

**Các bước**:

1. **Đăng nhập Supabase Dashboard**
   - Truy cập https://app.supabase.com
   - Chọn project của bạn

2. **Mở SQL Editor**
   - Click vào "SQL Editor" trong menu bên trái
   - Click nút "New query"

3. **Copy nội dung SQL**
   - Mở file `supabase/migrations/20260216_init_schema.sql`
   - Copy toàn bộ nội dung (Ctrl+A, Ctrl+C)

4. **Paste và Execute**
   - Paste vào SQL Editor (Ctrl+V)
   - Click nút "Run" hoặc nhấn Ctrl+Enter
   - Đợi vài giây để hoàn thành

5. **Verify**
   - Vào "Table Editor" để kiểm tra
   - Bạn sẽ thấy tất cả 12 tables đã được tạo

### Phương pháp 2: Prisma CLI (Tự động)

**Ưu điểm**:
- Tự động sync schema từ Prisma
- Dễ dàng update sau này
- Tích hợp tốt với development workflow

**Các bước**:

1. **Cài đặt dependencies** (nếu chưa có)
```bash
npm install
```

2. **Cấu hình .env.local**
```bash
cp .env.example .env.local
# Edit .env.local với thông tin Supabase của bạn
```

3. **Push schema lên Supabase**
```bash
npx prisma db push
```

4. **Generate Prisma Client**
```bash
npx prisma generate
```

### Phương pháp 3: psql Command Line

**Ưu điểm**:
- Nhanh nhất cho experienced users
- Có thể script automation

**Yêu cầu**: PostgreSQL client (psql) đã cài đặt

**Các bước**:

1. **Lấy DIRECT_URL từ Supabase**
   - Settings > Database > Connection string
   - Copy "URI" (không phải connection pooling)

2. **Chạy import command**
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/20260216_init_schema.sql
```

3. **Hoặc dùng setup script**
```bash
chmod +x supabase/setup-database.sh
./supabase/setup-database.sh
```

## 📋 Checklist sau khi Import

Sau khi import thành công, kiểm tra các điểm sau:

### 1. Tables đã được tạo
Vào **Table Editor**, verify 12 tables:
- [ ] CryptoAsset
- [ ] CryptoTransaction
- [ ] GoldSilverAsset
- [ ] FundAsset
- [ ] FundTransaction
- [ ] CreditCard
- [ ] CardTransaction
- [ ] PaymentReminder
- [ ] SavingsRecommendation
- [ ] ExchangeApiKey
- [ ] PriceHistory
- [ ] Settings

### 2. Row Level Security (RLS) đã được enable
Chọn bất kỳ table nào:
- [ ] Tab "Policies" hiển thị policy "Enable all access for authenticated users"
- [ ] RLS badge shows "Enabled"

### 3. Indexes đã được tạo
Trong Table Editor, tab "Indexes":
- [ ] Mỗi table có ít nhất 1 index
- [ ] Foreign keys có indexes

### 4. Triggers đã được tạo
Chạy query này trong SQL Editor:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```
- [ ] Có 9 triggers cho `update_updated_at`

### 5. Default data đã được insert
Query Settings table:
```sql
SELECT * FROM "Settings";
```
- [ ] Có 1 row với id='default'

## 🔧 Troubleshooting

### Lỗi: "permission denied"
**Nguyên nhân**: Đang dùng anon key thay vì service role key

**Giải pháp**:
- Dùng SQL Editor trong Supabase Dashboard (tự động dùng service role)
- Hoặc dùng DIRECT_URL trong .env.local

### Lỗi: "table already exists"
**Nguyên nhân**: Tables đã tồn tại từ lần import trước

**Giải pháp**:
```sql
-- Drop all tables (CẨN THẬN: Sẽ xóa hết dữ liệu)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Sau đó import lại SQL file
```

### Lỗi: "syntax error at or near"
**Nguyên nhân**: File SQL bị corrupt hoặc copy không đầy đủ

**Giải pháp**:
- Download lại file SQL từ repository
- Đảm bảo copy toàn bộ nội dung
- Kiểm tra encoding (phải là UTF-8)

### Lỗi kết nối với psql
**Nguyên nhân**: Connection string không đúng

**Giải pháp**:
- Kiểm tra password có đúng không
- Kiểm tra project-ref
- Đảm bảo dùng DIRECT_URL (port 5432), không phải pooling URL

## 🔄 Update Schema sau này

Khi có thay đổi trong `prisma/schema.prisma`:

### Option 1: Dùng Prisma
```bash
# Push changes to Supabase
npx prisma db push

# Tạo migration file (recommended)
npx prisma migrate dev --name your_migration_name
```

### Option 2: Manual SQL
1. Viết migration SQL file mới
2. Đặt tên: `supabase/migrations/YYYYMMDD_description.sql`
3. Import bằng SQL Editor hoặc psql

## 📊 Kiểm tra Schema

### Xem tất cả tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Xem structure của một table
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'CryptoAsset'
ORDER BY ordinal_position;
```

### Xem tất cả foreign keys
```sql
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Xem tất cả indexes
```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## 🎓 Best Practices

1. **Backup trước khi thay đổi**
   - Luôn tạo backup trước khi modify schema
   - Supabase Dashboard > Database > Backups

2. **Test trên Development trước**
   - Tạo project Supabase riêng cho dev/staging
   - Test migrations trước khi apply lên production

3. **Version control cho migrations**
   - Commit tất cả migration files vào git
   - Đặt tên rõ ràng với timestamp

4. **Document changes**
   - Viết comment trong SQL files
   - Update README khi có thay đổi lớn

## 📚 Resources

- [Supabase SQL Editor Docs](https://supabase.com/docs/guides/database/overview)
- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 💬 Support

Nếu gặp vấn đề:
1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Tạo Issue trên GitHub repository
3. Liên hệ Supabase Support (nếu là vấn đề về platform)

---

**Lưu ý**: File này được tạo tự động dựa trên Prisma schema. Nếu có thay đổi schema, cần regenerate SQL migration file.
