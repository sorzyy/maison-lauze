#!/bin/bash

echo "🚀 Déploiement GitHub Pages pour Maison Lauze"
echo ""

# Demande le username GitHub
read -p "Entre ton username GitHub: " USERNAME

if [ -z "$USERNAME" ]; then
    echo "❌ Username requis"
    exit 1
fi

REPO_URL="https://github.com/$USERNAME/maison-lauze.git"

echo ""
echo "📦 Configuration du repo..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
git branch -m main

echo ""
echo "⬆️ Push vers GitHub..."
git push -u origin main

echo ""
echo "✅ Code poussé !"
echo ""
echo "⚠️ IMPORTANT: Va sur https://github.com/$USERNAME/maison-lauze/settings/pages"
echo "   et sélectionne 'GitHub Actions' comme source."
echo ""
echo "🌐 Ton site sera bientôt sur: https://$USERNAME.github.io/maison-lauze/"
