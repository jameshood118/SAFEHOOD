#!/usr/bin/env bash
# Abort on error, unset vars, or pipeline failures
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo ""
echo "================================================================================"
echo " 🛰️  SAFEHOOD ORBITAL UPLINK: EPISTEMIC VERIFICATION SEQUENCE"
echo "================================================================================"

# Optional: Override switch for emergency patches
LAST_COMMIT_MSG="$(git log -1 --pretty=%B || true)"
if echo "$LAST_COMMIT_MSG" | grep -qi '\[skip-precheck\]'; then
  printf " ⚠️  [ OVERRIDE DETECTED ] Skipping verification due to [skip-precheck] tag.\n"
  exit 0
fi

# -------- 📂 GHOST NODE CHECK (Upstream Sync) --------
printf " 📂 [ PHASE 1 ] Scanning upstream delta for Ghost Nodes...\n"

UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [ -n "$UPSTREAM" ]; then
  BASE="$(git merge-base HEAD "$UPSTREAM")"
  FILES_TO_CHECK="$(git diff --name-only --diff-filter=AM "$BASE"..HEAD)"
else
  printf " ⚠️  [ ORBITAL WARNING ] No upstream configured. Scanning entire local matrix...\n"
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
  printf "\n 🔴 [ AIRLOCK BREACH ] Upstream payload contains empty files:\n%s\n" "$EMPTY_FILES"
  printf " 🛑 [ ABORT ] Purge ghost nodes before orbital sync.\n\n"
  exit 1
fi
printf " 🟢 [ NOMINAL ] Payload density verified.\n\n"


# -------- 🎨 PRETTIER (The Trellis Alignment) --------
printf " 🎨 [ PHASE 2 ] Verifying Trellis Alignment (Prettier)...\n"
if ! npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --check .; then
  printf " 🔧 [ AUTO-CORRECT ] Misalignment detected. Re-weaving the Trellis...\n"
  npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --write .
  git add -A
  git commit -m "style: Auto-aligned structural Trellis [skip-precheck]"
  printf "\n 🛑 [ SEQUENCE HALTED ] Trellis was auto-corrected and committed. Please re-initiate push sequence.\n\n"
  exit 1
fi
printf " 🟢 [ NOMINAL ] Trellis alignment is perfect.\n\n"


# -------- 🧪 ESLINT (Efficiency Trap Radar) --------
printf " 🔬 [ PHASE 3 ] Sweeping for Efficiency Traps (ESLint)...\n"
printf "    > Running rapid cached sweep on /src...\n"
npx --no-install eslint src --ext .js,.jsx,.ts,.tsx --cache

printf "    > Engaging strict zero-tolerance perimeter scan...\n"
npx --no-install eslint . --max-warnings=0
printf " 🟢 [ NOMINAL ] No traps detected. Sector is clear.\n\n"


# -------- 🛠️ TYPESCRIPT (Ground Truth Verification) --------
printf " ⚖️  [ PHASE 4 ] Verifying Epistemic Ground Truth (TypeScript)...\n"
npx --no-install tsc --noEmit --pretty false
printf " 🟢 [ NOMINAL ] Epistemic validation passed. 42.\n\n"


# -------- ✅ FINAL CLEARANCE --------
echo "================================================================================"
echo " 🚀 [ UPLINK APPROVED ] Jinba Ittai alignment confirmed. Safe to push payload."
echo "================================================================================"
echo ""
