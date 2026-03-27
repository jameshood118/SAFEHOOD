#!/usr/bin/env bash
# Abort on error, unset vars, or pipeline failures
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# -------- 🎨 ANSI COLOR CODES --------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}================================================================================${NC}"
echo -e "${CYAN} 🛰️  SAFEHOOD ORBITAL UPLINK: EPISTEMIC VERIFICATION SEQUENCE${NC}"
echo -e "${CYAN}================================================================================${NC}"

# Optional: Override switch for emergency patches
LAST_COMMIT_MSG="$(git log -1 --pretty=%B || true)"
if echo "$LAST_COMMIT_MSG" | grep -qi '\[skip-precheck\]'; then
  printf "${YELLOW} ⚠️  [ OVERRIDE DETECTED ] Skipping verification due to [skip-precheck] tag.${NC}\n"
  exit 0
fi

# -------- 📂 GHOST NODE CHECK (Upstream Sync) --------
printf "${PURPLE} 📂 [ PHASE 1 ] Scanning upstream delta for Ghost Nodes...${NC}\n"

UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [ -n "$UPSTREAM" ]; then
  BASE="$(git merge-base HEAD "$UPSTREAM")"
  FILES_TO_CHECK="$(git diff --name-only --diff-filter=AM "$BASE"..HEAD)"
else
  printf "${YELLOW} ⚠️  [ ORBITAL WARNING ] No upstream configured. Scanning entire local matrix...${NC}\n"
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
  printf "\n${RED} 🔴 [ AIRLOCK BREACH ] Upstream payload contains empty files:\n%s${NC}\n" "$EMPTY_FILES"
  printf "${RED} 🛑 [ ABORT ] Purge ghost nodes before orbital sync.${NC}\n\n"
  exit 1
fi
printf "${GREEN} 🟢 [ NOMINAL ] Payload density verified.${NC}\n\n"


# -------- 🎨 PRETTIER (The Trellis Alignment) --------
printf "${PURPLE} 🎨 [ PHASE 2 ] Verifying Trellis Alignment (Prettier)...${NC}\n"
if ! npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --check .; then
  printf "${YELLOW} 🔧 [ AUTO-CORRECT ] Misalignment detected. Re-weaving the Trellis...${NC}\n"
  npx --no-install prettier --config .prettierrc.yml --ignore-path .prettierignore --write .
  git add -A
  git commit -m "style: Auto-aligned structural Trellis [skip-precheck]"
  printf "\n${RED} 🛑 [ SEQUENCE HALTED ] Trellis was auto-corrected and committed. Please re-initiate push sequence.${NC}\n\n"
  exit 1
fi
printf "${GREEN} 🟢 [ NOMINAL ] Trellis alignment is perfect.${NC}\n\n"


# -------- 🧪 ESLINT (Efficiency Trap Radar) --------
printf "${PURPLE} 🔬 [ PHASE 3 ] Sweeping for Efficiency Traps (ESLint)...${NC}\n"
printf "    > Running rapid cached sweep on /src...\n"
npx --no-install eslint src --ext .js,.jsx,.ts,.tsx --cache

printf "    > Engaging strict zero-tolerance perimeter scan...\n"
npx --no-install eslint . --max-warnings=0
printf "${GREEN} 🟢 [ NOMINAL ] No traps detected. Sector is clear.${NC}\n\n"


# -------- 🛠️ TYPESCRIPT (Ground Truth Verification) --------
printf "${PURPLE} ⚖️  [ PHASE 4 ] Verifying Epistemic Ground Truth (TypeScript)...${NC}\n"
npx --no-install tsc --noEmit --pretty false
printf "${GREEN} 🟢 [ NOMINAL ] Epistemic validation passed. 42.${NC}\n\n"


# -------- ✅ FINAL CLEARANCE --------
echo -e "${CYAN}================================================================================${NC}"
echo -e "${GREEN} 🐁 🐾 🐾 🐾 🐈 🚀 [ UPLINK APPROVED ] Jinba Ittai alignment confirmed. Safe to push payload.${NC}"
echo -e "${CYAN}================================================================================${NC}"
echo ""
