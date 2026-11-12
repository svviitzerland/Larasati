// The whole site is static, so the page is prerendered at build time.
// On Cloudflare Pages the result is served straight from the edge network
// without running a worker for each request.
export const prerender = true;
export const ssr = true;
