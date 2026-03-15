# SkillSwap — Plateforme Freelance

Projet de mi-session — Techniques de l'informatique  
Cours : Tendances Technologiques  
Professeur : Renan Cavalcanti Machado  
Session : Hiver 2026

## Équipe

- Souleymane Sow
- Ruth Fraichelene Happi Kegmo

---

## Description

SkillSwap est une application frontend Angular connectée à une API REST déployée sur DigitalOcean. Elle permet aux utilisateurs de publier des offres d'emploi, soumettre des propositions, accepter des collaborations et laisser des avis mutuels.

## Fonctionnalités

- Inscription et connexion avec authentification JWT
- Mode Client : publier et gérer des offres d'emploi
- Mode Freelancer : explorer les offres et soumettre des propositions
- Acceptation de propositions et gestion du cycle de vie des jobs (open → in_progress → completed)
- Système d'avis et de notation automatique
- Statistiques publiques de la plateforme

## Technologies utilisées

- Angular 19
- TypeScript
- SCSS
- API REST SkillSwap (DigitalOcean)

## Installation et démarrage
```bash
git clone <url-du-repo>
cd skillswap
npm install
ng serve
```

L'application sera disponible sur `http://localhost:4200`

## API

URL de base : `https://stingray-app-wxhhn.ondigitalocean.app`

## Structure du projet
```
src/
├── app/
│   ├── components/
│   │   ├── home/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── navbar/
│   │   ├── jobs/
│   │   ├── job-detail/
│   │   ├── job-form/
│   │   ├── my-postings/
│   │   ├── my-bids/
│   │   └── profile/
│   └── services/
│       ├── auth.ts
│       ├── job.ts
│       ├── proposal.ts
│       ├── user.ts
│       ├── auth.guard.ts
│       └── auth.interceptor.ts
```