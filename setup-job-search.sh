for tool in linkedin-search freehire-search builtin-search greenhouse-search ashby-search lever-search workday-search remotive-search muse-search levels-fyi-search levels-fyi-compensation; do
  (cd .agents/skills/$tool/cli && bun install)
done
