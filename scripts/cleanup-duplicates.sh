#!/bin/bash
# Cleanup duplicate files and folders

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧹 Cleaning up duplicates...${NC}"
echo ""

# Counter
REMOVED=0

# Remove duplicate manifest
if [ -f "public/manifest copy.json" ]; then
  rm "public/manifest copy.json"
  echo -e "${GREEN}✅ Removed: public/manifest copy.json${NC}"
  ((REMOVED++))
else
  echo -e "${YELLOW}⚠️  public/manifest copy.json not found${NC}"
fi

# Remove duplicate component folders
echo -e "\n${BLUE}Removing duplicate component folders...${NC}"
FOUND=0
while IFS= read -r -d '' dir; do
  echo -e "${GREEN}✅ Removing: $dir${NC}"
  rm -rf "$dir"
  ((REMOVED++))
  ((FOUND++))
done < <(find src/components -type d -name "*copy*" -print0 2>/dev/null)

if [ $FOUND -eq 0 ]; then
  echo -e "${YELLOW}⚠️  No duplicate component folders found${NC}"
fi

# Remove duplicate store file
if [ -f "src/store/store copy.js" ]; then
  rm "src/store/store copy.js"
  echo -e "${GREEN}✅ Removed: src/store/store copy.js${NC}"
  ((REMOVED++))
else
  echo -e "${YELLOW}⚠️  src/store/store copy.js not found${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
if [ $REMOVED -gt 0 ]; then
  echo -e "${GREEN}🎉 Cleanup complete!${NC}"
  echo -e "${GREEN}Removed $REMOVED item(s)${NC}"
else
  echo -e "${YELLOW}ℹ️  No duplicates found to remove${NC}"
fi
echo -e "${BLUE}========================================${NC}"

