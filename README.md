# TeenaScript — Digital Library

A full-stack digital library application with a built-in plagiarism detection engine. Browse and read scholarly articles, submit new articles, and check any text for similarity against the library's collection — built entirely without external NLP libraries.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (via Prisma ORM) |
| Fonts | Playfair Display · DM Sans (Google Fonts) |
| Charts | Recharts |
| Theme | next-themes (dark / light mode) |
| Plagiarism Engine | Custom TF-IDF + Cosine Similarity (no external NLP libs) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Browse and search the article library |
| `/article/[id]` | Read a single article with related articles |
| `/category/[slug]` | Browse articles by category |
| `/upload` | Submit a new article (paste text or upload .txt file) |
| `/check` | Plagiarism checker with animated score ring and matched passages |
| `/admin` | Admin login |
| `/admin/dashboard` | Manage articles, view stats and plagiarism check history |

---

## Admin Access

| Field | Value |
|---|---|
| URL | `/admin` |
| Password | `admin123` |

> To change the password, update the `ADMIN_PASSWORD` value in your environment variables.

---

## Running Locally

### Prerequisites
- Node.js 18+ and npm
- A PostgreSQL database (or use [Neon](https://neon.tech) for a free one)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create a .env file in the root with the following:
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-postgresql-direct-connection-string"
ADMIN_PASSWORD="admin123"

# 3. Push the database schema
npx prisma db push

# 4. Seed the database with sample articles
npx prisma db seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel + Neon (Recommended)

### 1. Set up Neon (free PostgreSQL)
- Go to [neon.tech](https://neon.tech) and create a free account
- Create a new project
- Go to **Connection Details → Prisma** to get your connection strings

### 2. Deploy to Vercel
- Push the code to GitHub
- Go to [vercel.com](https://vercel.com) and import your GitHub repository
- Add these environment variables in Vercel:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string (contains `-pooler`) |
| `DIRECT_URL` | Neon direct connection string (no `-pooler`) |
| `ADMIN_PASSWORD` | `admin123` |

- Click **Deploy** — done!

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL pooled connection string |
| `DIRECT_URL` | PostgreSQL direct connection string (used for migrations) |
| `ADMIN_PASSWORD` | Password for the `/admin` panel |

---

## How the Plagiarism Engine Works

The checker lives entirely in `lib/plagiarism.ts` and uses no external NLP libraries — only pure mathematics.

### 1. Tokenisation
Input text is lowercased, stripped of punctuation, split on whitespace, and filtered against a set of 80+ English stop words (*the*, *is*, *a*, etc.). The result is a clean array of meaningful tokens.

### 2. TF-IDF Vectorisation
For a set of text documents (sentences, in practice):

- **TF** *(Term Frequency)* = occurrences of word in document ÷ total words in document
- **IDF** *(Inverse Document Frequency)* = log(total documents ÷ documents containing the word)
- **TF-IDF** = TF × IDF — words common everywhere score low; words distinctive to a document score high.

All sentences from the input text and all library articles are vectorised together in one corpus so IDF values are globally consistent.

### 3. Cosine Similarity
Two TF-IDF vectors are compared using cosine similarity:

```
similarity = (A · B) / (|A| × |B|)
```

The dot product of the two sparse vectors divided by the product of their magnitudes gives a value in **[0, 1]** — 0 means no shared vocabulary, 1 means identical.

### 4. Sentence-Level Matching
Both the input text and each library article are split into sentences. Every input sentence is compared against every sentence in every article. The highest sentence-pair similarity becomes the article-level score. Only matches above **20%** are reported. The overall score is the maximum across all articles.

---

## Features

- **Dark / Light Mode** — system preference detected automatically, toggle in the nav bar
- **Category Pages** — browse by Science, Technology, Literature, History, Philosophy, Other
- **Related Articles** — shown at the bottom of every article from the same category
- **Word Count & Read Time** — displayed on every article card and reader page
- **Animated Page Transitions** — smooth fade + slide on every navigation
- **Drop Caps** — first letter styling on article body text
- **Admin Dashboard** — delete articles, view plagiarism check reports, see category distribution chart
- **Toast Notifications** — success and error feedback on all actions

---

*© 2026 TeenaScript. All rights reserved.*
