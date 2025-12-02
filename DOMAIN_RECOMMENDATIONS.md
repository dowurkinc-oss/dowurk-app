# Domain Strategy - DowUrk AI

## Your Situation:

✅ You own: **www.dowurktoday.com** (at ueni.com)
✅ You own: **www.dowurktoday.org**
✅ Current site exists at dowurktoday.com
✅ New application ready to deploy

---

## Recommendation: Use www.dowurktoday.com ⭐

### Why .com?

1. **More Professional** - .com is most trusted by users
2. **Better SEO** - Search engines favor .com domains
3. **Easier to Remember** - People default to .com
4. **Business Standard** - .com is the business standard
5. **Already Owned** - You already have it!

### Why NOT .org?

❌ .org is for nonprofits (your business serves nonprofits but isn't one)
❌ Confusing brand identity
❌ Lower trust for commercial services
❌ Users will search for .com anyway

---

## Deployment Strategy:

### Phase 1: Deploy to Heroku First (Today)

**Use temporary Heroku URLs:**
- Frontend: https://dowurk-app.herokuapp.com
- Backend: https://dowurk-api.herokuapp.com

**Why?**
- Test everything works before switching domain
- No downtime on your current site
- Safe rollback if issues found
- Takes 1-2 hours

### Phase 2: Connect Custom Domain (This Week)

**After testing on Heroku, connect:**
- Main site: https://www.dowurktoday.com
- API: https://api.dowurktoday.com
- Redirect: dowurktoday.com → www.dowurktoday.com

**Steps:**
1. Update DNS at ueni.com (CNAME records)
2. Wait for propagation (5 mins - 48 hours)
3. Test new site
4. Old site automatically replaced

---

## DNS Configuration:

### At ueni.com DNS Manager:

**Add/Update these records:**

```
# Main website
Type: CNAME
Name: www
Value: dowurk-app.herokudns.com
TTL: 300

# Root domain (if supported)
Type: ALIAS or ANAME
Name: @
Value: dowurk-app.herokudns.com
TTL: 300

# API subdomain
Type: CNAME
Name: api
Value: dowurk-api.herokudns.com
TTL: 300
```

**Note:** Get exact Heroku DNS values after deploying:
```bash
heroku domains --app dowurk-app
```

---

## What Happens to Current Site?

### Option A: Instant Replacement (Recommended)
- New app goes live immediately
- Old site is replaced
- No staging needed
- **Best for:** Clean launch

### Option B: Subdomain Testing First
- Deploy to: beta.dowurktoday.com or app.dowurktoday.com
- Test everything
- Then switch www to new app
- **Best for:** Extra caution

### Option C: Both Domains
- New app: www.dowurktoday.com (.com for new platform)
- Old site: www.dowurktoday.org (.org stays as old site)
- **Best for:** Keeping old site accessible

---

## My Recommendation:

### 🎯 **BEST APPROACH:**

**Today:**
1. Deploy to Heroku with temporary URLs
2. Test everything thoroughly (2-4 hours)
3. Share Heroku URL with beta testers if desired

**This Week:**
1. Point www.dowurktoday.com to new Heroku app
2. Set up api.dowurktoday.com subdomain
3. Old site automatically replaced
4. SSL automatically configured (free on Heroku)

**Result:**
- ✅ www.dowurktoday.com = New DowUrk AI platform
- ✅ api.dowurktoday.com = Backend API
- ✅ Professional, clean, simple
- ✅ No confusion

---

## About Your Current Site:

### What to do with old dowurktoday.com?

**Option 1: Replace it completely** (Recommended)
- New platform is much better
- Clean brand transition
- No confusion for users

**Option 2: Archive it**
- Save as old.dowurktoday.com or legacy.dowurktoday.com
- For reference only
- Redirect users to new platform

**Option 3: Delete it**
- Old site hosted at ueni.com can be removed
- New site is superior
- Clean slate

---

## The .org Domain:

### What to do with www.dowurktoday.org?

**Recommended: Redirect to .com**
```
www.dowurktoday.org → www.dowurktoday.com (301 redirect)
```

**Why?**
- Users who type .org still reach you
- No confusion
- SEO benefit (link equity)
- Professional

**How to set up redirect:**
- Most domain registrars have "Domain Forwarding" feature
- Set .org to forward to .com
- Enable "Include path" so URLs work correctly

---

## Email Considerations:

### If you have email at dowurktoday.com:

**Don't worry!** DNS changes won't affect email if:
- Email uses separate MX records
- You're not changing MX records
- Only changing A/CNAME records for website

**Best Practice:**
- Check current MX records before DNS changes
- Don't modify MX records
- Email continues working

---

## Timeline:

### Recommended Schedule:

**Day 1 (Today):**
- ✅ Deploy to Heroku
- ✅ Test on Heroku URLs
- ✅ Fix any issues
- ✅ Share with team/beta testers

**Day 2-3:**
- ✅ Final testing
- ✅ Update DNS records
- ✅ Connect custom domain
- ✅ Wait for propagation

**Day 4-7:**
- ✅ Monitor for issues
- ✅ Verify all features work
- ✅ Optimize based on usage
- ✅ Announce launch!

---

## Final Recommendation:

### 🎯 **USE THIS SETUP:**

```
Primary Domain: www.dowurktoday.com
API Subdomain: api.dowurktoday.com
Redirect: dowurktoday.org → dowurktoday.com

Email: Keep at current provider (unchanged)
Old Site: Replace with new platform
```

**This gives you:**
- ✅ Professional .com domain
- ✅ Clean, simple URLs
- ✅ No confusion
- ✅ Easy to remember
- ✅ Best for business
- ✅ Best for SEO

---

**Let's use www.dowurktoday.com for your new platform! 🚀**
