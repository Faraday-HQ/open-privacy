# Security policy

## Reporting a vulnerability

If you find a security problem in this site or its tools (for example, a way to make a tool send data off the device, a script injection, or a weakness in the security headers), report it privately with **Report a vulnerability** on this repository's Security tab. Please don't open a public issue for security problems.

Only the maintainers see private reports. We're happy to credit you in the changelog if you'd like.

## Design commitments

- The site is static. There is no server-side code, database or user account.
- Tools run entirely in the browser and make no network requests. The content security policy sets `connect-src 'none'`.
- No third-party scripts, styles or fonts are loaded.
- Dependencies are build-time only (Eleventy, markdown plugins, and Satori and resvg for social cards). Keep them updated with `npm outdated` and review changes before upgrading.
