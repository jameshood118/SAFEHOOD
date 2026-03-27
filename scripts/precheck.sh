#!/usr/bin/env bash
# Abort on error, unset vars, or pipeline failures
set -euo pipefail

# Repo root
cd "$(git rev-parse --show-toplevel)"

# Optional: allow skipping with tag
LAST_COMMIT_MSG="$(git log -1 --pretty=%B || true)"
if echo "$LAST_COMMIT_MSG" | grep -qi '\[skip-precheck\]'; then
  printf "⚠️  Skipping pre-push checks due to [skip-precheck] tag.\n"
  exit 0
fi

printf "🔍 Running Pre-Push Quality Gate...\n"

# -------- Empty file check --------
printf "📂 Checking for empty files...\n"

UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [ -n "$UPSTREAM" ]; then
  BASE="$(git merge-base HEAD "$UPSTREAM")"
  FILES_TO_CHECK="$(git diff --name-only --diff-filter=AM "$BASE"..HEAD)"
else
  printf "⚠️  No upstream configured — scanning entire repo...\n"
  FILES_TO_CHECK="$(git ls-files)"
fi

ALLOW_EMPTY_REGEX='(^|/)\.gitkeep$|(^|/)\.keep$'
EMPTY_FILES=""

if [ -n "$FILES_TO_CHECK" ]; then
  while IFS= read -r file; do
    [ -z "${file:-}" ] && continue
    if printf "%s" "$file" | grep -Eq "$ALLOW_EMPTY_REGEX"; then
      continue
    fi
    if [ -f "$file" ] && [ ! -s "$file" ]; then
      EMPTY_FILES+="$file"$'\n'
    fi
  done <<< "$FILES_TO_CHECK"
fi

if [ -n "$EMPTY_FILES" ]; then
  printf "🛑 Empty files detected:\n%s\nPlease remove or fill them.\n" "$EMPTY_FILES"
  exit 1
fi

printf "✅ No empty files found.\n"

# -------- Prettier (check → auto-fix & stop) --------
printf "🎨 Prettier — check\n"
if ! npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --check .; then
  printf "💾 Prettier — writing fixes...\n"
  npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --write .
  git add -A
  git commit -m "style: auto-format with Prettier [skip-precheck]"
  printf "🛑 Prettier fixed files and committed. Push again.\n"
  exit 1
fi
printf "✅ Prettier passed.\n"

# -------- ESLint (cached: src) --------
printf "🧪 ESLint (cached, src)...\n"
npx --no-install eslint src --ext .js,.jsx,.ts,.tsx --cache

# -------- ESLint (strict) --------
printf "✨ ESLint (strict)...\n"
npx --no-install eslint . --max-warnings=0
printf "✅ ESLint passed.\n"

# -------- TypeScript --------
printf "🛠️ TypeScript — type check\n"
npx --no-install tsc --noEmit --pretty false
printf "✅ TypeScript passed.\n"

printf "🚀 All checks passed. Ready to push!\n"