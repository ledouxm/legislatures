import { NextResponse } from 'next/server';

type Page = {
    missing?: boolean;
    fullurl?: string;
    extract?: string;
    thumbnail?: {
        source: string;
    };
};

// How I should credit the source of the data
// https://fr.wikipedia.org/w/index.php?title=Sp%C3%A9cial:Citer&page=Rassemblement_du_peuple_fran%C3%A7ais&id=216487681&wpFormIdentifier=titleform

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Veuillez fournir un mot-clé' }, { status: 400 });
    }

    // Separate the page title from the section title (WIP )
    // const [pageTitle, sectionTitle] = keyword.split('#'); 
    const pageTitle = keyword.split(' #')[0];
    if (!pageTitle) {
        return NextResponse.json({ error: 'Nom de la page manquant' }, { status: 400 });
    }
  
    const url = `https://fr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent( pageTitle )}&prop=extracts|pageimages|info&exintro&explaintext&inprop=url&pithumbsize=500&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erreur lors de la requête à Wikipédia');
    }
    
    const data = await response.json();
    const pages = data.query.pages;
    const page: Page = Object.values(pages)[0];

    if (!page || page.missing) {
        return NextResponse.json({ error: 'Page non trouvée' }, { status: 404 });
    }

    // Get the thumbnail, page URL and extract
    const thumbnail = page.thumbnail ? page.thumbnail.source : null;
    const pageUrl = page.fullurl;
    const fullText = page.extract;

    // Get the first paragraph and trim text in parentheses (and the space before)
    const firstParagraph = fullText.split('\n')[0].replace(/ \([^)]*\)/g, '');
    return NextResponse.json({ firstParagraph, thumbnail, pageUrl }, { status: 200 });

    // if (!sectionTitle) {
    //     const firstParagraph = fullText.split('\n')[0];
    //     return NextResponse.json({ firstParagraph }, { status: 200 });
    // } else {
    //     console.log(page);
    //     const sections = fullText.split('\n');
    //     const section = sections.find((section) => section.startsWith(sectionTitle));

    //     if (!section) {
    //     return NextResponse.json({ error: 'Section non trouvée' }, { status: 404 });
    //     }

    //     const firstParagraph = section.split('\n')[0];
    //     return NextResponse.json({ firstParagraph }, { status: 200 });
    // }
  } catch (error) {
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}