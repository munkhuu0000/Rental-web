const features = [
  {
    title: "Үнэ ба материалын хяналт",
    copy: "Contract rate бүрийг төвлөрүүлж project бүрийн нөхцөлийг хурдан сэргээнэ.",
  },
  {
    title: "Төлөвтэй ажлын мөр",
    copy: "Draft, active, confirmed, paid зэрэг статусууд ажлын дарааллыг тодорхой болгоно.",
  },
  {
    title: "Тооцооны логик ил",
    copy: "Usage days, subtotal, tax, total нь settlement дээр ойлгомжтой сууна.",
  },
  {
    title: "Хүлээлцлийн баримт бэлэн",
    copy: "Act title, sign-off, prepared by, checked by зэрэг талбарууд гарын үсгийн процессыг дэмжинэ.",
  },
  {
    title: "Хэн юу хийснийг ялгана",
    copy: "Owner, renter, finance, site team бүр өөрт хамаарах мэдээллээ цэвэр харна.",
  },
  {
    title: "MVP-с өсөх суурь",
    copy: "Dashboard, analytics, approval layer нэмэхэд энэ visual system саад болохгүй.",
  },
];

export function FeatureGrid() {
  return (
    <section className="section-frame rounded-[2rem] px-5 py-6 md:px-8 md:py-8">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-4">
          <p className="section-label">Feature Story</p>
          <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
            MVP хэрнээ enterprise өнгө аястай.
          </h2>
          <p className="section-copy">
            Swiss-modern бүтэц, earthy palette, strong CTA хосолсноор сайт нь
            барилгын салбарын итгэлцэлтэй атлаа хэт хуурай биш харагдана.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="panel rounded-[1.5rem] p-5 transition-colors duration-200 hover:bg-white/90"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Block 0{index + 1}
              </p>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.04em]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {feature.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
