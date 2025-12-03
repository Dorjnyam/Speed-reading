# Vercel Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Push to GitHub/GitLab/Bitbucket
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

### 3. Set Environment Variables

After deployment, go to **Project Settings → Environment Variables** and add:

```
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

Or if you have a custom domain:
```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 4. Update URLs in Code (After First Deploy)

After your first deployment, Vercel will give you a URL like:
- `https://speed-reader-abc123.vercel.app`

**Update these files:**

#### 1. `app/[locale]/page.tsx`
The `baseUrl` variable will automatically use `NEXT_PUBLIC_BASE_URL` from environment variables, so you just need to set it in Vercel.

#### 2. `app/sitemap.ts`
Same - uses `NEXT_PUBLIC_BASE_URL` environment variable.

#### 3. `components/StructuredData.tsx`
Same - uses `NEXT_PUBLIC_BASE_URL` environment variable.

#### 4. `public/robots.txt`
Update manually if needed:
```
Sitemap: https://your-project.vercel.app/sitemap.xml
```

#### 5. `app/robots.ts`
Uses environment variable automatically.

### 5. Redeploy

After setting environment variables:
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment
- Or push a new commit

## 🔄 Updating URLs After Deployment

### Method 1: Environment Variables (Recommended)
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update: `NEXT_PUBLIC_BASE_URL` = `https://your-actual-url.com`
3. Redeploy

### Method 2: Update Code Directly
If you need to hardcode (not recommended), update:
- `app/[locale]/page.tsx` - Line with `baseUrl`
- `app/sitemap.ts` - Line with `baseUrl`
- `components/StructuredData.tsx` - Line with `baseUrl`
- `public/robots.txt` - Sitemap URL

## 📝 Custom Domain Setup

1. Go to **Project Settings → Domains**
2. Add your custom domain
3. Update `NEXT_PUBLIC_BASE_URL` environment variable
4. Redeploy

## ✅ Post-Deployment Checklist

- [ ] Set `NEXT_PUBLIC_BASE_URL` environment variable
- [ ] Test the site loads correctly
- [ ] Test file upload works
- [ ] Test language switching
- [ ] Verify sitemap: `https://your-url.com/sitemap.xml`
- [ ] Verify robots.txt: `https://your-url.com/robots.txt`
- [ ] Test Open Graph tags: https://www.opengraph.xyz/
- [ ] Submit to Google Search Console
- [ ] Test on mobile devices

## 🔍 Verify URLs Are Correct

After deployment, check:
1. **Metadata**: View page source, check `<meta>` tags
2. **Sitemap**: Visit `https://your-url.com/sitemap.xml`
3. **Open Graph**: Use https://www.opengraph.xyz/
4. **Structured Data**: Use https://search.google.com/test/rich-results

## 🐛 Troubleshooting

### URLs showing `https://speedreader.app` instead of your URL?
- Check environment variables in Vercel
- Make sure `NEXT_PUBLIC_BASE_URL` is set
- Redeploy after setting environment variables

### Sitemap not working?
- Check `app/sitemap.ts` exists
- Verify `NEXT_PUBLIC_BASE_URL` is set
- Check Vercel build logs for errors

### Open Graph images not showing?
- Make sure `og-image.png` exists in `/public`
- Check the URL in metadata matches your domain
- Verify image is accessible: `https://your-url.com/og-image.png`

