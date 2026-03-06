#!/bin/bash

echo "🚀 Déploiement automatique sur GitHub"
echo ""

# Vérifier si gh est authentifié
if ! gh auth status &>/dev/null; then
    echo "🔐 Tu dois te connecter à GitHub"
    echo ""
    echo "Je vais ouvrir ton navigateur pour l'authentification..."
    echo "(Appuie sur Entrée pour continuer)"
    read
    
    gh auth login --web
    
    echo ""
    echo "✅ Une fois connecté dans le navigateur, appuie sur Entrée ici"
    read
fi

echo "✅ Connecté à GitHub"
echo ""

# Demander le nom du repo
read -p "Nom du repo (défaut: maison-lauze): " REPO_NAME
REPO_NAME=${REPO_NAME:-maison-lauze}

read -p "Public ou Private? (public/private, défaut: public): " VISIBILITY
VISIBILITY=${VISIBILITY:-public}

echo ""
echo "📦 Création du repo '$REPO_NAME'..."

# Créer le repo
gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --push --description "Maison Lauze - Cave à vin depuis 1886" 

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Repo créé et code poussé !"
    echo ""
    
    # Activer GitHub Pages via API
    echo "⚙️ Configuration de GitHub Pages..."
    gh api repos/:owner/:repo/pages \
      --method POST \
      --input - <<< '{"source":{"branch":"main","path":"/"}}' 2>/dev/null || true
    
    USERNAME=$(gh api user -q .login)
    echo "🌐 Ton site sera disponible sur:"
    echo "   https://$USERNAME.github.io/$REPO_NAME/"
    echo ""
    echo "⏳ Le déploiement prend 2-3 minutes"
    echo "   Vérifie l'onglet Actions sur GitHub pour suivre la progression"
else
    echo ""
    echo "❌ Erreur lors de la création du repo"
    echo "   Peut-être que le repo existe déjà ?"
fi
