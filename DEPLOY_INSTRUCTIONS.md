# 🚀 Hướng dẫn Deploy - React OAS Integration v4.0

## ✅ Trạng thái hiện tại

- ✅ **Build thành công**: Production build đã được tạo
- ✅ **Vercel config**: `vercel.json` đã được cấu hình
- ✅ **Scripts**: Scripts deployment đã sẵn sàng

## 🎯 Các phương thức Deploy

### Option 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Truy cập Vercel Dashboard**:
   - Mở: <https://vercel.com/new>
   - Đăng nhập với GitHub account

2. **Import Repository**:
   - Click "Import Git Repository"
   - Chọn: `caovinhphuc/React-OAS-Integration-v4.0`
   - Hoặc paste URL: `https://github.com/caovinhphuc/React-OAS-Integration-v4.0`

3. **Configure Project**:
   - Framework Preset: **Create React App** (tự động)
   - Root Directory: `./` (mặc định)
   - Build Command: `npm run build` (tự động)
   - Output Directory: `build` (tự động)
   - Install Command: `npm install` (tự động)

4. **Environment Variables** (Thêm trong Vercel Dashboard):

   ```bash
   # Required
   REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID=your_id
   REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_id
   REACT_APP_API_URL=https://your-api.com

   # Optional
   REACT_APP_LANGUAGE=vi
   REACT_APP_TIMEZONE=Asia/Ho_Chi_Minh
   REACT_APP_ENABLE_ANALYTICS=true
   ```

5. **Click "Deploy"** và chờ build hoàn tất (2-5 phút)

6. **Nhận URL**:
   - Production URL: `https://react-oas-integration-v4-[hash].vercel.app`
   - Tự động deploy mỗi khi push code lên GitHub!

---

### Option 2: Deploy qua Vercel CLI (Local)

1. **Cài đặt Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Đăng nhập**:

   ```bash
   vercel login
   ```

3. **Deploy Preview**:

   ```bash
   ./deploy-vercel.sh
   # Hoặc
   vercel
   ```

4. **Deploy Production**:

   ```bash
   vercel --prod
   ```

---

### Option 3: Deploy qua Git Push (Auto-deploy)

Sau khi đã kết nối repository trong Vercel Dashboard:

1. **Commit và push code**:

   ```bash
   git add .
   git commit -m "feat: ready for production"
   git push origin main
   ```

2. **Vercel tự động deploy**:
   - Mỗi push lên `main` branch → Auto deploy production
   - Mỗi push lên branch khác → Auto deploy preview

---

## 📋 Checklist trước khi Deploy

- [x] ✅ Build thành công (`npm run build`)
- [x] ✅ Dependencies đã được cài đặt
- [x] ✅ Vercel config (`vercel.json`) đã có
- [ ] ⚠️ Environment variables đã được cấu hình trong Vercel Dashboard
- [ ] ⚠️ GitHub repository đã được push code mới nhất
- [ ] ⚠️ Đã test các chức năng chính

---

## 🔍 Kiểm tra sau khi Deploy

1. **Kiểm tra URL deployment**:
   - Mở URL được Vercel cung cấp
   - Kiểm tra trang chủ load đúng

2. **Kiểm tra các chức năng**:
   - ✅ Dashboard load được
   - ✅ API calls hoạt động
   - ✅ Google Sheets integration (nếu đã cấu hình)
   - ✅ WebSocket connection (nếu backend đã deploy)

3. **Xem Logs**:
   - Vào Vercel Dashboard → Project → Deployments
   - Click vào deployment mới nhất → View Logs

---

## 🛠️ Troubleshooting

### Build fails

- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo tất cả dependencies đã được cài đặt
- Kiểm tra `package.json` scripts

### Environment variables không hoạt động

- Kiểm tra tên biến (phải bắt đầu với `REACT_APP_`)
- Re-deploy sau khi thêm/sửa env vars

### 404 errors

- Kiểm tra `vercel.json` rewrites configuration
- Đảm bảo routing đúng (React Router)

---

## 📚 Tài liệu tham khảo

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://cra.link/deployment)

---

## 🎉 Sau khi Deploy thành công

1. ✅ Kiểm tra URL production
2. ✅ Test các chức năng chính
3. ✅ Cấu hình custom domain (nếu cần)
4. ✅ Setup monitoring và analytics
5. ✅ Thông báo team về deployment

---

**Chúc bạn deploy thành công! 🚀**
