const brands = [
  { name: 'Volkswagen', file: 'volkswagen.svg', size: 'symbol' },
  { name: 'KFC', file: 'kfc.svg', size: 'compact' },
  { name: "McDonald's", file: 'mcdonalds.svg', size: 'symbol' },
  { name: 'Cheetos', file: 'cheetos.svg' },
  { name: 'Heinz', file: 'heinz.svg' },
  { name: 'Xiaomi', file: 'xiaomi.svg', size: 'symbol' },
  { name: 'BBVA', file: 'bbva.svg' },
  { name: 'Danone', file: 'danone.svg' },
  { name: 'Alcatel', file: 'alcatel.svg' },
  { name: 'Jumex', file: 'jumex.svg' },
  { name: 'Mercado Libre', file: 'mercado-libre.svg', size: 'compact' },
  { name: 'Colgate-Palmolive', file: 'colgate-palmolive.svg', size: 'wide' },
  { name: 'Indurama', file: 'indurama.png', size: 'compact' },
  { name: 'Movistar', file: 'movistar.svg' },
  { name: 'Kellogg’s', file: 'kelloggs.svg' },
  { name: 'Pringles', file: 'pringles.svg', size: 'compact' },
  { name: 'Chevrolet', file: 'chevrolet.svg' },
  { name: 'Carrefour', file: 'carrefour.svg', size: 'compact' },
];

export function BrandLogos() {
  return (
    <section aria-labelledby="brands-title" className="brand-section px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-10 md:mb-14 font-mono text-[10px] md:text-xs uppercase tracking-widest">
          <h2 id="brands-title" className="text-zinc-400">// Brands I've worked with</h2>
          <span aria-hidden="true" className="text-zinc-500 shrink-0">[ {brands.length} brands ]</span>
        </div>
        <ul className="brand-logo-grid" aria-label="Selected brands">
          {brands.map(brand => (
            <li key={brand.name} className="brand-logo-cell" tabIndex={0}>
              <img src={`/brands/${brand.file}`} alt={brand.name} loading="lazy" decoding="async"
                width={180} height={72} className={`brand-logo brand-logo--${brand.size || 'wordmark'}`} />
              <span className="brand-logo-label" aria-hidden="true">{brand.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
