# anCuisine 🍳

**Votre carnet de cuisine personnel** - Une application web moderne pour gérer vos recettes avec style.

## ✨ Fonctionnalités

- 📝 **Créer et gérer vos recettes** : Titre, catégorie, ingrédients, étapes, notes personnelles
- 🖼️ **Recherche d'images Pinterest** : Trouvez des photos haute résolution pour illustrer vos recettes
- 👨‍🍳 **Mode cuisine pas-à-pas** : Suivez vos recettes étape par étape avec minuteurs intégrés
- 🔍 **Recherche et filtres** : Par nom, catégorie, ou méthode de cuisson
- ⏱️ **Minuteurs intelligents** : Ajoutez des minuteurs à chaque étape de préparation/cuisson
- 📱 **Design iOS moderne** : Interface élégante inspirée d'iOS avec thème sombre/clair
- 🔒 **Sécurisé** : Authentification via Supabase, vos recettes sont privées

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Un compte Supabase (gratuit)

### Étapes

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd anCuisine
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Copiez le fichier `.env.example` vers `.env.local` :
```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos credentials :
```env
# Supabase (obligatoire)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key

# Pinterest (optionnel - voir PINTEREST_SETUP.md)
PINTEREST_APP_ID=votre_app_id
PINTEREST_APP_SECRET=votre_app_secret
PINTEREST_ACCESS_TOKEN=votre_access_token
```

4. **Configurer Supabase**

Créez les tables nécessaires en exécutant le script SQL suivant dans l'éditeur SQL de Supabase :

```sql
-- Voir le fichier supabase/schema.sql pour le schéma complet
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🎨 Technologies utilisées

- **Frontend** : Next.js 15, React, TypeScript
- **Styling** : Tailwind CSS avec design system iOS
- **Backend** : Supabase (PostgreSQL + Auth)
- **API** : Pinterest API v5 pour la recherche d'images
- **Déploiement** : Vercel (recommandé)

## 📖 Documentation

- [Configuration Pinterest](./PINTEREST_SETUP.md) - Guide pour configurer l'API Pinterest
- [Politique de confidentialité](/privacy) - `/privacy`
- [Conditions d'utilisation](/terms) - `/terms`

## 🎯 Structure du projet

```
anCuisine/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Page d'accueil (liste des recettes)
│   ├── login/               # Page de connexion/inscription
│   ├── recettes/            # Pages des recettes
│   │   ├── [id]/           # Détail d'une recette
│   │   │   ├── page.tsx    # Vue détaillée
│   │   │   └── edit/       # Édition
│   │   └── nouvelle/       # Création
│   ├── privacy/            # Politique de confidentialité
│   ├── terms/              # Conditions d'utilisation
│   └── api/                # Routes API
│       └── pinterest/      # API Pinterest
├── components/              # Composants React
│   ├── layout/             # Layout (Header, Footer, Container)
│   ├── recipe/             # Composants recettes
│   └── ui/                 # Composants UI réutilisables
├── hooks/                  # React Hooks personnalisés
├── lib/                    # Utilitaires
├── types/                  # Types TypeScript
└── public/                 # Fichiers statiques
```

## 🔧 Configuration avancée

### Pinterest API (Optionnel)

Pour activer la recherche d'images Pinterest :

1. Suivez le guide [PINTEREST_SETUP.md](./PINTEREST_SETUP.md)
2. Ajoutez vos credentials dans `.env.local`
3. Redémarrez l'application

Sans configuration Pinterest, vous pouvez toujours :
- Coller manuellement des URLs d'images
- Utiliser des liens directs vers des images

### Déploiement

**Vercel** (recommandé) :
```bash
npm install -g vercel
vercel
```

N'oubliez pas d'ajouter vos variables d'environnement dans les paramètres du projet Vercel.

## 📱 Utilisation

1. **Créer un compte** : Première visite → S'inscrire avec email/mot de passe
2. **Ajouter une recette** : Cliquez sur "+" dans le header
3. **Rechercher une image** : Utilisez le bouton "Rechercher sur Pinterest"
4. **Cuisiner** : Cliquez sur "Commencer à cuisiner" pour le mode pas-à-pas
5. **Filtrer** : Utilisez la barre de recherche et les filtres de catégorie

## 🤝 Contribution

Ce projet est personnel, mais les suggestions sont les bienvenues via les issues.

## 📄 Licence

Tous droits réservés © 2026 anCuisine

## 🔐 Sécurité & Confidentialité

- ✅ Authentification sécurisée (Supabase Auth)
- ✅ Données chiffrées en transit (HTTPS)
- ✅ Row Level Security (RLS) sur la base de données
- ✅ Aucune donnée vendue à des tiers
- ✅ Conforme RGPD

Voir [Politique de confidentialité](/privacy) pour plus de détails.

## 🐛 Problèmes connus

- La recherche Pinterest nécessite une authentification API
- Les minuteurs ne fonctionnent que pendant que l'onglet est actif

## 📮 Support

Pour toute question, consultez :
- La [documentation Pinterest](./PINTEREST_SETUP.md)
- Les [pages légales](/privacy)
- Les paramètres de l'application

---

Fait avec ❤️ et Next.js
