# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x | ✅ Yes |

---

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Please report security issues privately by emailing the repository maintainer or using GitHub's private vulnerability reporting feature.

Include:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You will receive a response within 72 hours.

---

## Security Principles

MONO is built with a zero-trust mindset:

- **No secrets in code** — all configurable values live in environment variables
- **No hardcoded credentials** — ever
- **Input validation** — all user input is sanitized before storage
- **Local-first** — Phase 1 stores data only on-device (IndexedDB), no server transmission
- **XSS prevention** — React's default escaping + no `dangerouslySetInnerHTML` in user content
- **Content Security Policy** — configured in `next.config.ts` headers

---

## Phase 3 Security (When Backend is Added)

When the NestJS backend lands:
- JWT with short expiry + refresh token rotation
- Argon2 password hashing (never bcrypt, never MD5)
- Rate limiting on all auth endpoints
- CSRF protection
- SQL injection prevention via Prisma parameterized queries
- Audit logs for authentication events
- Device session management

---

## Dependency Policy

- Dependencies are audited on every CI run
- No dependency with a known critical vulnerability will be merged
- Run `npm audit` before submitting a PR
