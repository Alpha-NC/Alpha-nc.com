# PROJET RÉFÉRENCE — Alpha No_Code Website V5 "Signal"
> Fichier contexte · Guide de référence · Feuille de route  
> Dernière mise à jour : avril 2026  
> Auteur du site : Guillaume Dos Santos — Alpha No_Code

---

## 1. INFORMATIONS LÉGALES & CONTACT

| Champ | Valeur |
|---|---|
| Raison sociale | Alpha No_Code |
| Responsable | Guillaume Dos Santos |
| Forme juridique | Auto-entrepreneur — Profession Libérale Non Réglementée |
| Code NAF | 6202A — Conseil en systèmes et logiciels informatiques |
| SIRET | 852 038 934 00034 |
| SIREN | 852 038 934 |
| Adresse | 6 PL DU LABOURD, 64500 Saint-Jean-de-Luz |
| TVA | Non assujetti (franchise en base — art. 293B CGI) |
| Email | contact@alpha-nc.fr |
| Domaine | https://alpha-nc.fr |
| Hébergeur | IONOS SE — Montabaur, Allemagne |
| Calendly (CTA) | https://calendly.com/agence-alphanc/audit-decouverte |
| Gmail pro | agence.alphanc@gmail.com |

---

## 2. STRUCTURE DES FICHIERS

```
Alpha No_Code website v3/
├── index.html              ← Page principale (landing page)
├── calculateur-roi.html    ← Outil ROI interactif
├── mentions-legales.html   ← Page légale
├── confidentialite.html    ← Politique de confidentialité
├── rgpd.html               ← RGPD & données
├── style.css               ← Design system complet V5
└── script.js               ← JS : Vanta, typewriter, stepper, cursor, FAQ
```

**Pages supprimées (V5)** : agences.html, avocats.html, immobilier.html, verticals.css  
→ Les verticales sectorielles existent en tant que sections sur index.html uniquement.

---

## 3. STACK TECHNIQUE

- **Langage** : HTML5 / CSS3 / JavaScript vanilla (aucun framework)
- **Fonts** : Montserrat (titres 600–900) · Inter (corps) · IBM Plex Mono (labels, chiffres)
- **Icônes** : Font Awesome 6.5.1 (CDN)
- **Animation hero** : Vanta.NET (Three.js) — réseau de points animé
- **Prise de RDV** : Calendly (lien externe)
- **Analytics** : Aucun outil activé (à configurer — voir section 9)
- **Pas de** : CMS, framework CSS, base de données, back-end

---

## 4. DESIGN SYSTEM — V5 "Signal / Noise"

### Philosophie visuelle
> "Bloomberg Terminal meets Swiss editorial design."  
> Dark-first · Couleur chirurgicale · Typographie architecturale · Luxe éditorial

### Palette officielle

| Token | Valeur | Usage |
|---|---|---|
| `--brand-deep` | `#11707C` | Teal profond — accents sombres |
| `--brand-teal` | `#0BA08F` | Teal principal — boutons, liens |
| `--product-accent` | `#00E5A8` | Vert menthe — highlight, curseur, chiffres |
| `--product-bg` | `#0B1020` | Fond sombre principal (hero, sections dark) |
| `--product-card` | `#101A33` | Cartes dark |
| `--brand-coral` | `#FF8F5C` | Corail — accent chaud |
| `--product-danger` | `#FF5A7A` | Rouge-rose — icônes "problème" |
| `--bg-main` | `#F7FBFB` | Fond clair principal |
| `--bg-white` | `#FFFFFF` | Blanc pur — cartes claires |
| `--text-main` | `#17313A` | Texte principal sombre |
| `--text-soft` | `#5E7079` | Texte secondaire |
| `--text-on-dark` | `#EAF0FF` | Texte sur fonds sombres |

### Typographie

| Rôle | Font | Taille | Poids |
|---|---|---|---|
| H1 hero | Montserrat | clamp(40px, 5.8vw, 84px) | 900 |
| H2 sections | Montserrat | clamp(40px, 5.5vw, 84px) | 800 |
| H3 cartes | Montserrat | 17–22px | 800 |
| Corps | Inter | 15.5px | 400–600 |
| Labels / chiffres | IBM Plex Mono | 9–12px | 700 |
| Eyebrows | IBM Plex Mono | 9.5px | 700 — uppercase — 0.20em spacing |

### Rayons & espacements

```css
--r-sm: 8px   --r-md: 14px   --r-lg: 22px   --r-xl: 30px   --r-pill: 999px
Sections : padding 120px 0
Container : max-width 1680px
```

### Effets visuels signature
- **Bordure conic-gradient animée** (`grad-spin`) sur cartes claires (friction-cards, offer-cards)
- **Curseur personnalisé** : dot teal + ring — toggle `.cursor-light` sur fonds clairs
- **Scroll progress bar** : ligne teal en haut de page
- **Reveal on scroll** : `opacity 0 → 1` + `translateY(28px → 0)` via IntersectionObserver
- **Vanta.NET** : réseau de points animé dans le hero (désactivé mobile < 768px)
- **Typewriter** : animation cyclique dans la hero subline
- **Ghost numbers** : numéros de section décoratifs en arrière-plan (220px, transparents)
- **Section diagonal cut** : `clip-path polygon` sur certaines sections

### Boutons

| Classe | Apparence | Usage |
|---|---|---|
| `.btn-primary` | Gradient teal → vert | CTA principal |
| `.btn-secondary` | Transparent + border blanc | Dark sections |
| `.btn-secondary-light` | Transparent + border clair | CTA secondaire sur dark |
| `.offer-card .btn-secondary` | Même gradient que primary | Cartes offres claires |

---

## 5. STRUCTURE DU SITE — index.html

### Header (fixe)
- Logo + nom de marque
- Navigation : Freins · Méthode · Équipe · Offres · FAQ · Simulateur ROI
- CTA header : "Demander un audit stratégique" → Calendly
- Menu burger mobile (slide-in depuis la droite)

### Hero (100svh)
- **Eyebrow** : "Pour agences créatives, cabinets d'avocats et acteurs de l'immobilier"
- **H1** : "Vous avez la production. / On pose le cadre qui la libère."
- **Lead** : Le prospect a construit son activité seul — Alpha pose le cadre qui manque
- **Subline typewriter** : "Plus de clarté sur vos [briefs / approbations / versions / reporting / relances]..."
- **Tags** : Process fiabilisés · Automatisation utile · Temps libéré · Sérénité retrouvée
- **Panel droit** (2 cartes) :
  - Card principale : "Ce que vous gagnez" — Visibilité, cadre, sérénité
  - Signal card : "Ce qu'on traite" — 4 symptômes courants
- **Fond** : Vanta.NET (réseau de points) ou fallback gradient dark

### Stat Bar (dark, sous le hero)
- 3 statistiques : `15–25 %` / `30 j` / `5`
- Labels : "du temps de production récupéré" · "pour les premiers effets concrets" · "étapes de la méthode Alpha"

### Ticker (marquee)
- Défile en boucle : mots-clés métier en IBM Plex Mono

### Section 01 — Le diagnostic (#frictions)
- **H2** : "Pas un manque d'outils. Un cadre qui n'a pas encore suivi."
- **Intro** : Cadrage sans condescendance — ces ralentissements sont normaux, conséquences d'une croissance plus rapide que le système
- **6 cartes** (icônes emoji danger, fond blanc, bordure conic-gradient) :
  1. Demandes incomplètes
  2. Retours éparpillés
  3. Corrections à répétition
  4. Suivi d'activité manuel
  5. Relances chronophages
  6. Informations éparpillées

### Section 02 — Avant/Après (#avant-apres)
- **H2** : "Le même potentiel. Un cadre qui lui permet enfin de s'exprimer."
- Layout 2 colonnes : "Quand le cadre manque encore" (fond bordeaux sombre) vs "Avec Alpha No_Code" (fond dark + teal)
- Bande de bénéfices horizontale en bas

### Section 03 — Verticales (#verticales)
- **H2** : "Chaque métier a ses blocages. On les connaît."
- 3 cartes sectorielles : Agences créatives · Cabinets d'avocats · Immobilier

### Section 04 — Méthode (#methode)
- **H2** : "Du désordre à un système clair. Votre manière de travailler reste la vôtre."
- **Stepper desktop** (5 étapes, activation au hover) :
  1. On cartographie
  2. On priorise
  3. On structure
  4. On installe et on forme
  5. On mesure et on ajuste
- **Accordion mobile** : même contenu en accordéon
- Footer méthode : CTA Calendly

### Section Do/Don't (#rgpd)
- Intro : "Pour que ce qu'on installe reste utile, documenté et maintenable par vous, sans nous."
- Grille de règles : ce qu'Alpha fait / ne fait pas

### Section Équipe (#equipe)
- Photo Unsplash centrée sur les visages
- Cartes équipe

### Section Offres (#offres)
- **H2** : "Un point d'entrée simple. Un niveau d'intervention adapté."
- 3 offres : Audit · Structure · Partenariat
- CTA de chaque offre → Calendly

### Section ROI (#roi)
- **H2** : section sombre
- 3 cartes ROI : Temps récupéré (`15–25 %`) · Premiers effets (`30 j`) · Méthode (`5 étapes`)
- Lien calculateur ROI → calculateur-roi.html

### FAQ (#faq)
- 2 colonnes, accordéon
- 7 questions couvrant : durée, taille de structure, investissement, autonomie, secteurs, outils, garanties

### CTA Final
- **H2** : "On commence par voir clair sur ce qui vous ralentit."
- 2 CTAs : Demander un audit (Calendly) · Voir le détail de l'audit (Calendly)

### Footer
- 3 colonnes : Brand + tagline + CTA / Navigation / Contact + Légal
- Email : contact@alpha-nc.fr
- Liens légaux : Mentions légales · Politique de confidentialité · RGPD & données

---

## 6. PHILOSOPHIE ÉDITORIALE — RÈGLES ABSOLUES

### Positionnement
> Le prospect fait tourner son business depuis des années, sans Alpha No_Code.  
> Notre rôle : **amplifier**, pas sauver.  
> Les ralentissements = conséquences normales d'une croissance rapide, pas d'incompétence.

### Ton
- **Confiant, direct, sans condescendance**
- Pas d'urgence artificielle ("dernière chance", "vous perdez de l'argent")
- Pas de jargon technique inutile
- Phrases courtes, structure journalistique
- "Vous" et non "votre équipe" (le prospect peut être solopreneur)

### Vocabulaire INTERDIT dans le copy visible
| Terme interdit | Remplacements autorisés |
|---|---|
| frictions | blocages · ralentissements · points de blocage |
| validations | retours · confirmations · approbations |
| votre équipe | vous · votre organisation |
| tirets cadratins (—) | virgule · deux-points · parenthèses |

### Chiffres harmonisés
- Temps récupéré : **15–25 %** partout (stat bar, ROI card, body text)
- Premiers résultats : **30 jours**
- Méthode : **5 étapes**

### Typewriter (hero subline)
Mots : `briefs.` · `approbations.` · `versions.` · `reporting.` · `relances.`  
(Pas de "validations." — terme interdit)

---

## 7. PAGES LÉGALES

| Fichier | Contenu | Canonical |
|---|---|---|
| mentions-legales.html | Éditeur, hébergeur, propriété intellectuelle | alpha-nc.fr/mentions-legales |
| confidentialite.html | Données collectées, droits, cookies | alpha-nc.fr/confidentialite |
| rgpd.html | Registre des traitements, sous-traitants | alpha-nc.fr/rgpd |

**À tenir à jour** : SIRET, adresse, hébergeur, outils analytics si ajoutés.

---

## 8. CALCULATEUR ROI

- Fichier : `calculateur-roi.html`
- Outil interactif standalone (CSS inline, pas de style.css)
- 3 situations : Pilotage · Production · Commercial
- Calcul : temps perdu × TJM → gain potentiel annuel
- CTA → Calendly

---

## 9. AMÉLIORATIONS FUTURES

### Priorité haute

#### 9.1 Analytics — Plausible.io (recommandé)
- **Pourquoi** : Aucun cookie → pas de bannière de consentement → expérience utilisateur préservée
- **Coût** : 9 €/mois
- **Alternative gratuite** : Google Analytics 4 (mais oblige une bannière RGPD)
- **Alternative IONOS** : Vérifier les stats intégrées dans le panneau d'administration IONOS
- **Action** : Ajouter `<script defer data-domain="alpha-nc.fr" src="https://plausible.io/js/script.js"></script>` dans le `<head>` de chaque page
- **Mettre à jour** : rgpd.html et confidentialite.html pour indiquer l'outil choisi

#### 9.2 Bannière cookies (si GA4 choisi)
- Ajouter un composant de consentement conforme CNIL
- Options : Axeptio (SaaS FR, ~45€/an) · Tarteaucitron (open source) · Cookiebot

#### 9.3 Email professionnel
- Configurer `contact@alpha-nc.fr` chez IONOS (boîte incluse dans la plupart des offres)
- Ou redirection → agence.alphanc@gmail.com + SMTP pour répondre depuis contact@alpha-nc.fr

#### 9.4 Favicon
- Aucun favicon défini actuellement
- Créer : 32×32px et 192×192px au format PNG à partir du logo
- Ajouter dans `<head>` de toutes les pages :
  ```html
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ```

#### 9.5 Open Graph image (og:image)
- Aucune image de partage social définie
- Créer une image 1200×630px (logo + tagline sur fond dark teal)
- Ajouter dans toutes les pages :
  ```html
  <meta property="og:image" content="https://alpha-nc.fr/og-image.jpg" />
  <meta property="twitter:card" content="summary_large_image" />
  ```

---

### Priorité moyenne

#### 9.6 Sitemap XML
- Créer `sitemap.xml` à la racine pour le SEO
- Inclure : index, calculateur-roi, mentions-legales, confidentialite, rgpd

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://alpha-nc.fr/</loc><priority>1.0</priority></url>
  <url><loc>https://alpha-nc.fr/calculateur-roi</loc><priority>0.8</priority></url>
  <url><loc>https://alpha-nc.fr/mentions-legales</loc><priority>0.2</priority></url>
  <url><loc>https://alpha-nc.fr/confidentialite</loc><priority>0.2</priority></url>
  <url><loc>https://alpha-nc.fr/rgpd</loc><priority>0.2</priority></url>
</urlset>
```

#### 9.7 robots.txt
```
User-agent: *
Allow: /
Disallow: /mentions-legales
Disallow: /confidentialite
Disallow: /rgpd
Sitemap: https://alpha-nc.fr/sitemap.xml
```

#### 9.8 Schema.org (données structurées)
- Ajouter dans le `<head>` de index.html :
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Alpha No_Code",
  "description": "Structuration et automatisation des process pour TPE et PME de services",
  "url": "https://alpha-nc.fr",
  "email": "contact@alpha-nc.fr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6 PL DU LABOURD",
    "addressLocality": "Saint-Jean-de-Luz",
    "postalCode": "64500",
    "addressCountry": "FR"
  }
}
```

#### 9.9 Performance
- Images Unsplash : remplacer par des images locales optimisées (WebP, dimensions exactes)
- Logo : URL externe actuelle → stocker en local (`/assets/logo.png`)
- Lazy loading déjà en place sur les images ✅
- Vanta.js : déjà désactivé mobile ✅

#### 9.10 Page d'erreur 404 personnalisée
- Créer `404.html` dans le style du site
- Message : "Cette page n'existe pas — mais on peut quand même vous aider."
- CTA → retour accueil + Calendly

---

### Priorité basse / Long terme

#### 9.11 Études de cas / Portfolio
- Nouvelle section ou page dédiée
- Format : problème → solution → résultat chiffré
- Sans nommer les clients si nécessaire (anonymisation sectorielle)

#### 9.12 Blog / Ressources
- Articles SEO ciblés (ex. "Comment structurer son process de brief agence")
- Guide PDF téléchargeable en échange d'un email (lead magnet)

#### 9.13 Témoignages clients
- Section à ajouter entre les offres et la FAQ
- Format : citation + nom + poste + secteur
- 3 à 5 témoignages maximum

#### 9.14 Version anglaise
- Potentiel pour élargir la cible (secteur immobilier de luxe, agences internationales)

#### 9.15 Calculateur ROI — améliorations
- Ajouter un 4e profil (ex. Cabinet juridique)
- Export PDF du résultat
- Partage du résultat par email

---

## 10. POINTS DE VIGILANCE — Règles à ne pas casser

1. **Jamais "votre équipe"** dans le copy → toujours "vous"
2. **Jamais "frictions" ni "validations"** dans le texte visible
3. **Pas de tirets cadratins (—)** dans le copy — remplacer par virgule, deux-points ou parenthèses
4. **Chiffres cohérents** : 15–25 % partout pour le temps récupéré
5. **Tous les CTA** pointent vers Calendly : `https://calendly.com/agence-alphanc/audit-decouverte`
6. **Seule exception** : le lien "Simulateur ROI" → `calculateur-roi.html`
7. **Email** : toujours `contact@alpha-nc.fr` (jamais .com)
8. **Logo** : ne jamais remplacer l'URL sans vérifier le rendu header ET footer

---

## 11. HISTORIQUE DES VERSIONS

| Version | Description |
|---|---|
| V1–V2 | Premières versions du site (non documentées) |
| V3 | Version de base — structure, offres, FAQ |
| V4 | Ajout des pages verticales sectorielles |
| V5 "Signal" | Redesign complet : dark-first, design system éditorial, suppression verticales, copy refondu |
| V5.1 (actuel) | Corrections UX, copy revu, pages légales, migration domaine alpha-nc.fr |
