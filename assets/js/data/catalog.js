/* ==========================================================================
   WOODORA — Catalog data
   Single source of truth for products, collections, rooms and imagery.
   Swap the Unsplash IDs in IMG for final campaign photography when ready.
   ========================================================================== */
(function (WD) {
  'use strict';

  /** Build an optimised Unsplash URL. */
  const u = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w || 1400}`;

  /* Image library — warm, natural, Scandinavian-leaning interiors */
  const IMG = {
    heroLiving:      '1618221195710-dd6b41faaea6',
    warmBedroom:     '1615874959474-d609969a20ed',
    consoleLiving:   '1616046229478-9901c5536a45',
    oakDining:       '1577140917170-285929fb55b7',
    sculptChair:     '1549497538-303791108f95',
    linenBedroom:    '1617098900591-3f90928e8c54',
    floatCabinet:    '1595515106969-1ce29566ff1c',
    tallLiving:      '1618220179428-22790b461013',
    leatherSofa:     '1589834390005-5d4fb9bf3d32',
    mirrorConsole:   '1618219908412-a29a1bb7b86e',
    walnutWardrobe:  '1558997519-83ea9252edf8',
    bohoLiving:      '1617103996702-96ff29b1c467',
    whiteChair:      '1581539250439-c96689b516dd',
    oakConsole:      '1532372320572-cda25653a26d',
    balconySofa:     '1616593969747-4797dc75033e',
    pendantLiving:   '1615529182904-14819c35db37',
    moodyLiving:     '1599696848652-f0ff23bc911f',
    neutralLiving:   '1616486338812-3dadae4b4ace',
    softLiving:      '1631679706909-1844bbd07221',
    bedroomWood:     '1540518614846-7eded433c457',
    lightLiving:     '1556228453-efd6c1ff04f6',
    diningLight:     '1544457070-4cd773b4d71e',
    bedroomConsole:  '1556020685-ae41abfc9365',
    gridLiving:      '1600210492486-724fe5c67fb0',
    minimalBedroom:  '1586105251261-72a756497a11',
    woodDining:      '1604578762246-41134e37f9cc',
    shelfCabinet:    '1595428774223-ef52624120d2',
    bedroomGrey:     '1631049307264-da0ec9d70304',
    coffeeTable:     '1583847268964-b28dc8f51f92',
    loungeChair:     '1611967164521-abae8fba4668',
    tanSofa:         '1550581190-9c1c48d21d6c',
    beigeSofa:       '1512212621149-107ffe572d2f',
    bedside:         '1522771739844-6a9f6d5f14af',
    bedroomCalm:     '1505693416388-ac5ce068fe85',
    woodDesk:        '1597072689227-8882273e8f6a'
  };

  const FINISHES = {
    natural: { name: 'Natural Oak', swatch: '#C9A57B' },
    smoked:  { name: 'Smoked Oak',  swatch: '#7A5A3E' },
    walnut:  { name: 'Walnut',      swatch: '#5B3F2C' },
    ivory:   { name: 'Ivory Linen', swatch: '#EDE6DA' },
    sand:    { name: 'Sand Bouclé', swatch: '#D9CBB6' },
    umber:   { name: 'Umber Leather', swatch: '#8A5A3B' }
  };

  const ROOMS = {
    living:  { slug: 'living',  title: 'Living Room', image: IMG.neutralLiving },
    bedroom: { slug: 'bedroom', title: 'Bedroom',     image: IMG.bedroomCalm },
    dining:  { slug: 'dining',  title: 'Dining',      image: IMG.diningLight },
    storage: { slug: 'storage', title: 'Storage',     image: IMG.floatCabinet }
  };

  /* Seven collections — their letters spell W·O·O·D·O·R·A */
  const COLLECTIONS = [
    { slug: 'warm-living',     letter: 'W', title: 'Warm Living',     image: IMG.bohoLiving,
      description: 'Layered woods, soft textiles and low silhouettes for living rooms that hold the evening light.' },
    { slug: 'organic-forms',   letter: 'O', title: 'Organic Forms',   image: IMG.whiteChair,
      description: 'Curved, sculptural pieces shaped by hand. Softer edges that make a room feel calm and human.' },
    { slug: 'oak-timber',      letter: 'O', title: 'Oak & Timber',    image: IMG.oakConsole,
      description: 'Solid European oak and walnut, joined the traditional way and finished to age beautifully.' },
    { slug: 'daily-comfort',   letter: 'D', title: 'Daily Comfort',   image: IMG.balconySofa,
      description: 'Deep seats and forgiving fabrics designed for real routines, lazy Sundays and long conversations.' },
    { slug: 'open-spaces',     letter: 'O', title: 'Open Spaces',     image: IMG.pendantLiving,
      description: 'Modular, light-footed furniture that defines zones without closing a room in.' },
    { slug: 'refined-bedroom', letter: 'R', title: 'Refined Bedroom', image: IMG.linenBedroom,
      description: 'Quiet beds, bedside cabinets and wardrobes in muted tones for rooms that help you slow down.' },
    { slug: 'artful-details',  letter: 'A', title: 'Artful Details',  image: IMG.consoleLiving,
      description: 'Consoles, side pieces and objects that finish a space with character and restraint.' }
  ];

  /* Products — prices are placeholder USD */
  const PRODUCTS = [
    {
      id: 'sculptural-oak-coffee-table', name: 'Sculptural Oak Coffee Table', category: 'Coffee Table', room: 'living',
      collections: ['oak-timber', 'artful-details', 'warm-living'], letter: 't',
      images: [IMG.coffeeTable, IMG.softLiving, IMG.neutralLiving],
      finishes: { natural: 1290, smoked: 1390, walnut: 1560 },
      sizes: null,
      description: 'A low, softly carved table turned from solid oak. Its rounded base and generous top make it the quiet centre of a living room.',
      dimensions: 'W 110 × D 70 × H 36 cm', materials: 'Solid European oak, hard-wax oil finish', leadTime: '4–6 weeks'
    },
    {
      id: 'contemporary-lounge-chair', name: 'Contemporary Lounge Chair', category: 'Lounge Chair', room: 'living',
      collections: ['daily-comfort', 'organic-forms'], letter: 'c',
      images: [IMG.loungeChair, IMG.balconySofa, IMG.whiteChair],
      finishes: { ivory: 1450, sand: 1520, umber: 1780 },
      sizes: null,
      description: 'A wide, low lounge chair with a cocooning back and plush seat. Upholstered in natural fabrics over a hidden oak frame.',
      dimensions: 'W 82 × D 86 × H 74 cm', materials: 'Oak frame, high-resilience foam, removable cover', leadTime: '6–8 weeks'
    },
    {
      id: 'modular-living-room-sofa', name: 'Modular Living Room Sofa', category: 'Sofa', room: 'living',
      collections: ['warm-living', 'daily-comfort', 'open-spaces'], letter: 's',
      images: [IMG.tanSofa, IMG.beigeSofa, IMG.leatherSofa],
      finishes: { umber: 5640, sand: 4890, ivory: 4890 },
      sizes: { '3 Seater': 0, '4 Seater': 980, 'Corner': 1650 },
      description: 'Deep modular seating that grows with your space. Rearrange modules into a sofa, corner or chaise in minutes.',
      dimensions: 'W 240 × D 98 × H 72 cm (3 seater)', materials: 'Kiln-dried timber frame, feather-wrapped cushions', leadTime: '8–10 weeks'
    },
    {
      id: 'minimal-bedside-cabinet', name: 'Minimal Bedside Cabinet', category: 'Bedside Table', room: 'bedroom',
      collections: ['refined-bedroom'], letter: 'b',
      images: [IMG.bedside, IMG.bedroomGrey, IMG.minimalBedroom],
      finishes: { natural: 640, smoked: 690, walnut: 760 },
      sizes: null,
      description: 'A compact cabinet with a single soft-close drawer and an open shelf. Simple, useful, made to sit quietly beside the bed.',
      dimensions: 'W 45 × D 38 × H 52 cm', materials: 'Solid oak, oak veneer, push-to-open drawer', leadTime: '3–5 weeks'
    },
    {
      id: 'solid-wood-dining-table', name: 'Solid Wood Dining Table', category: 'Dining Table', room: 'dining',
      collections: ['oak-timber', 'open-spaces'], letter: 'd',
      images: [IMG.oakDining, IMG.woodDining, IMG.diningLight],
      finishes: { natural: 2980, smoked: 3180, walnut: 3640 },
      sizes: { '6 Seats': 0, '8 Seats': 620, '10 Seats': 1240 },
      description: 'A generous table built from wide solid planks with softly bevelled edges. Made for long dinners and everyday gatherings.',
      dimensions: 'W 200 × D 95 × H 75 cm (6 seats)', materials: 'Solid oak or walnut, natural oil finish', leadTime: '6–8 weeks'
    },
    {
      id: 'modern-storage-cabinet', name: 'Modern Storage Cabinet', category: 'Cabinet', room: 'storage',
      collections: ['oak-timber', 'artful-details'], letter: 's',
      images: [IMG.shelfCabinet, IMG.floatCabinet, IMG.woodDesk],
      finishes: { natural: 2150, smoked: 2290, walnut: 2560 },
      sizes: null,
      description: 'Tall open-and-closed storage with fluted doors and adjustable shelves. Displays what you love and hides the rest.',
      dimensions: 'W 90 × D 42 × H 190 cm', materials: 'Oak veneer on FSC board, solid oak fronts', leadTime: '5–7 weeks'
    },
    {
      id: 'walnut-wardrobe', name: 'Walnut Wardrobe', category: 'Wardrobe', room: 'bedroom',
      collections: ['refined-bedroom', 'oak-timber'], letter: 'w',
      images: [IMG.walnutWardrobe, IMG.bedroomWood, IMG.bedroomConsole],
      finishes: { walnut: 3620, natural: 3240, smoked: 3420 },
      sizes: null,
      description: 'A two-door wardrobe with a hanging rail and inner drawers, finished in rich walnut with recessed handles.',
      dimensions: 'W 120 × D 60 × H 210 cm', materials: 'Walnut veneer, solid walnut edges', leadTime: '8–10 weeks'
    },
    {
      id: 'sculptural-dining-chair', name: 'Sculptural Dining Chair', category: 'Dining Chair', room: 'dining',
      collections: ['organic-forms', 'artful-details'], letter: 'c',
      images: [IMG.sculptChair, IMG.oakDining, IMG.woodDining],
      finishes: { natural: 520, smoked: 560, walnut: 610 },
      sizes: null,
      description: 'A sculpted solid-wood chair with a gently curved back rail. Comfortable for long meals, striking on its own.',
      dimensions: 'W 48 × D 52 × H 78 cm', materials: 'Solid oak or walnut', leadTime: '4–6 weeks'
    },
    {
      id: 'floating-oak-sideboard', name: 'Floating Oak Sideboard', category: 'Sideboard', room: 'storage',
      collections: ['open-spaces'], letter: 'f',
      images: [IMG.floatCabinet, IMG.shelfCabinet, IMG.consoleLiving],
      finishes: { natural: 1780, smoked: 1890, walnut: 2140 },
      sizes: null,
      description: 'A wall-mounted sideboard that keeps floors clear and lines clean. Two drawers and a cable-ready compartment.',
      dimensions: 'W 160 × D 40 × H 45 cm', materials: 'Oak veneer, solid oak drawer fronts', leadTime: '4–6 weeks'
    },
    {
      id: 'linen-platform-bed', name: 'Linen Platform Bed', category: 'Bed', room: 'bedroom',
      collections: ['refined-bedroom', 'daily-comfort'], letter: 'l',
      images: [IMG.linenBedroom, IMG.warmBedroom, IMG.bedroomCalm],
      finishes: { ivory: 3240, sand: 3240, umber: 3680 },
      sizes: { 'Queen': 0, 'King': 420 },
      description: 'A low platform bed with a padded linen headboard and a solid oak base. Restful, grounded and quietly elegant.',
      dimensions: 'W 176 × L 218 × H 95 cm (Queen)', materials: 'Oak base, linen upholstery', leadTime: '6–8 weeks'
    },
    {
      id: 'oak-console-table', name: 'Oak Console Table', category: 'Console', room: 'living',
      collections: ['warm-living', 'artful-details'], letter: 'o',
      images: [IMG.oakConsole, IMG.mirrorConsole, IMG.consoleLiving],
      finishes: { natural: 980, smoked: 1040, walnut: 1190 },
      sizes: null,
      description: 'A slim console with a sculpted lower shelf. Ideal for entryways, behind a sofa or as a styling surface.',
      dimensions: 'W 120 × D 35 × H 80 cm', materials: 'Solid oak', leadTime: '3–5 weeks'
    },
    {
      id: 'curved-armchair', name: 'Curved Armchair', category: 'Armchair', room: 'living',
      collections: ['organic-forms', 'daily-comfort'], letter: 'a',
      images: [IMG.whiteChair, IMG.loungeChair, IMG.tallLiving],
      finishes: { ivory: 1120, sand: 1180, umber: 1390 },
      sizes: null,
      description: 'An enveloping shell chair with a single continuous curve. Light enough to move, comfortable enough to stay.',
      dimensions: 'W 72 × D 70 × H 76 cm', materials: 'Moulded shell, oak legs, bouclé upholstery', leadTime: '5–7 weeks'
    }
  ];

  /* Selected products for the home page (in display order) */
  const SELECTED = [
    'sculptural-oak-coffee-table',
    'contemporary-lounge-chair',
    'modular-living-room-sofa',
    'minimal-bedside-cabinet',
    'solid-wood-dining-table',
    'modern-storage-cabinet'
  ];

  const SERVICES = [
    { title: 'Furniture Consultation', image: IMG.pendantLiving },
    { title: 'Custom Furniture',       image: IMG.walnutWardrobe },
    { title: 'Interior Styling',       image: IMG.consoleLiving },
    { title: 'Living Room Furniture',  image: IMG.gridLiving },
    { title: 'Bedroom Furniture',      image: IMG.minimalBedroom },
    { title: 'Dining Furniture',       image: IMG.woodDining },
    { title: 'Storage Solutions',      image: IMG.shelfCabinet },
    { title: 'Material Selection',     image: IMG.oakConsole },
    { title: 'Delivery & Installation', image: IMG.bedroomGrey }
  ];

  const GALLERY = [
    IMG.neutralLiving, IMG.warmBedroom, IMG.sculptChair, IMG.woodDining, IMG.softLiving,
    IMG.bedroomWood, IMG.floatCabinet, IMG.lightLiving, IMG.diningLight, IMG.bedroomConsole
  ];

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  const money = (n) => '$' + Number(n).toLocaleString('en-US');

  function priceRange(p) {
    const base = Object.values(p.finishes);
    const sizeAdd = p.sizes ? Object.values(p.sizes) : [0];
    const min = Math.min(...base) + Math.min(...sizeAdd);
    const max = Math.max(...base) + Math.max(...sizeAdd);
    return min === max ? money(min) : `${money(min)} – ${money(max)}`;
  }

  function getProduct(id) { return PRODUCTS.find((p) => p.id === id); }
  function getCollection(slug) { return COLLECTIONS.find((c) => c.slug === slug); }

  WD.data = {
    img: u, IMG, FINISHES, ROOMS, COLLECTIONS, PRODUCTS, SELECTED, SERVICES, GALLERY,
    money, priceRange, getProduct, getCollection
  };
})(window.WD = window.WD || {});
