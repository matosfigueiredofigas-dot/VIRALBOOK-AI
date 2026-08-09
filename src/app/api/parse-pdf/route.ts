import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const pdfParse = require('pdf-parse');
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro fornecido.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'O ficheiro deve ser um PDF.' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdfParse(buffer);
    
    // We limit text to ~15000 chars to avoid breaking the prompt limits
    const text = data.text.substring(0, 15000);

    return NextResponse.json({ text, pages: data.numpages });
  } catch (error: any) {
    console.error('Erro ao fazer parse do PDF:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar o PDF.' }, { status: 500 });
  }
}
