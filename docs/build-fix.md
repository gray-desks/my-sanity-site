# Sanity Studio Build Fix Documentation

## 🐛 Issue Description

**Error**: `Could not resolve entry module ".sanity/runtime/app.js"`  
**Command**: `npx sanity build --clean`  
**Status**: ✅ **RESOLVED**

## 🔍 Root Cause Analysis

### Initial Symptoms
- Development server (`npx sanity dev`) worked perfectly
- Production build failed consistently with missing app.js error
- `.sanity/runtime/` directory was not being generated during build

### Contributing Factors
1. **Schema file location conflict**: `site/schema.json` was generated in wrong location during `npx sanity schema extract`
2. **Missing .sanity runtime**: Build process couldn't find runtime files
3. **Clean state required**: Previous build attempts left inconsistent state

## ✅ Solution Steps

### 1. Clean Conflicting Files
```bash
rm -f site/schema.json      # Remove schema.json from wrong location
rm -rf .sanity              # Clean runtime directory
```

### 2. Regenerate Runtime Files
```bash
npx sanity dev --port 9999  # Force regeneration of .sanity/runtime/
# Wait for "ready" message, then stop server
pkill -f "sanity dev"
```

### 3. Verify Runtime Generation
```bash
ls -la .sanity/runtime/
# Should show: app.js, index.html
```

### 4. Production Build
```bash
npx sanity build --clean    # Now succeeds
npx sanity deploy           # Deploy to travel-blog-jp.sanity.studio
```

## 🎯 Key Insights

### What Worked
- **Version consistency**: Sanity v4.1.1 across all dependencies ✅
- **Runtime regeneration**: Dev server creates necessary files ✅
- **Clean state**: Removing conflicting files was crucial ✅

### What Didn't Work Initially
- Building without runtime files ❌
- Schema extraction to wrong directory ❌
- Incremental build attempts ❌

## 🚀 Final Result

- **Studio URL**: https://travel-blog-jp.sanity.studio/ ✅
- **Build Status**: Production ready ✅
- **Development**: Both dev and build commands working ✅

## 🔧 Prevention

To avoid this issue in future:

1. **Never manually delete `.sanity` during active development**
2. **Run `npx sanity dev` first before attempting builds**
3. **Keep schema files in project root, not subdirectories**
4. **Use `--clean` flag when build issues occur**

---

**Fixed**: 2025-01-27 by Claude Code  
**Studio Version**: Sanity v4.1.1  
**Deploy**: travel-blog-jp.sanity.studio