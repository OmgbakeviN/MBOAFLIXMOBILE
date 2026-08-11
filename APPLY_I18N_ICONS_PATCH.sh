#!/usr/bin/env bash

set -e

echo
echo "=== MBOA FLIX: bilingual + SVG icons patch ==="
echo

echo "1/4 Installing/ensuring required packages..."
pnpm --filter @workspace/mobile add \
  lucide-react-native \
  i18next \
  react-i18next

pnpm --filter @workspace/mobile exec expo install expo-localization

echo
echo "2/4 Replacing Feather icon-font imports with Lucide SVG compatibility..."
node scripts/migrate_feather_to_lucide.mjs

echo
echo "3/4 Applying safe common translation patches..."
node scripts/patch_common_translations.mjs

echo
echo "4/4 Typechecking..."
pnpm --filter @workspace/mobile run typecheck

echo
echo "DONE."
echo
echo "Now restart Expo/Replit:"
echo "pnpm --filter @workspace/mobile run dev"
echo
echo "Test Profile -> Application Language -> Français / English."
echo
