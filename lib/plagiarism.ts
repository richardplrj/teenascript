/**
 * Plagiarism Detection Engine
 * Pure implementation of TF-IDF and cosine similarity — no external NLP libraries.
 */

// ---------------------------------------------------------------------------
// Stop words
// ---------------------------------------------------------------------------
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'shall', 'can', 'not', 'no', 'nor', 'so', 'yet', 'both',
  'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most',
  'other', 'some', 'such', 'than', 'too', 'very', 'just', 'as', 'this', 'that',
  'these', 'those', 'it', 'its', 'its', 'he', 'she', 'they', 'we', 'you', 'i',
  'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their',
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'up', 'down', 'out', 'off', 'over', 'under', 'again', 'then', 'once', 'also',
])

// ---------------------------------------------------------------------------
// 1. tokenize
// ---------------------------------------------------------------------------

/**
 * Converts raw text into a clean array of meaningful tokens.
 * - Lowercases everything
 * - Strips punctuation and special characters
 * - Splits on whitespace
 * - Removes stop words and single-character tokens
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // replace non-alphanumeric with space
    .split(/\s+/)                    // split on any whitespace
    .filter(w => w.length > 1 && !STOP_WORDS.has(w))
}

// ---------------------------------------------------------------------------
// 2. computeTFIDF
// ---------------------------------------------------------------------------

/**
 * Computes TF-IDF vectors for an array of document strings.
 *
 * TF  = (count of word in doc) / (total words in doc)
 * IDF = log((total docs) / (number of docs containing the word))
 * TF-IDF = TF × IDF
 *
 * Returns an array of Maps — one per document — mapping word → tfidf score.
 */
export function computeTFIDF(documents: string[]): Map<string, number>[] {
  const N = documents.length
  if (N === 0) return []

  // Tokenise every document once and keep the token lists
  const tokenLists: string[][] = documents.map(tokenize)

  // --- document frequency: how many documents contain each word? ---
  const docFreq = new Map<string, number>()
  for (const tokens of tokenLists) {
    const seen = new Set(tokens)
    Array.from(seen).forEach(word => {
      docFreq.set(word, (docFreq.get(word) ?? 0) + 1)
    })
  }

  // --- build a TF-IDF map for each document ---
  return tokenLists.map(tokens => {
    const total = tokens.length
    if (total === 0) return new Map<string, number>()

    // raw term frequencies
    const tf = new Map<string, number>()
    for (const word of tokens) {
      tf.set(word, (tf.get(word) ?? 0) + 1)
    }

    // convert to TF-IDF
    const tfidf = new Map<string, number>()
    Array.from(tf.entries()).forEach(([word, count]) => {
      const termFreq = count / total
      const inverseDocFreq = Math.log(N / (docFreq.get(word) ?? 1))
      tfidf.set(word, termFreq * inverseDocFreq)
    })

    return tfidf
  })
}

// ---------------------------------------------------------------------------
// 3. cosineSimilarity
// ---------------------------------------------------------------------------

/**
 * Computes the cosine similarity between two sparse TF-IDF vectors.
 * Returns a value in [0, 1]:  0 = completely different, 1 = identical.
 */
export function cosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>,
): number {
  let dot = 0
  let magA = 0
  let magB = 0

  // dot product and magnitude of A — only iterate over A's keys
  Array.from(vecA.entries()).forEach(([word, scoreA]) => {
    const scoreB = vecB.get(word) ?? 0
    dot += scoreA * scoreB
    magA += scoreA * scoreA
  })

  // magnitude of B (words that may not be in A)
  Array.from(vecB.values()).forEach(scoreB => {
    magB += scoreB * scoreB
  })

  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

// ---------------------------------------------------------------------------
// 4. checkPlagiarism — types and main function
// ---------------------------------------------------------------------------

export interface MatchedPair {
  inputSentence: string
  librarySentence: string
  score: number
}

export interface ArticleMatch {
  articleId: number
  articleTitle: string
  similarityScore: number   // 0–100
  matchedPairs: MatchedPair[]
}

export interface PlagiarismResult {
  overallScore: number      // 0–100, the highest single similarity found
  matches: ArticleMatch[]   // only articles with similarityScore > 20, sorted desc
}

/**
 * Splits text on sentence-ending punctuation (. ? !) and filters out empty strings.
 */
function splitSentences(text: string): string[] {
  return text
    .split(/[.?!]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

/**
 * Main plagiarism check.
 *
 * Strategy:
 *  1. Split the input text into sentences.
 *  2. For each library article, split its content into sentences too.
 *  3. Compute TF-IDF vectors for all sentences in a combined corpus
 *     (input sentences + article sentences) so the IDF is consistent.
 *  4. Compare every input sentence against every article sentence via cosine similarity.
 *  5. For each article, the article-level score is the MAX sentence-pair similarity.
 *  6. The overall score is the MAX across all articles.
 *  7. Only include articles where similarityScore > 20; sort descending.
 */
export function checkPlagiarism(
  inputText: string,
  libraryArticles: { id: number; title: string; content: string }[],
): PlagiarismResult {
  const inputSentences = splitSentences(inputText)

  if (inputSentences.length === 0 || libraryArticles.length === 0) {
    return { overallScore: 0, matches: [] }
  }

  // Build sentence groups per article
  const articleSentenceGroups: string[][] = libraryArticles.map(a =>
    splitSentences(a.content),
  )

  // Flatten everything into one corpus for a shared IDF
  const allSentences: string[] = [
    ...inputSentences,
    ...articleSentenceGroups.flat(),
  ]

  const allVectors = computeTFIDF(allSentences)

  // Slice back into input vectors and per-article vectors
  const inputVectors = allVectors.slice(0, inputSentences.length)

  let offset = inputSentences.length
  const articleVectorGroups: Map<string, number>[][] = articleSentenceGroups.map(
    group => {
      const vecs = allVectors.slice(offset, offset + group.length)
      offset += group.length
      return vecs
    },
  )

  // Compare and collect results
  const matches: ArticleMatch[] = []

  for (let a = 0; a < libraryArticles.length; a++) {
    const article = libraryArticles[a]
    const articleSentences = articleSentenceGroups[a]
    const articleVectors = articleVectorGroups[a]

    const matchedPairs: MatchedPair[] = []
    let articleMaxScore = 0

    for (let i = 0; i < inputSentences.length; i++) {
      for (let j = 0; j < articleSentences.length; j++) {
        const score = cosineSimilarity(inputVectors[i], articleVectors[j])
        const scorePct = Math.round(score * 100 * 100) / 100  // 2 decimal places

        if (scorePct > 20) {
          matchedPairs.push({
            inputSentence: inputSentences[i],
            librarySentence: articleSentences[j],
            score: scorePct,
          })
        }

        if (scorePct > articleMaxScore) articleMaxScore = scorePct
      }
    }

    if (articleMaxScore > 20) {
      // Keep only the top-scoring pair per input sentence to reduce noise
      const bestPairs = deduplicatePairs(matchedPairs)
      matches.push({
        articleId: article.id,
        articleTitle: article.title,
        similarityScore: Math.round(articleMaxScore * 100) / 100,
        matchedPairs: bestPairs,
      })
    }
  }

  // Sort by similarity descending
  matches.sort((a, b) => b.similarityScore - a.similarityScore)

  const overallScore =
    matches.length > 0 ? matches[0].similarityScore : 0

  return { overallScore, matches }
}

/**
 * For each unique input sentence, keep only the highest-scoring library pair.
 * Prevents the result from being flooded with low-quality duplicates.
 */
function deduplicatePairs(pairs: MatchedPair[]): MatchedPair[] {
  const best = new Map<string, MatchedPair>()
  for (const pair of pairs) {
    const existing = best.get(pair.inputSentence)
    if (!existing || pair.score > existing.score) {
      best.set(pair.inputSentence, pair)
    }
  }
  return Array.from(best.values()).sort((a, b) => b.score - a.score)
}
