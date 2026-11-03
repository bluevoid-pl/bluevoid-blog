# Deployment Guide: Nuxt blog + TanStack Start React app on small.pl with path prefixes

## Overview
- Domain: `bluevoid.pl`
- Nuxt blog: `/` -> internal port 3000
- React app: `/externa` and/or `/react-demo` -> internal port 3001

Both apps run as separate Node processes behind small.pl nginx reverse proxy.

## Prerequisites
- small.pl account with Node.js hosting enabled
- Access to control panel / nginx config
- Two Node apps: `bluevoid-blog` (Nuxt 4) and `externa-react` (TanStack Start)

## small.pl nginx configuration

Add the following to your site's nginx config in small.pl control panel:

```nginx
server {
  server_name bluevoid.pl www.bluevoid.pl;

  # Nuxt blog at root
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # React app under /externa/
  location /externa/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Prefix /externa;
  }

  # Optional alias for /react-demo/
  location /react-demo/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Prefix /react-demo;
  }
}
```

> Note: trailing slash on `proxy_pass http://127.0.0.1:3001/` strips the prefix before forwarding to the app.

## Nuxt blog deployment

Port: 3000

1. Build
```bash
cd bluevoid-blog
npm install
npm run build
```

2. Start
```bash
npm run preview
# or
node .output/server/index.mjs
```

3. small.pl process manager
- Command: `npm run preview`
- Port: 3000
- Working directory: `/home/user/bluevoid-blog`

## TanStack Start React deployment

Port: 3001

### Vite config
`vite.config.ts`
```ts
import { defineConfig } from 'vite'
export default defineConfig({
  base: '/externa/',
  // ...
})
```

### start.config.ts
```ts
import { defineConfig } from '@tanstack/start/config'
export default defineConfig({
  server: {
    base: '/externa',
  }
})
```

### React Router
```ts
import { createBrowserRouter } from 'react-router-dom'
const router = createBrowserRouter(routes, { basename: '/externa' })
```

1. Build
```bash
cd externa-react
npm install
npm run build
```

2. Start
```bash
npm run start
# Nitro will serve on port 3001
```

3. small.pl process manager
- Command: `npm run start`
- Port: 3001
- Working directory: `/home/user/externa-react`
- Environment variable: `BASE_URL=/externa`

## Verification checklist

- [ ] `https://bluevoid.pl/` loads Nuxt blog
- [ ] `https://bluevoid.pl/externa/` loads React app
- [ ] Assets load from `/externa/assets/...`
- [ ] React Router navigation stays under `/externa`
- [ ] Refresh on deep route works, no 404
- [ ] Cookies set for `/` do not leak to `/externa` unless intended

## Rollback / troubleshooting

- If assets 404: check `base` in Vite and `server.base` in TanStack Start
- If double prefix: ensure `proxy_pass` ends with `/` and app serves from root
- If 502: verify Node process is listening on correct port and firewall allows localhost
- Logs: small.pl control panel -> Logs -> Node apps

## Next steps
- Add CI/CD to auto-deploy on push to main
- Document environment variables for production
- Consider separate `/react-demo` build with different base if needed
