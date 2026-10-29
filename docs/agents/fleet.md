# Agent fleet

The agent-remote fleet (dispatcher, planners, workers, reviewers) works in this
repo. It reads the lines below from the default branch; change them with a PR.

- short: fest
- aliases: festival-plan-2027, festival plan, festival-plan, festival site, festivals
- test: `npm run build`
- setup: `npm ci`
- graft: `graft build --no-gitignore --no-ignore`
- preview: `npm run dev -- --port {port} --strictPort` /
