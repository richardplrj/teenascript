import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { computeTFIDF } from '@/lib/plagiarism'

// GET /api/articles — list all articles (no full content)
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(articles)
  } catch (err) {
    console.error('[GET /api/articles]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/articles — create a new article and compute its TF-IDF vector
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, author, category, content } = body ?? {}

    if (!title || !author || !category || !content) {
      return NextResponse.json(
        { error: 'title, author, category, and content are required' },
        { status: 400 },
      )
    }

    const validCategories = [
      'Science', 'Technology', 'Literature', 'History', 'Philosophy', 'Other',
    ]
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `category must be one of: ${validCategories.join(', ')}` },
        { status: 400 },
      )
    }

    // Compute a single-document TF-IDF vector (IDF=log(1/1)=0 for all terms,
    // so we store the raw TF map instead — useful for future cross-doc comparison)
    const [tfidfMap] = computeTFIDF([content])
    const tfidfVector = JSON.stringify(Object.fromEntries(tfidfMap))

    const article = await prisma.article.create({
      data: { title, author, category, content, tfidfVector },
    })

    // Don't expose the tfidfVector (large JSON blob) to the client
    const { tfidfVector: _vec, ...safeArticle } = article
    return NextResponse.json(safeArticle, { status: 201 })
  } catch (err) {
    console.error('[POST /api/articles]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
