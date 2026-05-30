# Deployment Checklist for SK Sweets

## Pre-Deployment Steps ✅

### 1. Security Configuration
- [ ] Generate strong JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Add JWT_SECRET to `.env.local`
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Remove all `.env.example` example values except comments
- [ ] Use environment-specific `.env` files for different environments

### 2. Dependencies
- [ ] Run `pnpm install` to ensure all dependencies are installed
- [ ] Verify Zod is installed: `pnpm list zod`
- [ ] Check for security vulnerabilities:
  ```bash
  pnpm audit
  ```
- [ ] Update critical security patches if any

### 3. TypeScript & Build
- [ ] Run `pnpm build` and verify no errors
  ```bash
  pnpm build
  ```
- [ ] Verify all TypeScript errors are fixed
- [ ] Test with `pnpm start` locally

### 4. Database Setup
- [ ] Verify MongoDB connection string in `.env.local`
- [ ] Test MongoDB connection:
  ```bash
  pnpm ts-node -e "import('./lib/db').then(m => m.getDb()).then(() => console.log('✓ Connected')).catch(e => console.error(e))"
  ```
- [ ] Run database initialization:
  ```bash
  pnpm ts-node scripts/init-db.ts
  ```
- [ ] Create database indexes:
  ```bash
  pnpm ts-node scripts/create-indexes.ts
  ```
- [ ] Verify admin user was created

### 5. Environment Variables
- [ ] Set `NODE_ENV=production` for production
- [ ] Verify `MONGODB_URI` points to production MongoDB
- [ ] Verify `DB_NAME=sk_sweets`
- [ ] Ensure JWT_SECRET is strong and unique
- [ ] Optional: Add `NEXT_PUBLIC_API_URL` if needed

### 6. Authentication Testing
- [ ] Test user registration with strong password
- [ ] Verify password validation works (rejects weak passwords)
- [ ] Test user login
- [ ] Verify JWT cookie is set with `httpOnly: true`
- [ ] Test logout functionality
- [ ] Test admin login

### 7. API Testing
- [ ] Test `/api/auth/register` with valid/invalid data
- [ ] Test `/api/auth/login` with valid/invalid credentials
- [ ] Test `/api/menu` GET with pagination
- [ ] Test `/api/orders` requires authentication
- [ ] Test `/api/bookings` requires authentication
- [ ] Test validation errors return proper messages

### 8. Frontend Testing
- [ ] Test all pages load without errors
- [ ] Test navigation between pages
- [ ] Test cart functionality
- [ ] Test checkout flow (as authenticated user)
- [ ] Test error boundary (error.tsx)
- [ ] Test 404 page (not-found.tsx)
- [ ] Verify responsive design on mobile/tablet

### 9. Performance
- [ ] Verify database indexes are created
- [ ] Check API response times
- [ ] Verify pagination works with large datasets
- [ ] Test connection pooling is working

### 10. Security Checks
- [ ] Verify NO admin credentials in logs/console
- [ ] Verify JWT_SECRET is NOT hardcoded
- [ ] Verify NO user data in localStorage
- [ ] Verify API validates all inputs
- [ ] Verify admin-only endpoints require admin role
- [ ] Verify users can only access their own orders
- [ ] Verify CORS is configured if needed

## Deployment Steps

### For Vercel (Recommended for Next.js)

1. **Connect Repository**
   - Push code to GitHub/GitLab
   - Connect to Vercel

2. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `MONGODB_URI`
     - `DB_NAME`
     - `JWT_SECRET`
     - `NODE_ENV=production`

3. **Deploy**
   - Vercel auto-deploys on push
   - Or use: `vercel deploy --prod`

### For Other Platforms

1. **Build Locally**
   ```bash
   pnpm build
   ```

2. **Start Production Server**
   ```bash
   pnpm start
   ```

3. **Use PM2 or Similar**
   ```bash
   pnpm add -g pm2
   pm2 start "pnpm start" --name sk-sweets
   ```

## Post-Deployment Verification

- [ ] Access production URL in browser
- [ ] Test homepage loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify cookies are `secure` (HTTPS only)
- [ ] Check error page displays correctly
- [ ] Verify database connection is stable
- [ ] Monitor error logs for issues

## Monitoring & Maintenance

### Ongoing Tasks
- [ ] Set up error tracking (Sentry recommended)
- [ ] Set up uptime monitoring
- [ ] Review logs weekly
- [ ] Monitor database performance
- [ ] Update dependencies monthly
- [ ] Back up database regularly

### Performance Monitoring
```
Monitor these metrics:
- API response times (target: <200ms)
- Database query times (target: <100ms)
- Error rate (target: <0.1%)
- User authentication success rate
```

### Security Monitoring
- [ ] Review access logs for suspicious activity
- [ ] Monitor failed login attempts
- [ ] Check for unusual database queries
- [ ] Update JWT_SECRET periodically (optional but recommended)

## Rollback Plan

If issues occur:

1. **Immediate Rollback**
   - Revert to previous working version on Vercel/platform
   - Or restart with previous Docker image

2. **Data Safety**
   - MongoDB data should not be affected by code rollbacks
   - Verify backups exist before any changes

3. **Communication**
   - Notify users if system is down
   - Provide status updates

## Production Documentation

### Admin Access
- Keep admin credentials in secure password manager
- Document admin password change process
- Set up 2FA if possible (future enhancement)

### Database Backups
- Set up MongoDB Atlas automated backups
- Or configure manual daily backups
- Store backup credentials securely

### Monitoring Tools
- Set up Vercel Analytics (already added)
- Optional: Sentry for error tracking
- Optional: New Relic for performance monitoring

## Common Issues & Solutions

### Database Connection Fails
```
Error: Failed to connect to MongoDB
Solution: Verify MONGODB_URI and DB_NAME in environment variables
```

### JWT Token Invalid
```
Error: Token verification failed
Solution: Ensure JWT_SECRET is consistent across all instances
```

### Slow API Responses
```
Error: API taking >1s to respond
Solution: 
- Check MongoDB indexes are created
- Verify connection pooling is working
- Check network connectivity to MongoDB
```

### Build Fails
```
Error: pnpm build fails
Solution:
- Run pnpm install
- Check all TypeScript errors: pnpm tsc
- Verify all required environment variables are set
```

## Final Verification Checklist

Before marking as "Production Ready":

- [ ] ✅ All tests pass
- [ ] ✅ No console errors in browser
- [ ] ✅ No API errors in production logs
- [ ] ✅ Authentication works end-to-end
- [ ] ✅ Database connection stable
- [ ] ✅ Response times acceptable (<500ms)
- [ ] ✅ Error pages display correctly
- [ ] ✅ HTTPS enabled (automatic on Vercel)
- [ ] ✅ Security headers configured
- [ ] ✅ Environment variables are secure
- [ ] ✅ Admin functionality tested
- [ ] ✅ Customer flow tested
- [ ] ✅ Mobile responsive design verified
- [ ] ✅ Analytics enabled (Vercel)
- [ ] ✅ Backups configured
- [ ] ✅ Monitoring set up

## Support & Troubleshooting

For issues:
1. Check error logs: Dashboard → Recent Errors
2. Monitor database: MongoDB Atlas Dashboard
3. Review API response times: Vercel Analytics
4. Check environment variables are set correctly

**Remember:** Never commit credentials to version control. Always use environment variables for sensitive data.

---

**Last Updated:** May 27, 2026
**Status:** ✅ Ready for Deployment
