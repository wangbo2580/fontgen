export interface FontStyle {
  slug: string;
  label: string;
  description: string;
  useCases: string[];
  sampleText: string;
  faqs: { q: string; a: string }[];
}

export const FONT_STYLES: FontStyle[] = [
  {
    slug: 'calligraphy',
    label: 'Calligraphy',
    description:
      'Calligraphy fonts are built on centuries of penmanship tradition — thick downstrokes, thin upstrokes, and deliberate flourishes. With FontGen, you write the alphabet in your own calligraphic style, snap a photo, and get a working .OTF file. The result preserves the stroke weight variation and flow of your original pen work, so the font actually looks like your calligraphy instead of a generic template.',
    useCases: [
      'Wedding invitations and place cards',
      'Certificate and diploma headings',
      'Brand logos with a handcrafted feel',
      'Greeting cards and personal stationery',
    ],
    sampleText: 'Elegant Flourish',
    faqs: [
      { q: 'What pen should I use to write the calligraphy template?', a: 'A broad-tipped pen, dip pen, or brush pen all work well. Use dark ink on white paper so the AI can clearly detect the edges of your strokes. Felt-tip calligraphy markers from any stationery shop are a good budget option.' },
      { q: 'Will the font keep my thick-and-thin stroke variation?', a: 'Yes. FontGen traces the actual contour of each letter, so the thick-thin contrast you create with your pen is preserved in the digital font.' },
      { q: 'Can I use this for wedding invitations?', a: 'Definitely — many users make a calligraphy font specifically for wedding stationery. You write the alphabet once, and then you can type out all your invitations, menus, and place cards in your handwriting.' },
    ],
  },
  {
    slug: 'signature',
    label: 'Signature',
    description:
      'A signature font turns your personal sign-off into something you can type. Instead of signing every document by hand or pasting an image, you install the font and type your name in your own handwriting. FontGen captures each letter from your signature style — the slant, the loops, the way you connect strokes — and packages it as a standard .OTF font file.',
    useCases: [
      'Email sign-offs and letterheads',
      'Personal branding and logos',
      'Author pages and book covers',
      'Portfolio watermarks',
    ],
    sampleText: 'John Smith',
    faqs: [
      { q: 'Can I make a font from just my signature?', a: 'You still need to write all 26 letters (A-Z) in your signature handwriting style. The font is a full alphabet, not just your name — but written in the same way you sign things.' },
      { q: 'Is a signature font legally binding?', a: 'A font is a typeface, not a legal signature. For legally binding documents, check the digital signature laws in your jurisdiction. Most places require actual electronic signature tools, not fonts.' },
      { q: 'Can I use this on business cards?', a: 'Yes — with a paid plan that includes commercial rights (Business tier), you can use it on business cards, websites, letterheads, and any branded material.' },
    ],
  },
  {
    slug: 'cursive',
    label: 'Cursive',
    description:
      'Cursive handwriting connects letters in a flowing, natural way. When you convert cursive writing to a font, the individual letter shapes carry that connected feel even though digital fonts render one glyph at a time. The trick is to write each letter with natural entry and exit strokes so they blend well when typed. FontGen handles the tracing and spacing — you just need to write naturally.',
    useCases: [
      'Personal letters and journal headers',
      'Blog post titles and pull quotes',
      'Social media quote graphics',
      'Product packaging that needs a personal touch',
    ],
    sampleText: 'Flowing Script',
    faqs: [
      { q: 'Will the cursive letters actually connect when I type?', a: 'Each glyph is a separate character, so there are small gaps between letters — similar to most commercial cursive fonts. Writing your letters with natural lead-in and lead-out strokes helps them visually flow together.' },
      { q: 'What pen works best for cursive?', a: 'Whatever you normally write cursive with. A ballpoint or gel pen is fine. The goal is your natural handwriting, not a special tool.' },
      { q: 'Can kids use this to make a font from their cursive practice?', a: 'Sure. It is a fun project for students learning cursive — they practice the alphabet and end up with an actual installable font at the end.' },
    ],
  },
  {
    slug: 'handwritten',
    label: 'Handwritten',
    description:
      'This is the most straightforward use case for FontGen: take your everyday handwriting and turn it into a font. No special style needed. The wobble in your letters, the way your "a" never looks quite the same twice, the slightly crooked baselines — that is what gives a handwritten font its character. Write the alphabet once, and you get a font that looks like your actual penmanship.',
    useCases: [
      'Personal planners and to-do lists',
      'Indie brand logos and packaging',
      'Teaching materials and worksheets',
      'Social media posts with a personal voice',
    ],
    sampleText: 'Natural Writing',
    faqs: [
      { q: 'How close to my real handwriting will the font look?', a: 'Pretty close. The AI traces the exact outlines of each letter you write. The main difference from real handwriting is that each "A" will always look the same — in real writing you naturally vary each letter slightly.' },
      { q: 'Should I write carefully or normally?', a: 'Write how you normally do, but a bit slower than usual. Rushed handwriting tends to have overlapping strokes that are harder to trace cleanly. You do not need to be a calligrapher — just legible.' },
      { q: 'Can I create a font on my phone?', a: 'Yes. You can write on paper and photograph it with your phone camera, or use the in-browser canvas tool on mobile. Both methods work.' },
    ],
  },
  {
    slug: 'gothic',
    label: 'Gothic',
    description:
      'Gothic lettering (also called blackletter or Fraktur) uses angular, heavy strokes inspired by medieval European manuscripts. The letters are dramatic and immediately recognizable — think old German bibles, heavy metal logos, or newspaper mastheads like the New York Times. To create a gothic font with FontGen, you write each letter with angular, broad-edged strokes, and the tool converts your hand-drawn blackletter into a working digital font.',
    useCases: [
      'Band logos and album art',
      'Game titles (fantasy, medieval, horror)',
      'Tattoo lettering reference',
      'Event posters and flyers',
    ],
    sampleText: 'Dark Knight',
    faqs: [
      { q: 'Do I need a special pen for gothic lettering?', a: 'A broad-edged marker or chisel-tip pen held at about 45 degrees gives you the characteristic thick verticals and thin horizontals. If you do not have one, a regular thick marker works — just draw the letterforms manually.' },
      { q: 'Is gothic text hard to read?', a: 'At body text sizes, yes — it is meant for display use. Use it for titles, logos, and short phrases. Pair it with a readable sans-serif or serif for body text.' },
      { q: 'Can I make a Fraktur-style font?', a: 'Yes. The tool converts whatever you draw. If you write in Fraktur, Old English, or any blackletter variation, the font will match your specific style.' },
    ],
  },
  {
    slug: 'brush',
    label: 'Brush',
    description:
      'Brush lettering has a raw, energetic quality that comes from the physical tool — a brush pen, paint brush, or thick marker creates strokes that swell and taper naturally. FontGen captures these variations in stroke width, so your brush-written letters keep their dynamic feel as a digital font. This style works especially well for logos, headers, and anything that needs visual energy.',
    useCases: [
      'Brand identity and logo design',
      'Poster and flyer headlines',
      'Art prints and merchandise',
      'YouTube thumbnails and social media headers',
    ],
    sampleText: 'Bold Strokes',
    faqs: [
      { q: 'What kind of brush should I use?', a: 'A brush pen (like Pentel Fude or Tombow) is the easiest option. Traditional paintbrushes and thick markers also work. Use fast, confident strokes — hesitant strokes look wobbly in the final font.' },
      { q: 'Does the font keep the stroke width variation?', a: 'Yes. FontGen traces the actual outline of each letter, so thick and thin parts of your brushwork are preserved exactly as you drew them.' },
      { q: 'Is this good for Asian-style calligraphy?', a: 'FontGen currently supports Latin characters (A-Z, a-z, 0-9, punctuation). Chinese, Japanese, and Korean character support is not available yet.' },
    ],
  },
  {
    slug: 'retro',
    label: 'Retro',
    description:
      'Retro fonts pull from specific eras — 1950s diner signs, 1960s mod posters, 1970s disco, 1980s arcade screens. The look you get depends entirely on how you draw the letters. Round, bubbly letters feel 60s. Blocky, geometric shapes read as 80s. FontGen does not impose a style; it faithfully converts whatever retro lettering you create by hand into a usable font file.',
    useCases: [
      'Vintage-themed brand packaging',
      'Retro restaurant and cafe menus',
      'Throwback social media campaigns',
      'Poster and flyer design',
    ],
    sampleText: 'Vintage Vibes',
    faqs: [
      { q: 'How do I achieve a retro look?', a: 'Study lettering from your target decade. 50s: round, friendly, thick letters. 70s: geometric, disco-inspired shapes. 80s: angular, tech-inspired forms. Draw the alphabet in that style and FontGen handles the rest.' },
      { q: 'Can I add a distressed/worn texture?', a: 'The font file itself is clean vector outlines. To add texture, grain, or wear effects, apply those in your design tool (Photoshop, Canva, etc.) after installing the font.' },
      { q: 'What pen gives the most retro feel?', a: 'Chisel-tip markers for bold 50s/60s lettering, fine-point pens for 70s-style script. Match the tool to the era you are targeting.' },
    ],
  },
  {
    slug: 'vintage',
    label: 'Vintage',
    description:
      'Where retro is playful, vintage is refined. Vintage fonts draw from late 1800s and early 1900s typography — think apothecary labels, old whiskey bottles, and handwritten shop signs. These fonts tend to have careful, measured letterforms with subtle decorative elements. They work well for brands that want to communicate heritage, craftsmanship, and authenticity.',
    useCases: [
      'Craft beer and spirits labels',
      'Artisan food packaging',
      'Antique and vintage shop branding',
      'Heritage event invitations',
    ],
    sampleText: 'Classic Heritage',
    faqs: [
      { q: 'How is vintage different from retro?', a: 'Vintage references the late 1800s to early 1900s — think Victorian, Art Nouveau, and Edwardian styles. Retro typically means mid-to-late 20th century (50s through 80s). Vintage tends to be more ornate and formal.' },
      { q: 'What tools create a vintage handwriting feel?', a: 'A dip pen, fountain pen, or fine-point felt pen works well. Write slowly and deliberately — vintage lettering has a careful, measured quality rather than a quick, casual feel.' },
      { q: 'Can I use a vintage font on product labels?', a: 'Yes, with the Business plan which includes a commercial use license. Many users create vintage-style fonts specifically for product packaging and labels.' },
    ],
  },
  {
    slug: 'minimalist',
    label: 'Minimalist',
    description:
      'Minimalist handwriting fonts strip away everything unnecessary — no flourishes, no decoration, just clean letterforms. The challenge is that simplicity demands consistency: each letter needs even stroke weight, similar sizing, and clean lines. The payoff is a font that feels modern, professional, and readable. Works well in contexts where a human touch is needed without the visual noise of a decorative style.',
    useCases: [
      'Modern website headings',
      'Tech and startup branding',
      'Clean portfolio and resume design',
      'Minimal packaging and labels',
    ],
    sampleText: 'Clean Design',
    faqs: [
      { q: 'How do I write in a minimalist style?', a: 'Use a fine-point pen (0.3-0.5mm). Write slowly with consistent stroke width. No loops, no flourishes — just the simplest version of each letter. Think print handwriting, not cursive.' },
      { q: 'Is a minimalist handwriting font readable at small sizes?', a: 'Generally yes, more so than decorative styles. Test it at your target size before committing — what works at 24px might not work at 12px.' },
      { q: 'Can I make a really thin minimalist font?', a: 'Yes. Use the thinnest pen you have (0.1mm-0.3mm technical pen). The thinner your strokes, the thinner the font will be.' },
    ],
  },
  {
    slug: 'elegant',
    label: 'Elegant',
    description:
      'Elegant fonts sit between calligraphy and everyday script — more polished than casual handwriting, but less formal than full calligraphy. The key characteristics are consistent baselines, gentle curves, and subtle variation in stroke width. Think of how you would write a handwritten note to someone you want to impress: careful, intentional, but still natural.',
    useCases: [
      'High-end brand identity',
      'Fashion and beauty product packaging',
      'Formal event invitations',
      'Luxury real estate materials',
    ],
    sampleText: 'Graceful Beauty',
    faqs: [
      { q: 'What makes handwriting look elegant?', a: 'Consistency is the biggest factor — even letter sizes, consistent slant, and balanced spacing. A pointed pen or flexible nib helps create thick-thin contrast, which adds refinement.' },
      { q: 'Do I need calligraphy experience?', a: 'No. Just write carefully and intentionally. Practice the alphabet a few times on scratch paper first, then write the final version for the template. Take your time with each letter.' },
      { q: 'Is this good for wedding stationery?', a: 'Yes. Elegant fonts are one of the most common choices for wedding-related materials — invitations, menus, seating charts, thank-you cards.' },
    ],
  },
  {
    slug: 'pixel',
    label: 'Pixel',
    description:
      'Pixel fonts are usually designed digitally on a grid, but you can also draw pixel-style letters by hand on graph paper — fill in squares to build each character block by block. FontGen traces these blocky shapes into vector outlines, giving you a font that has the pixel aesthetic but works as a standard .OTF file. It is a fun crossover between analog drawing and digital design.',
    useCases: [
      'Indie game interfaces and menus',
      'Retro-tech and 8-bit inspired designs',
      'Pixel art projects and zines',
      'Nostalgic merch and apparel',
    ],
    sampleText: 'GAME OVER',
    faqs: [
      { q: 'How do I actually hand-draw a pixel font?', a: 'Get graph paper (or print a grid). Each character occupies a box — say 8 squares wide by 10 tall. Fill in the squares you want to be "on" with a marker. Photograph the sheet and upload it.' },
      { q: 'Will the edges be perfectly sharp and square?', a: 'The AI traces the outlines of what you drew, so the result is close but may have slight rounding. For pixel-perfect edges, you could clean up the font in a font editor afterward.' },
      { q: 'What grid size works best?', a: 'An 8x8 or 8x12 grid per character is a good starting point. Larger grids (16x16) allow more detail. Use a thick marker and fill squares completely for the clearest result.' },
    ],
  },
  {
    slug: 'graffiti',
    label: 'Graffiti',
    description:
      'Graffiti lettering is bold, stylized, and expressive — letters twist, overlap, and break the rules of conventional typography. When creating a graffiti-style font, the challenge is that each letter needs to stand alone (since fonts render one glyph at a time) while still carrying that street-art energy. Use thick markers or paint markers and draw each letter with exaggerated proportions, sharp angles, or wild curves.',
    useCases: [
      'Street art inspired graphic design',
      'Music and event promotion',
      'Skateboard and streetwear graphics',
      'Youth-market branding and apparel',
    ],
    sampleText: 'STREET ART',
    faqs: [
      { q: 'What markers should I use?', a: 'Broad chisel-tip markers, paint markers, or thick permanent markers. The bolder and chunkier, the better. Graffiti lettering is not subtle — go big.' },
      { q: 'Can the font include 3D effects and shadows?', a: 'The font captures the flat 2D outline of each letter. To add 3D effects, drop shadows, outlines, and color fills, use design software like Photoshop or Illustrator after installing the font.' },
      { q: 'Will it look like real graffiti?', a: 'It will look like your hand-drawn graffiti lettering in font form. The style depends on what you draw — wild style, bubble letters, throwup style, etc. The tool converts it faithfully.' },
    ],
  },
  {
    slug: 'neon',
    label: 'Neon',
    description:
      'Neon sign lettering uses continuous, single-line strokes — because real neon tubes are bent from one piece of glass. To mimic this as a font, write each letter with smooth, consistent-width strokes as if you were bending a tube into shape. The font file gives you the letterforms; the actual glow effect gets added later in CSS or design software.',
    useCases: [
      'Bar and restaurant signage mockups',
      'Neon sign design proposals',
      'Retro-futuristic and synthwave designs',
      'Event and nightlife promotional materials',
    ],
    sampleText: 'OPEN 24/7',
    faqs: [
      { q: 'How do I make letters look like neon tubes?', a: 'Use a medium-weight pen and draw each letter in a single continuous stroke where possible. Keep the line width consistent — real neon tubes have uniform thickness. Smooth curves work better than sharp corners.' },
      { q: 'Does the font glow?', a: 'No — a font file is just letter shapes. The glow effect comes from your design tool. In CSS you would use text-shadow; in Photoshop you would use Outer Glow. The font gives you the neon-style letterforms to apply effects to.' },
      { q: 'What colors work for a neon look?', a: 'The font is monochrome (like any font). Set the text color to bright pink, blue, green, or orange in your design tool, then add a matching glow effect around it.' },
    ],
  },
  {
    slug: 'serif',
    label: 'Serif',
    description:
      'Serifs are the small strokes or "feet" at the ends of letterforms — think Times New Roman versus Arial. Creating a handwritten serif font means drawing each letter with these decorative endings by hand, which gives the font a bookish, editorial quality while retaining the warmth of handwriting. It is a niche style that bridges formal typography and personal penmanship.',
    useCases: [
      'Book covers and chapter headers',
      'Editorial and magazine design',
      'Academic presentations and papers',
      'Formal business stationery',
    ],
    sampleText: 'Times Editorial',
    faqs: [
      { q: 'How do I draw serifs by hand?', a: 'Write each letter stroke first, then add small horizontal or wedge-shaped lines at the stroke endings. A fine-point pen gives you more control over the small serif details.' },
      { q: 'What is the difference between serif and sans-serif?', a: 'Serif fonts have small strokes at the ends of letters (like Times New Roman). Sans-serif means "without serifs" — clean stroke endings (like Arial or Helvetica).' },
      { q: 'Are handwritten serif fonts readable?', a: 'At larger sizes (headlines, titles), yes. For long body text, test carefully — handwritten fonts are generally less readable than professionally designed text faces at small sizes.' },
    ],
  },
  {
    slug: 'script',
    label: 'Script',
    description:
      'Script fonts are the more formal cousin of cursive — think formal invitations rather than personal notes. Script lettering tends to have consistent slant, pronounced thick-thin contrast, and decorative flourishes on key letters. When creating one with FontGen, write slowly and deliberately. The more care you put into each letter, the more polished the final font will look.',
    useCases: [
      'Formal invitations and announcements',
      'Certificate and award designs',
      'Beauty and fashion branding',
      'Greeting cards and personal stationery',
    ],
    sampleText: 'Graceful Script',
    faqs: [
      { q: 'What is the difference between script and cursive?', a: 'Script is typically more formal and decorative — think copperplate or Spencerian writing. Cursive is more casual, everyday connected handwriting. Script fonts usually have more flourishes and consistent thick-thin contrast.' },
      { q: 'Do I need calligraphy training to write script?', a: 'No, though practicing a few times on scratch paper helps. Look at examples of formal script lettering for reference, then write the alphabet in that style. You do not need to be an expert.' },
      { q: 'Can I make a monoline script (no thick-thin variation)?', a: 'Yes. Use a ballpoint pen or fine-liner for consistent stroke width. The result will be a monoline script font. For thick-thin variation, use a pointed pen or brush pen.' },
    ],
  },
  {
    slug: 'bold',
    label: 'Bold',
    description:
      'Bold handwriting fonts use thick, heavy strokes that demand attention. They are headline fonts — designed to be read at a glance from a distance. The thicker your pen and the more confident your strokes, the bolder the font will be. This is not about subtlety; it is about impact. Use the thickest marker you own and write with conviction.',
    useCases: [
      'Poster and billboard headlines',
      'Social media cover images and ads',
      'Sports and fitness branding',
      'Sale banners and promotional graphics',
    ],
    sampleText: 'IMPACT',
    faqs: [
      { q: 'What pen gives the boldest result?', a: 'A thick chisel-tip permanent marker, wide brush pen, or even a paint marker. The goal is maximum stroke width. If your pen feels too thin, it is too thin.' },
      { q: 'Will bold letters lose detail at small sizes?', a: 'Bold fonts are meant for large sizes — headlines, titles, logos. At small sizes, thick strokes can merge and become hard to read. That is by design.' },
      { q: 'Can I create both bold and regular weights?', a: 'Yes, but as two separate fonts. Write the alphabet once with a thick marker (bold) and once with a regular pen (regular). Generate two separate font files.' },
    ],
  },
  {
    slug: 'tattoo',
    label: 'Tattoo',
    description:
      'Tattoo lettering draws from a long tradition of decorative, ornamental hand lettering — chicano script, traditional Americana, neo-traditional, blackwork. Creating a tattoo-style font means writing letters with strong outlines, decorative elements, and high contrast. Tattoo artists and clients use these fonts to plan lettering layouts before committing to skin.',
    useCases: [
      'Tattoo design planning and mockups',
      'Band and music merchandise',
      'Alternative lifestyle branding',
      'Custom apparel and prints',
    ],
    sampleText: 'Ink & Soul',
    faqs: [
      { q: 'Do tattoo artists actually use this?', a: 'Some do — a custom lettering font is useful for laying out text placement and sizing before tattooing. The Business plan includes commercial use rights for professional tattoo artists.' },
      { q: 'What style of writing works for a tattoo font?', a: 'Draw bold, decorative letters with strong outlines. Look at tattoo flash art for inspiration. Chicano script, old English, and ornamental styles all translate well to fonts.' },
      { q: 'Can I preview how text would look as a tattoo?', a: 'Once you generate the font, you can type any word or phrase to preview it. This is helpful for testing names, quotes, and phrases before getting inked.' },
    ],
  },
  {
    slug: 'comic',
    label: 'Comic',
    description:
      'Comic book lettering has a specific look — slightly uneven, all caps, energetic, and highly readable in speech bubbles. Professional comics use custom hand-lettered fonts for exactly this reason. FontGen lets you create your own comic font by writing the alphabet in that loose, rounded, all-caps style that works for dialogue, sound effects, and narration boxes.',
    useCases: [
      'Comic book and webcomic lettering',
      'Children\'s book text',
      'Casual game UI and dialogue',
      'Fun and playful marketing materials',
    ],
    sampleText: 'POW! BANG!',
    faqs: [
      { q: 'How do I get the comic book lettering look?', a: 'Write in all uppercase with slightly rounded, uneven letterforms. Use a medium felt-tip pen and keep the style loose — comic lettering has energy, not precision. Look at any comic book for reference.' },
      { q: 'Can I use this in my webcomic?', a: 'Yes. The Free plan lets you preview the font. The Basic plan gives you a downloadable .OTF file you can install and use in any art program for your webcomic lettering.' },
      { q: 'Should I bother making lowercase letters?', a: 'Traditional comic lettering is all uppercase. But if you want lowercase for other uses (web, social media), it does not hurt to create them too — they just will not look like typical comic book text.' },
    ],
  },
  {
    slug: 'modern',
    label: 'Modern',
    description:
      'Modern handwriting fonts sit in the sweet spot between too-casual and too-formal. They look intentional but not stiff — the kind of handwriting you see on carefully designed Instagram posts, product packaging, and branding for studios and cafes. The trick is to write naturally but with a bit more care than your grocery list. Consistent letter size, relaxed slant, and clean (but not perfect) strokes.',
    useCases: [
      'Contemporary brand identity',
      'Website and app accent text',
      'Social media content and stories',
      'Product packaging and labels',
    ],
    sampleText: 'Fresh Look',
    faqs: [
      { q: 'What counts as a "modern" handwriting style?', a: 'Think polished-casual. Not cursive, not block letters — somewhere in between. Consistent sizing, slightly relaxed slant, clean but not rigid. The look you see on trendy cafe chalkboards and lifestyle brands.' },
      { q: 'Can I use a modern font in a website design?', a: 'Yes. With paid plans that include .WOFF2 output (Business tier), you get web-optimized font files. For other tiers, the .OTF file works for most web use cases.' },
      { q: 'What pen works best?', a: 'A medium-point pen (0.5-0.7mm). Not too thick, not too thin. Write at your normal pace but with a bit more attention to consistency than usual.' },
    ],
  },
  {
    slug: 'wedding',
    label: 'Wedding',
    description:
      'Wedding fonts are romantic, flowing, and personal — which is why many couples prefer a font made from their own handwriting over a generic script font. You write the alphabet in your best formal hand, convert it with FontGen, and then use it consistently across invitations, menus, place cards, programs, thank-you cards, and your wedding website. One font, your handwriting, everything matching.',
    useCases: [
      'Wedding invitations and save-the-dates',
      'Seating charts and place cards',
      'Wedding website headers',
      'Thank-you cards and programs',
    ],
    sampleText: 'Forever & Always',
    faqs: [
      { q: 'How far ahead should I create my wedding font?', a: 'Give yourself at least 2-3 months before you need to start printing. That gives you time to write the template, generate the font, test it on sample text, and redo it if needed.' },
      { q: 'Can both partners write letters for the same font?', a: 'You could each write half the alphabet, though the style might not be perfectly consistent. A more practical approach is for one person to write the font and the other to choose the style direction.' },
      { q: 'What if my handwriting is not very elegant?', a: 'Practice the alphabet a few times on scratch paper before writing the final template. Write slowly and deliberately. You do not need to be a calligrapher — careful, intentional handwriting looks great as a wedding font.' },
    ],
  },
];

export function getStyleBySlug(slug: string): FontStyle | undefined {
  return FONT_STYLES.find((s) => s.slug === slug);
}

export function getAllStyleSlugs(): string[] {
  return FONT_STYLES.map((s) => s.slug);
}
