import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkPlagiarism } from '@/lib/plagiarism'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const text: string = body?.text

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    // Fetch all articles (id, title, content only)
    const articles = await prisma.article.findMany({
      select: { id: true, title: true, content: true },
    })

    // Run the plagiarism engine
    const result = checkPlagiarism(text, articles)

    // Persist the report (store only the first 500 chars of input text)
    await prisma.plagiarismReport.create({
      data: {
        inputText: text.slice(0, 500),
        overallScore: result.overallScore,
        results: JSON.stringify(result.matches),
      },
    })

    return NextResponse.json({ ...result, totalArticles: articles.length })
  } catch (err) {
    console.error('[POST /api/check]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
