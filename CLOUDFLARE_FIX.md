# 🔧 Cloudflare Pages Configuration Fix

## 🚨 Current Issue:
```
Error: Cannot find cwd: /opt/buildhome/repo/qaaarena-web
```

## ✅ Correct Cloudflare Pages Settings:

### **Build Configuration:**
```yaml
Root Directory: . 
# (Leave empty or use "." for root)

Build Command: cd qaaarena-web && npm install && npm run build

Build Output Directory: qaaarena-web/.next

Node.js Version: 20.x
```

### **Environment Variables:**
Add these in Cloudflare Pages → Settings → Environment Variables:
```env
PROJECT_URL=https://kohnljalnagvjrlbbltq.supabase.co
PUBLISHABLE_API_KEY=sb_publishable_DT2LSK9x9oBniiJ3ZeT66Q_uEvfiXYp
DATABASE_URL=postgresql://postgres:Sz9E-kUgq,6aJpD@db.kohnljalnagvjrlbbltq.supabase.co:5432/postgres
GOOGLE_API_KEY=AIzaSyD69F8Uuknilq_-bihAxNW9K5L8DjGr0R8
NEXTAUTH_SECRET=qa-arena-secret-2026
NEXTAUTH_URL=https://qaaarena.com
```

## 🛠️ Step-by-Step Fix:

1. **Go to Cloudflare Dashboard → Pages → Your Project**
2. **Click "Settings" tab**
3. **Scroll to "Build configuration"**
4. **Update the following:**
   - Root directory: **.** (dot for root)
   - Build command: **cd qaaarena-web && npm install && npm run build**
   - Build output directory: **qaaarena-web/.next**
5. **Click "Save"**
6. **Go to "Environment variables" tab**
7. **Add all the environment variables above**
8. **Click "Redeploy" to trigger a new build**

## 🎯 Alternative: Quick Vercel Deploy

If Cloudflare Pages continues to have issues, Vercel is much simpler:

1. **Go to vercel.com**
2. **Import GitHub project: qa-agent-arena**
3. **Set Root Directory: qaaarena-web**
4. **Add environment variables**
5. **Deploy** (works immediately)

## 📞 Current Status:
- ✅ Build works locally (`npm run build` = success)
- ✅ Code is production-ready
- ❌ Cloudflare Pages misconfigured
- 🔧 Need to fix build settings

**Recommendation:** Try the Cloudflare fix first (5 minutes), if it still fails, switch to Vercel (10 minutes).