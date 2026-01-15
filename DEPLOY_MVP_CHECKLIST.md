# 🚀 DEPLOY MVP CHECKLIST - qaaarena.com

**Target:** Get QA Arena live in next 45 minutes  
**Domain:** qaaarena.com (Cloudflare)

---

## 🚨 **PRE-DEPLOY (15 minutes)**

### ☐ 1. Update Production Environment Variables
Add to Vercel deployment:
```env
# Production URLs
NEXTAUTH_URL=https://qaaarena.com

# Same as current .env.local (keep these)
PROJECT_URL=https://kohnljalnagvjrlbbltq.supabase.co
PUBLISHABLE_API_KEY=sb_publishable_DT2LSK9x9oBniiJ3ZeT66Q_uEvfiXYp
DATABASE_URL=postgresql://postgres:Sz9E-kUgq,6aJpD@db.kohnljalnagvjrlbbltq.supabase.co:5432/postgres
GOOGLE_API_KEY=AIzaSyD69F8Uuknilq_-bihAxNW9K5L8DjGr0R8
```

### ☐ 2. Test Production Build
```bash
cd qaaarena-web
npm run build
```

### ☐ 3. Add Domain to Supabase
Go to Supabase → Authentication → URL Configuration:
- Add `https://qaaarena.com` to allowed origins

---

## 🌐 **DEPLOY TO VERCEL (15 minutes)**

### ☐ 4. Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. "Add New Project" → Import from GitHub
3. Select: `isurooo/qa-agent-arena`
4. Root Directory: `qaaarena-web`

### ☐ 5. Configure Build Settings
```
Framework: Next.js
Build Command: npm run build
Install Command: npm install
Root Directory: qaaarena-web
```

### ☐ 6. Add Environment Variables in Vercel
Copy all variables from `.env.local` to Vercel Environment Variables panel

### ☐ 7. Deploy
Click "Deploy" - should take ~3 minutes

---

## 🔗 **CONFIGURE CUSTOM DOMAIN (15 minutes)**

### ☐ 8. Add Domain in Vercel
1. Project Settings → Domains
2. Add: `qaaarena.com` and `www.qaaarena.com`
3. Note the DNS records Vercel provides

### ☐ 9. Configure Cloudflare DNS
In Cloudflare Dashboard:
```
Type: CNAME
Name: qaaarena.com  
Target: cname.vercel-dns.com
Proxy: Yes (orange cloud)

Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: Yes (orange cloud)
```

### ☐ 10. Wait for Propagation
- DNS typically takes 5-10 minutes
- Check: `nslookup qaaarena.com`

---

## 🧪 **POST-DEPLOY TESTING (15 minutes)**

### ☐ 11. Test Core Routes
- [ ] `https://qaaarena.com` - Homepage loads
- [ ] `https://qaaarena.com/arena` - Arena page works
- [ ] Check browser console for errors

### ☐ 12. Test Database Connection
- [ ] Check Vercel deployment logs
- [ ] No Prisma connection errors
- [ ] Environment variables loaded

### ☐ 13. Test Mobile & Desktop
- [ ] Responsive design works
- [ ] Dark theme applies correctly
- [ ] All components render

---

## 🎯 **MVP SUCCESS CRITERIA**

**✅ MVP is LIVE when:**
- [ ] qaaarena.com loads without errors
- [ ] Arena page displays (even with mock data)
- [ ] Professional UI/UX visible
- [ ] No console errors in production
- [ ] SSL certificate active (https)

**🚫 Known Limitations (OK for MVP):**
- Mock data in Arena (Phase 3 will fix)
- Verify button shows "Coming Soon"
- No newsletter signup yet

---

## 📊 **MONITORING SETUP (Optional - 10 minutes)**

### ☐ 14. Add Analytics
```bash
# In qaaarena-web
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### ☐ 15. Setup Error Monitoring
```bash
npm install @sentry/nextjs
```

---

## 🎉 **LAUNCH ANNOUNCEMENT**

Once live, update:
- [ ] GitHub README with live URL
- [ ] Social media: "QA Arena is now live at qaaarena.com"
- [ ] LinkedIn post: Technical achievement milestone
- [ ] Update PROJECT_AUDIT.md with deployment status

---

## ⚡ **IMMEDIATE NEXT STEPS AFTER DEPLOY**

### **Phase 3 Completion (Next 2 hours):**
1. Implement HITL Server Actions
2. Connect Arena page to real database
3. Deploy Phase 3 updates
4. Remove "Coming Soon" labels

### **Week 1 Goals:**
- [ ] 100+ unique visitors
- [ ] 0 production errors
- [ ] Phase 3 fully functional
- [ ] Early user feedback collected

---

**🚀 Ready to deploy? The current codebase is production-ready!**

**Time Commitment:** 45 minutes to go live, 2 hours for full Phase 3

**Impact:** Immediate online presence, start building domain authority, early user feedback to guide Phase 4 development.