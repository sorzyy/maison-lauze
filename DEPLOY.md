# Déploiement GitHub Pages

## Étapes rapides

### 1. Crée un repo sur GitHub
- Va sur https://github.com/new
- Nom: `maison-lauze`
- Visibilité: Public (ou Private si tu as GitHub Pro)
- **Ne coche pas** "Initialize with README"
- Clique "Create repository"

### 2. Copie l'URL du repo
Par exemple: `https://github.com/TON_USERNAME/maison-lauze.git`

### 3. Dans le terminal (dans le dossier app/)
```bash
cd /Users/sorzy/Downloads/app

# Ajoute le remote
git remote add origin https://github.com/TON_USERNAME/maison-lauze.git

# Renomme la branche
git branch -m main

# Push
git push -u origin main
```

### 4. Active GitHub Pages
- Va sur ton repo GitHub
- Settings → Pages
- Source: "GitHub Actions"

### 5. Attends le déploiement
- Va sur l'onglet "Actions" de ton repo
- Attends que le workflow soit vert ✅
- Ton site sera sur: `https://TON_USERNAME.github.io/maison-lauze/`

---

## Commandes complètes (à copier-coller)

Remplace `TON_USERNAME` par ton vrai username GitHub:

```bash
cd /Users/sorzy/Downloads/app
git remote add origin https://github.com/TON_USERNAME/maison-lauze.git
git branch -m main
git push -u origin main
```

Puis va sur GitHub pour activer Pages dans Settings → Pages → GitHub Actions.
