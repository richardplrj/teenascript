# Bibliotheca — Digital E-Library

A full-stack digital library application with a built-in plagiarism detection engine. Browse and read scholarly articles, submit new articles, and check any text for similarity against the library's collection — all without any external NLP libraries.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (via Prisma ORM) |
| Fonts | Playfair Display · DM Sans (Google Fonts) |
| Plagiarism Engine | Custom TF-IDF + Cosine Similarity (no external NLP libs) |

---

## Running Locally

### Prerequisites
- Node.js 18+ and npm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env — set ADMIN_PASSWORD to something secure

# 3. Push the database schema
npx prisma db push

# 4. Seed the database with 6 sample articles
npx prisma db seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages

| Route | Description |
|---|---|
| `/` | Browse and search the article library |
| `/article/[id]` | Read a single article |
| `/upload` | Submit a new article (paste or .txt upload) |
| `/check` | Plagiarism checker with visual similarity report |
| `/admin` | Admin login |
| `/admin/dashboard` | Manage articles and view plagiarism check history |

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

All sentences from the input text *and* all library articles are vectorised together in one corpus so IDF values are globally consistent.

### 3. Cosine Similarity
Two TF-IDF vectors are compared using cosine similarity:

```
similarity = (A · B) / (|A| × |B|)
```

The dot product of the two sparse vectors divided by the product of their magnitudes gives a value in **[0, 1]** — 0 means no shared vocabulary, 1 means identical.

### 4. Sentence-Level Matching
Both the input text and each library article are split into sentences. Every input sentence is compared against every sentence in every article. The highest sentence-pair similarity becomes the article-level score. Only matches above **20%** are reported. The overall score is the maximum across all articles.

---

## Screenshots

> *(Add screenshots here once the application is running)*

- **Library browse page** — hero search, category filter pills, article card grid
- **Article reader** — narrow editorial layout, comfortable reading typography
- **Plagiarism checker** — animated SVG score ring, colour-coded results, expandable matched passage pairs
- **Admin dashboard** — stats cards, article management table, plagiarism report history

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path — e.g. `file:./dev.db` |
| `ADMIN_PASSWORD` | Password for the `/admin` panel |

See `.env.example` for a template.
