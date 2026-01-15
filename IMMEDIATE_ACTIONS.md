# ⚡ IMMEDIATE ACTION CHECKLIST

**Target:** Get QA Agent Arena fully functional in next 2 hours

---

## 🚨 PHASE 1: Environment Setup (30 minutes)

### ☐ 1. Create Environment Variables
```bash
cd /Users/isuru/Project/qa-agent-arena/qaaarena-web
touch .env.local
```

Add to `.env.local`:
```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/[YOUR_DB]"
PROJECT_URL="https://[your-project-id].supabase.co"
PUBLISHABLE_API_KEY="[your_supabase_anon_key]"

# Google AI Configuration
GOOGLE_API_KEY="[your_gemini_api_key]"

# Next.js Configuration
NEXTAUTH_SECRET="[generate_random_string]"
NEXTAUTH_URL="http://localhost:3000"
```

### ☐ 2. Remove Duplicate Code
```bash
# Delete duplicate Next.js project
rm -rf /Users/isuru/Project/qa-agent-arena/my-app

# Delete redundant components
rm /Users/isuru/Project/qa-agent-arena/qaaarena-web/components/Comparison.tsx
rm -rf /Users/isuru/Project/qa-agent-arena/qaaarena-web/components/demo
rm -rf /Users/isuru/Project/qa-agent-arena/qaaarena-web/arena-agent
```

### ☐ 3. Setup Database
```bash
cd qaaarena-web
npm install @prisma/client
npx prisma generate
npx prisma migrate dev --name init
```

---

## ⚡ PHASE 2: Core Functionality (90 minutes)

### ☐ 4. Create Database Connection (`lib/db.ts`)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### ☐ 5. Implement HITL Server Actions (`lib/actions.ts`)
```typescript
"use server"
import { prisma } from './db'

export async function verifyBenchmarkRun(
  runId: number, 
  adminNotes: string,
  isVerified: boolean = true
) {
  // Implementation needed
}
```

### ☐ 6. Create API Routes
- [ ] `app/api/auditor/route.ts`
- [ ] `app/api/scout/route.ts`
- [ ] `app/api/verify/route.ts`

### ☐ 7. Fix Scout Agent Dependencies
```bash
cd /Users/isuru/Project/qa-agent-arena/.venv
pip install google-generativeai httpx supabase python-dotenv python-dateutil
```

### ☐ 8. Update Arena Page to Use Real Data
- [ ] Connect to database via server components
- [ ] Replace mock data with actual ArenaRun queries
- [ ] Add loading states and error handling

---

## 🎯 PHASE 3: Testing & Validation (30 minutes)

### ☐ 9. Test Database Connection
```bash
npx prisma studio  # Opens database browser
```

### ☐ 10. Test Dev Server
```bash
npm run dev  # Should start without errors
```

### ☐ 11. Test AI Agents
- [ ] Call Auditor via API route
- [ ] Run Scout agent manually
- [ ] Verify data appears in database

### ☐ 12. Test HITL Workflow
- [ ] Load Arena page
- [ ] Click "Verify" button
- [ ] Check database for verification record

---

## 📝 COMPLETION CRITERIA

**Phase 3 is DONE when:**
- [ ] Arena page loads without errors
- [ ] Database connection working
- [ ] Verify button updates database
- [ ] AI agents can be called via API
- [ ] No terminal errors or build failures

**Success Metrics:**
- [ ] `npm run dev` runs cleanly
- [ ] `/arena` page displays real data
- [ ] Prisma Studio shows populated tables
- [ ] All environment variables loaded

---

## 🚨 IF STUCK, CHECK:

1. **Environment Variables:** `echo $DATABASE_URL`
2. **Prisma Client:** `npx prisma generate`
3. **Database:** `npx prisma migrate status`
4. **Dependencies:** `npm install`
5. **Python Virtual Env:** `source .venv/bin/activate`

---

**Time Allocation:**
- Environment Setup: 30 min
- Database & Server Actions: 60 min  
- API Routes & Testing: 30 min
- **Total: 2 hours**

---

*Use this checklist to track progress. Check off items as you complete them.*