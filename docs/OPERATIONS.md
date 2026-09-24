# Running the site

What to watch, who is told when something breaks, and what to do. This is the proportionate
version of Service Standard point 14 ("operate a reliable service") for a site run by
volunteers. Review it at each June handover, with `public/.well-known/security.txt`.

## Who is responsible

- **First contact:** the IT Infrastructure officer.
- **Deputy:** one other committee member with Vercel access, named at handover. Nothing in
  this document should depend on one person.

## What is monitored

| Check                      | How                                                                                                           | Who is told             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- |
| The site is up             | A free external uptime check every 5 minutes on `/th`, `/en/services/equipment-loan` and `/api/search?q=test` | IT officer, deputy      |
| Server errors              | Vercel project, Observability, alert on a spike in 5xx responses                                              | IT officer, deputy      |
| Failed deploys             | Vercel emails the commit author and the team on a failed or blocked deployment                                | IT officer              |
| Dependency vulnerabilities | Dependabot pull requests (`.github/dependabot.yml`)                                                           | Anyone with repo access |
| Performance budget         | Lighthouse CI on every pull request (`lighthouserc.js`)                                                       | The pull request author |

Set up the uptime check and the 5xx alert once, in accounts owned by the association rather
than a personal account, and record where they live here.

## When something breaks

1. **The whole site is down.** Check Vercel status, then the latest deployment. If the latest
   deployment caused it, promote the previous one (Vercel, Deployments, Promote to production).
2. **One service is broken** (for example, loan requests fail). Close it from Edge Config so
   people see "Sorry, the service is unavailable" instead of a broken form (see "Closing a
   service" in `README.md`), then fix it.
3. **Something affects students' safety.** Use emergency mode (`README.md`, "Emergency mode").
4. **Someone reports a security problem** through `security.txt`. Acknowledge it as soon as you
   can, do not discuss it publicly until fixed, and tell the President if personal data may
   have been exposed. Personal data breaches follow `docs/pdpa/breach-response.md`.

## After it is fixed

Write three lines in the pull request that fixes it: what happened, how long students were
affected, and what stops it happening again.
