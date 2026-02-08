# Sitemap Documentation

## Overview
This document describes the sitemap implementation for bidaya.dev.

## Files
- `public/sitemap.xml` - Main sitemap file containing all public URLs
- `public/robots.txt` - Search engine directives with sitemap reference

## Sitemap Structure

### URLs Included
The sitemap includes:
1. **Main Pages**
   - Home page: `https://bidaya.dev/` (Priority: 1.0, Weekly updates)
   - Team page: `https://bidaya.dev/team.html` (Priority: 0.8, Monthly updates)
   - Simple view: `https://bidaya.dev/simple.html` (Priority: 0.6, Monthly updates)

2. **Section Anchors** (for better SEO)
   - `https://bidaya.dev/#home` (Priority: 0.9, Weekly)
   - `https://bidaya.dev/#about` (Priority: 0.9, Monthly)
   - `https://bidaya.dev/#events` (Priority: 0.8, Weekly)
   - `https://bidaya.dev/#community` (Priority: 0.8, Weekly)
   - `https://bidaya.dev/#contact` (Priority: 0.7, Monthly)

### URLs Excluded
- `/admin.html` - Admin panel (blocked in robots.txt)
- `/api/*` - API endpoints (blocked in robots.txt)

## Maintenance

### Updating lastmod Date
When content changes, update the `<lastmod>` tag in sitemap.xml:
```xml
<lastmod>YYYY-MM-DD</lastmod>
```

### Adding New Pages
To add a new page to the sitemap:
1. Open `public/sitemap.xml`
2. Add a new `<url>` block before `</urlset>`:
```xml
<url>
    <loc>https://bidaya.dev/new-page.html</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
</url>
```

### Priority Guidelines
- `1.0` - Home page only
- `0.8-0.9` - Important pages (team, main sections)
- `0.6-0.7` - Secondary pages
- `0.3-0.5` - Archive/less important pages

### Change Frequency Guidelines
- `daily` - News, blogs (not applicable currently)
- `weekly` - Events, community sections
- `monthly` - Team, about, contact sections
- `yearly` - Static content, legal pages

## Validation
To validate the sitemap:
```bash
# Using Python
cd public
python3 << 'EOF'
import xml.etree.ElementTree as ET
tree = ET.parse('sitemap.xml')
print("✅ Valid XML")
EOF
```

## Submission to Search Engines

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property for bidaya.dev
3. Submit sitemap: https://bidaya.dev/sitemap.xml

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site for bidaya.dev
3. Submit sitemap: https://bidaya.dev/sitemap.xml

### Manual Ping (Optional)
```bash
# Google
curl "https://www.google.com/ping?sitemap=https://bidaya.dev/sitemap.xml"

# Bing
curl "https://www.bing.com/ping?sitemap=https://bidaya.dev/sitemap.xml"
```

## SEO Enhancements
All HTML pages include:
- Meta descriptions
- Canonical URLs
- Keywords (where applicable)
- Proper page titles

## Deployment
The sitemap and robots.txt are automatically deployed to Vercel when changes are pushed to the repository. They are served as static files from the `public/` directory.

## Testing
After deployment, verify:
- Sitemap: https://bidaya.dev/sitemap.xml
- Robots: https://bidaya.dev/robots.txt

## Standards Compliance
The sitemap follows the XML sitemap protocol 0.9 as defined by sitemaps.org:
- https://www.sitemaps.org/protocol.html
