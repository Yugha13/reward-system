# Windows Setup Guide — Reward Dashboard

## Prerequisites

1. **Node.js v20+** — Download from [https://nodejs.org](https://nodejs.org)
2. **pnpm** — Install globally after Node.js:
   ```powershell
   npm install -g pnpm
   ```
3. **Git** — Download from [https://git-scm.com](https://git-scm.com)

---

## Step-by-Step Setup

### 1. Clone the Repository
```powershell
git clone <your-repo-url>
cd Reward-Dashboard
```

### 2. Fix the Preinstall Script (Required for Windows)

The project has a shell-based preinstall script that **won't work on Windows**. 

Open `package.json` and find this line (~line 6):
```json
"preinstall": "sh -c 'rm -f package-lock.json yarn.lock; case \"$npm_config_user_agent\" in pnpm/*) ;; *) echo \"Use pnpm instead\" >&2; exit 1 ;; esac'"
```

**Replace it with:**
```json
"preinstall": "node -e \"if(!process.env.npm_config_user_agent.startsWith('pnpm')){console.error('Use pnpm instead');process.exit(1)}\""
```

### 3. Remove Platform-Specific Overrides (If Not Already Done)

In both `package.json` and `pnpm-workspace.yaml`, the `overrides` section excludes platform binaries (esbuild, rollup, lightningcss, tailwindcss-oxide). 

If you see entries like `"esbuild>@esbuild/darwin-arm64": "-"`, **delete all of them** except:
```json
"@esbuild-kit/esm-loader": "npm:tsx@^4.21.0",
"esbuild": "0.27.3"
```

> These overrides were designed for Replit's linux-x64 environment and will prevent Windows binaries from installing.

### 4. Install Dependencies
```powershell
pnpm install
```

### 5. Run the Dashboard
```powershell
pnpm --filter @workspace/reward-dashboard dev
```

### 6. Open in Browser
```
http://localhost:5173/
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `"Use pnpm instead"` error | You ran `npm install` or `yarn`. Use `pnpm install` instead. |
| `Port 5173 is already in use` | Kill the existing process: `netstat -ano \| findstr :5173` then `taskkill /PID <PID> /F` |
| `sh: command not found` | You didn't do Step 2. Fix the preinstall script. |
| Native binary errors (esbuild/rollup) | You didn't do Step 3. Remove the platform overrides. |
