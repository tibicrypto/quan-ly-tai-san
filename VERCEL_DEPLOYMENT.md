# 🚀 Hướng dẫn Deploy lên Vercel với Supabase

## Bước 1: Tạo Project Supabase

1. Truy cập [Supabase](https://supabase.com)
2. Đăng nhập hoặc tạo tài khoản mới
3. Click **"New Project"**
4. Nhập thông tin:
   - **Name**: quan-ly-tai-san
   - **Database Password**: Tạo mật khẩu mạnh (lưu lại để dùng sau)
   - **Region**: Singapore (gần Việt Nam nhất)
5. Click **"Create new project"** và đợi ~2 phút

## Bước 2: Lấy Database Connection Strings

1. Vào project vừa tạo
2. Click vào **Settings** (biểu tượng bánh răng) ở sidebar
3. Click **Database** trong menu Settings
4. Cuộn xuống phần **Connection string**
5. Copy 2 URLs sau:

   **Transaction Pooler (DATABASE_URL):**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
   ```
   
   **Session Pooler (DIRECT_URL):**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

6. Thay `[YOUR-PASSWORD]` bằng database password bạn đã tạo ở bước 1

## Bước 3: Deploy lên Vercel

### 3.1. Chuẩn bị Repository

1. Push code lên GitHub (nếu chưa):
   ```bash
   git add .
   git commit -m "Update for Vercel and Supabase deployment"
   git push origin main
   ```

### 3.2. Deploy với Vercel

1. Truy cập [Vercel](https://vercel.com)
2. Đăng nhập bằng GitHub account
3. Click **"Add New Project"**
4. Import repository **tibicrypto/quan-ly-tai-san**
5. Trong phần **Environment Variables**, thêm:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | (Paste Transaction Pooler URL từ bước 2) |
   | `DIRECT_URL` | (Paste Session Pooler URL từ bước 2) |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (sẽ có sau khi deploy) |

6. Click **"Deploy"**
7. Đợi ~3-5 phút để Vercel build và deploy

## Bước 4: Migrate Database

Sau khi deploy thành công, cần chạy migration để tạo tables:

### Cách 1: Từ Local Machine (Khuyến nghị)

1. Tạo file `.env` trong project:
   ```bash
   cp .env.example .env
   ```

2. Điền thông tin vào `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Chạy migration:
   ```bash
   npm install
   npx prisma db push
   ```

4. Verify tables đã được tạo:
   ```bash
   npx prisma studio
   ```

### Cách 2: Từ Supabase Dashboard

1. Vào Supabase project
2. Click **SQL Editor** ở sidebar
3. Click **"New query"**
4. Copy toàn bộ schema từ `prisma/schema.prisma` và convert sang SQL
5. Chạy query

## Bước 5: Verify Deployment

1. Truy cập URL Vercel app của bạn (ví dụ: `https://quan-ly-tai-san.vercel.app`)
2. Kiểm tra các trang:
   - ✅ Homepage
   - ✅ /investments
   - ✅ /investments/crypto
   - ✅ /investments/gold
   - ✅ /investments/funds
   - ✅ /credit-cards
   - ✅ /settings

## Bước 6: Cập nhật Environment Variables (Nếu cần)

Nếu cần thay đổi environment variables sau khi deploy:

1. Vào Vercel Dashboard
2. Chọn project **quan-ly-tai-san**
3. Click **Settings**
4. Click **Environment Variables**
5. Thêm/Sửa/Xóa variables
6. Click **"Save"**
7. Redeploy lại project:
   - Vào tab **Deployments**
   - Click **"Redeploy"** ở deployment mới nhất

## 🔧 Troubleshooting

### Lỗi: "Can't reach database server"

**Nguyên nhân**: Connection string sai hoặc Supabase project chưa sẵn sàng

**Giải pháp**:
1. Kiểm tra lại DATABASE_URL và DIRECT_URL
2. Đảm bảo đã thay `[YOUR-PASSWORD]` bằng password thật
3. Đợi thêm vài phút nếu project Supabase mới tạo

### Lỗi: "Prisma Client not generated"

**Nguyên nhân**: Postinstall script không chạy

**Giải pháp**:
1. Check lại `package.json` có script `"postinstall": "prisma generate"`
2. Redeploy trên Vercel
3. Hoặc thêm build command: `prisma generate && next build`

### Lỗi: Build failed với "Module not found"

**Nguyên nhân**: Dependencies chưa được install đúng

**Giải pháp**:
1. Delete `node_modules` và `package-lock.json`
2. Chạy lại `npm install`
3. Commit và push lại

## 📊 Monitoring

### Supabase Dashboard
- **Database**: Xem tables, data, và performance
- **SQL Editor**: Chạy queries trực tiếp
- **Table Editor**: Sửa data dễ dàng
- **API**: REST API tự động tạo (nếu cần)

### Vercel Dashboard
- **Analytics**: Xem traffic và performance
- **Logs**: Debug errors
- **Deployments**: History và rollback

## 🔐 Security Best Practices

1. **Không commit** `.env` file vào Git
2. **Rotate passwords** định kỳ (3-6 tháng)
3. **Enable Row Level Security** (RLS) trên Supabase cho production
4. **Set up monitoring** alerts cho database usage
5. **Backup database** thường xuyên

## 🚀 Auto Deploy

Vercel tự động deploy khi:
1. Push code lên branch `main` hoặc `master`
2. Merge Pull Request
3. Create new branch (tạo preview deployment)

Disable auto deploy:
1. Vào **Settings** > **Git**
2. Tắt **Production Branch** hoặc **Preview Deployments**

## 📝 Lưu ý quan trọng

1. **Supabase Free Tier**:
   - 500 MB database space
   - 2 GB bandwidth/month
   - Pause sau 7 ngày không hoạt động
   - Đủ cho development và small apps

2. **Vercel Free Tier**:
   - 100 GB bandwidth/month
   - Unlimited deployments
   - Serverless functions: 100 GB-hours/month
   - Đủ cho hầu hết personal projects

3. **Database Connection**:
   - Sử dụng connection pooling (`pgbouncer=true`)
   - Giới hạn connections để tránh quá tải
   - Vercel serverless functions có lifecycle ngắn

## 🎯 Next Steps

1. ✅ Setup monitoring và alerts
2. ✅ Enable Supabase backups
3. ✅ Add custom domain (nếu cần)
4. ✅ Setup staging environment
5. ✅ Configure CORS nếu cần API external

---

**Chúc mừng! 🎉 App của bạn đã sẵn sàng trên production với Vercel + Supabase!**

Nếu có vấn đề, check:
- Vercel logs: https://vercel.com/dashboard
- Supabase logs: https://supabase.com/dashboard
