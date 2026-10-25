/* Ernesto Musca — dati condivisi di linee, famiglie di prodotto e marchi partner.
   Le informazioni sui marchi provengono da fonti pubbliche (siti ufficiali, schede aziendali). */
window.EM = {
  lines: [
    {
      id: 'detergenza', n: '01', title: 'Detergenza professionale', short: 'Detergenza',
      image: 'assets/01_detergenza.webp',
      lead: 'Pulito vero, dalla cucina alla sala.',
      text: 'Detergenti per lavastoviglie, sgrassanti, prodotti per pavimenti, superfici, vetri e bagno, igienizzanti e linee Ecolabel. Formulazioni professionali, anche concentrate, per ristorazione, strutture ricettive e comunità.',
      families: [
        { name: 'Lavastoviglie', items: ['Detergenti liquidi e solidi', 'Brillantanti', 'Disincrostanti', 'Lavaggio manuale stoviglie'], brands: ['bettari', 'christeyns'] },
        { name: 'Cucina e ristorazione', items: ['Sgrassatori', 'Pulitori per forni e griglie', 'Detergenti per cucine e mense', 'Igienizzanti per superfici alimentari'], brands: ['bettari', 'christeyns'] },
        { name: 'Ambienti', items: ['Lavapavimenti', 'Detergenti superfici e multiuso', 'Detergenti vetri', 'Detergenti e disincrostanti bagno', 'Profumatori', 'Superconcentrati'], brands: ['bettari', 'christeyns'] },
        { name: 'Igiene e disinfezione', items: ['Detergenti igienizzanti', 'Disinfettanti (PMC)', 'Saponi lavamani'], brands: ['bettari'] },
        { name: 'Linee Ecolabel', items: ['Detergenti ambiente e bagno', 'Lavastoviglie e lavapiatti certificati'], brands: ['bettari'] },
        { name: 'Lavanderia', items: ['Detergenti a dosaggio automatico e manuale', 'Ammorbidenti', 'Smacchiatori'], brands: ['bettari', 'christeyns'] }
      ]
    },
    {
      id: 'carta', n: '02', title: 'Carta', short: 'Carta',
      image: 'assets/02_carta.webp',
      lead: 'Dal bagno alla tavola, la carta giusta.',
      text: 'Carta igienica, asciugamani piegati e in rotolo, bobine industriali. E per la tavola tovaglioli, tovaglie, tovagliette e runner, anche personalizzati con il tuo marchio.',
      families: [
        { name: 'Igiene bagno', items: ['Carta igienica', 'Carta igienica jumbo', 'Veline'], brands: ['foscart'] },
        { name: 'Asciugamani', items: ['Asciugamani piegati', 'Asciugamani in rotolo', 'Asciugamani per dispenser'], brands: ['foscart'] },
        { name: 'Carta industriale', items: ['Bobine', 'Rotoli multiuso in ovatta di cellulosa'], brands: ['foscart'] },
        { name: 'Tavola', items: ['Tovaglioli', 'Tovaglie e coprimacchia', 'Tovagliette', 'Runner', 'Coordinati'], brands: ['okay'] },
        { name: 'Servizio', items: ['Buste portaposate', 'Linea Catering', 'Linea Green', 'Stampa personalizzata'], brands: ['okay'] }
      ]
    },
    {
      id: 'monouso', n: '03', title: 'Monouso', short: 'Monouso',
      image: 'assets/03_monouso.webp',
      lead: 'Le piccole cose che fanno girare il lavoro.',
      text: 'Guanti, bicchieri, piatti, posate e cannucce, copriscarpe e shopper. Con una scelta crescente di prodotti compostabili e biodegradabili.',
      families: [
        { name: 'Guanti e protezione', items: ['Guanti monouso', 'Copriscarpe', 'Abbigliamento monouso'], brands: ['siam'] },
        { name: 'Bicchieri e cannucce', items: ['Bicchieri in carta', 'Bicchieri da caffè', 'Bicchieri in plastica', 'Cannucce'], brands: ['leone', 'bibo'] },
        { name: 'Piatti e posate', items: ['Piatti piani e fondi', 'Posate', 'Palette e mescolatori'], brands: ['bibo', 'leone'] },
        { name: 'Compostabili', items: ['Linea Cuoreverde', 'Linea Natural Bibo (EN 13432)', 'Piatti in cellulosa e canna da zucchero'], brands: ['leone', 'bibo'] },
        { name: 'Shopper e consumabili', items: ['Shopper bio', 'Articoli party', 'Linea cortesia per hotel'], brands: ['siam', 'leone'] }
      ]
    },
    {
      id: 'attrezzature', n: '04', title: 'Attrezzature', short: 'Attrezzature',
      image: 'assets/04_attrezzature.webp',
      lead: 'Gli strumenti di chi pulisce bene.',
      text: 'Mop, frange e manici, panni e spugne, secchi e carrelli, tergivetro e dispenser. Più i sistemi di dosaggio che rendono il consumo di detergente preciso e misurabile.',
      families: [
        { name: 'Lavaggio pavimenti', items: ['Mop', 'Frange', 'Manici', 'Secchi con strizzatore'], brands: [] },
        { name: 'Panni e spugne', items: ['Panni in microfibra', 'Spugne abrasive', 'Panni multiuso'], brands: [] },
        { name: 'Carrelli', items: ['Carrelli per la pulizia', 'Carrelli multifunzione'], brands: [] },
        { name: 'Vetri', items: ['Tergivetro', 'Vello lavavetri'], brands: [] },
        { name: 'Dispenser e dosaggio', items: ['Dispenser per carta', 'Dispenser per sapone', 'Sistemi di dosaggio detergenti'], brands: ['christeyns'] }
      ]
    },
    {
      id: 'food', n: '05', title: 'Monouso per il food', short: 'Food',
      image: 'assets/05_food.webp',
      lead: 'Asporto, delivery e banco, fatti con cura.',
      text: 'Vaschette in alluminio e termosaldabili con relativi film, contenitori e posate in legno, box, vassoi e finger food. Tutto quello che serve per servire, conservare e consegnare.',
      families: [
        { name: 'Alluminio', items: ['Vaschette in alluminio', 'Coperchi', 'Linea Smoothwall', 'Rotoli alluminio professionali'], brands: ['cuki'] },
        { name: 'Termosaldatura', items: ['Vaschette termosaldabili', 'Pellicole termosaldabili', 'Film per alimenti'], brands: ['cuki'] },
        { name: 'Legno e naturali', items: ['Posate in legno', 'Contenitori in legno', 'Complementi in acacia e bamboo'], brands: ['leone'] },
        { name: 'Finger food e catering', items: ['Coppette e vassoi finger food', 'Spiedi e forchettine', 'Stuzzicadenti'], brands: ['leone'] },
        { name: 'Box e vassoi', items: ['Box per asporto', 'Vassoi in cartone', 'Sottotorta'], brands: ['novaservice', 'leone'] }
      ]
    },
    {
      id: 'imballaggi', n: '06', title: 'Imballaggi e contenitori', short: 'Imballaggi',
      image: 'assets/06_imballaggi.webp',
      lead: 'La forma giusta per ogni prodotto.',
      text: 'Scatole per pizzeria e pasticceria, pirottini e stampi da forno, packaging alimentare e regalo, buste e sacchetti, film estensibile, nastri e reggette.',
      families: [
        { name: 'Pasticceria', items: ['Pirottini', 'Stampi da forno per panettone e colomba', 'Stampi per plum cake e muffin', 'Pizzi e sottotorta'], brands: ['novaservice'] },
        { name: 'Scatole', items: ['Scatole per torte', 'Scatole e vassoi per dolci', 'Scatole per pizzeria', 'Scatole in cartone'], brands: ['imballaggi-alimentari', 'novaservice'] },
        { name: 'Packaging alimentare', items: ['Imballaggi per alimenti', 'Contenitori in plastica', 'Confezioni regalo'], brands: ['imballaggi-alimentari'] },
        { name: 'Buste e sacchi', items: ['Buste e sacchetti', 'Imballaggi compostabili', 'Sacchi per rifiuti'], brands: ['siam', 'cuki'] },
        { name: 'Magazzino', items: ['Film estensibile', 'Reggette', 'Nastri adesivi'], brands: ['siam'] }
      ]
    }
  ],
  brands: [
    { id: 'bettari', logo: 'assets/brands/bettari.png', name: 'Bettari', full: 'Bettari Detergenti S.r.l.', place: 'Poncarale (BS)', since: '1963', lines: ['detergenza'],
      text: 'Detergenza professionale italiana con le linee Tecnet, Solaris, Enerfor, Poket e GEA Ecolabel, per ristorazione, ambienti e lavanderia.',
      tags: ['Lavastoviglie', 'Sgrassanti', 'Ambienti', 'Ecolabel', 'Lavanderia', 'PMC'] },
    { id: 'christeyns', logo: 'assets/brands/christeyns.png', name: 'Christeyns', full: 'Christeyns Italia S.r.l.', place: 'Pessano con Bornago (MI)', since: 'Gruppo belga', lines: ['detergenza', 'attrezzature'],
      text: 'Gruppo internazionale dell’igiene professionale: detergenti, sistemi di dosaggio e monitoraggio per cucine, lavanderie e pulizia degli ambienti.',
      tags: ['Lavaggio stoviglie', 'Lavanderia', 'Dosaggio', 'Hotel e ristoranti'] },
    { id: 'foscart', logo: 'assets/brands/foscart.svg', name: 'Foscart', full: 'Foscart S.r.l.', place: 'Bassano del Grappa (VI)', since: 'Tissue', lines: ['carta'],
      text: 'Produzione di articoli igienico-sanitari e per uso domestico in carta e ovatta di cellulosa.',
      tags: ['Carta igienica', 'Asciugamani', 'Bobine'] },
    { id: 'okay', logo: 'assets/brands/okay.png', name: 'Okay', full: 'Okay S.r.l. — Manifattura Carta', place: 'Talamona (SO)', since: '1969', lines: ['carta', 'food'],
      text: 'Manifattura italiana della tavola in carta: tovaglioli, tovaglie, tovagliette e runner in carta, ovatta e airlaid, anche personalizzati.',
      tags: ['Tovaglioli', 'Tovaglie', 'Runner', 'Portaposate', 'Green'] },
    { id: 'leone', logo: 'assets/brands/leone.png', name: 'Leone', full: 'Leone S.r.l.', place: 'Lugo (RA)', since: 'Ho.Re.Ca.', lines: ['monouso', 'food'],
      text: 'Monouso e accessori per hotel, ristoranti e bar, con la linea compostabile Cuoreverde, gli accessori TopCatering e la linea cortesia.',
      tags: ['Cuoreverde', 'TopCatering', 'Finger food', 'Linea cortesia'] },
    { id: 'bibo', name: 'Bibo', full: 'Bibo Italia S.p.A.', place: 'Stoviglie monouso', since: '50+ anni', lines: ['monouso', 'food'],
      text: 'Storico marchio italiano di stoviglie monouso, con la linea Natural Bibo compostabile certificata EN 13432.',
      tags: ['Piatti', 'Bicchieri', 'Posate', 'Natural Bibo'] },
    { id: 'cuki', logo: 'assets/brands/cuki.png', name: 'Cuki Cofresco', full: 'Cuki Cofresco S.r.l.', place: 'Volpiano (TO)', since: 'Cuki Professional', lines: ['food', 'imballaggi'],
      text: 'Riferimento italiano nella conservazione degli alimenti. Con Cuki Professional: contenitori in alluminio, plastica e cartone per Ho.Re.Ca. e industria alimentare.',
      tags: ['Alluminio', 'Smoothwall', 'Film', 'Sacchi'] },
    { id: 'novaservice', logo: 'assets/brands/novaservice.svg', name: 'Novaservice', full: 'Novaservice S.r.l. — Gruppo Novacart', place: 'Ciampino (RM)', since: 'Gruppo Novacart', lines: ['imballaggi', 'food'],
      text: 'Distribuzione degli articoli in carta per uso alimentare del gruppo Novacart, riferimento internazionale per la pasticceria.',
      tags: ['Pirottini', 'Stampi da forno', 'Vassoi', 'Pizzi'] },
    { id: 'imballaggi-alimentari', name: 'Imballaggi Alimentari', full: 'Imballaggi Alimentari S.r.l.', place: 'Sinalunga (SI)', since: '1997', lines: ['imballaggi'],
      text: 'Packaging per alimenti, non-food e regalo, con una lunga esperienza nelle scatole per pasticceria.',
      tags: ['Scatole torte', 'Packaging food', 'Regalo'] },
    { id: 'siam', logo: 'assets/brands/siam.png', name: 'Siam', full: 'Siam S.r.l.', place: 'Guanti · Imballaggio', since: 'Monouso', lines: ['monouso', 'imballaggi'],
      text: 'Guanti, imballaggi anche compostabili, monouso e articoli tecnici come nastri adesivi e colle.',
      tags: ['Guanti', 'Imballaggio bio', 'Nastri', 'Party'] }
  ]
};
