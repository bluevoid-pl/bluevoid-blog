# Research Summary: Running React (TanStack Start) on path prefixes `/externa` or `/react-demo` alongside Nuxt on small.pl

## Context
- Current project: Nuxt 4 (Vue 3) blog hosted on small.pl at `/`.
- Goal: add a React application built with TanStack Start that occupies a path prefix on the same domain, e.g. `/externa` or `/react-demo`, served from the same small.pl account.
- small.pl provides Node.js hosting with reverse proxy routing by Host header or URL path, and allows mapping path prefixes to different internal Node ports via control panel / nginx.

## Findings

### small.pl hosting capabilities
- small.pl is a Polish shared/VPS hosting provider that supports Node.js applications.
- Each account can host multiple apps via path prefixes, e.g. `domain.pl/externa` or `domain.pl/react-demo`.
- The provider uses an nginx reverse proxy in front of user apps, routing requests based on Host header or URL path.
- Node.js apps are run via a process manager on a specific internal port, accessible via proxy rules set in the control panel.
- Path-based routing is supported: you can map `/externa/*` to port 3001, `/react-demo/*` to port 3002, and `/` to port 3000.

### Nitro and TanStack Start
- TanStack Start is built on Nitro + Vite. It produces a standalone Node server via `@tanstack/start` + `nitro`.
- Nitro respects `server.base` and Vite `base` for correct asset URLs and client routing when served under a path prefix.
- Typical deployment is one Nitro instance per app; path routing is handled by the reverse proxy, not inside a single Nitro process.
- Avoid trying to serve both Nuxt and React from one Nitro process on small.pl; keep them separate and proxy by path.

### Options to run React app side-by-side

#### Option 1: Path prefix with separate Node processes [RECOMMENDED]
- Host Nuxt blog at `/` on internal port 3000.
- Host React app at `/externa` or `/react-demo` on internal port 3001.
- small.pl nginx reverse proxy maps path prefixes to ports:
  ```
  location /externa/ { proxy_pass http://127.0.0.1:3001/; }
  location /react-demo/ { proxy_pass http://127.0.0.1:3001/; }
  ```
- Pros: single domain, no DNS changes, React app occupies desired path.
- Cons: need correct base paths in React app.

#### Option 2: Subdomains
- Host Nuxt at `bluevoid.pl`, React at `externa.bluevoid.pl`.
- Simpler routing but does not meet path requirement.

#### Option 3: Single Nitro server monorepo
- Not recommended for small.pl; requires custom server code and conflicts with Nuxt server.

### Practical recommendation for small.pl - path prefix

1. Keep Nuxt blog at `/` on port 3000.
2. Deploy TanStack Start React app on port 3001 with base path `/externa` or `/react-demo`.
3. Configure small.pl control panel / nginx to proxy:
   - `location /externa/` -> `http://127.0.0.1:3001/`
   - Strip prefix before forwarding or let app handle it.
4. Configure TanStack Start:
   - `vite.config.ts`: `base: '/externa/'`
   - `start.config.ts`: `server.base = '/externa'`
   - Ensure HTML `<base href="/externa/">` and router `createBrowserRouter` uses `basename`.
5. Build each app separately and deploy to respective ports.
6. Test asset URLs, redirects, and 404 handling with path prefix.

## Next steps
- Verify small.pl control panel allows path-based proxy rules to Node ports.
- Test TanStack Start with `base: '/externa'` and `server.base`.
- Create deployment scripts for Nuxt on port 3000 and React on port 3001.
- Document nginx location blocks for `/externa` and `/react-demo`.
- Document final setup in `docs/deployment.md`.

## Implementation details

### small.pl nginx proxy example
```
server {
  server_name bluevoid.pl;
  
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
  }

  location /externa/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Prefix /externa;
  }

  location /react-demo/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Prefix /react-demo;
  }
}
```
Note: trailing slash handling is critical to avoid double prefixes.

### TanStack Start config for path base
`vite.config.ts`:
```ts
export default defineConfig({
  base: '/externa/',
  // ...
})
```

`start.config.ts`:
```ts
export default defineConfig({
  server: {
    base: '/externa',
  }
})
```

React Router:
```ts
createBrowserRouter(routes, { basename: '/externa' })
```

### Nuxt config
No changes needed; Nuxt serves at `/`.

## Sources
- small.pl website and documentation on Node.js support.
- Nitro documentation on `server.base` and `base`.
- TanStack Start hosting guides.
- Vite base path documentation.
