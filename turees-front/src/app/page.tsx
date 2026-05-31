import Link from "next/link";

const cards = [
  ["wide", "dark", "Business Skyrocketing With", "Digital Marketing"],
  ["side", "light", "Stay Connected With", "Your Loved Ones"],
  ["wide", "phone", "Stay Connected With", "Your Loved Ones"],
  ["side", "photo", "Scale new heights, With", "Social Climb"],
  ["wide", "form", "Scale new heights, With", "Social Climb"],
  ["side", "dark", "Business Shapes With", "Digital Growth"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#dfffd7_0%,#d9f8ea_48%,#d7f2ff_100%)] text-[#071111]">
      <section className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 gap-10 px-10 py-14 lg:grid-cols-[0.76fr_1.24fr]">
        <div className="flex min-h-[620px] flex-col justify-between">
          <div>
            <div className="flex items-center gap-6">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#7de85e] text-5xl font-black">
                Т
              </div>
              <div className="text-[44px] font-black tracking-[0.02em]">
                Түрээс
              </div>
            </div>
            <h1 className="mt-14 max-w-[540px] text-[34px] font-semibold leading-[1.25] md:text-[42px]">
              Түрээсийн тооцоог илүү хялбараар
            </h1>
            <div className="mt-16 space-y-8">
              {[
                ["Built with", "Bootstrap 5"],
                ["5+ Responsive", "Home Styles"],
                ["Responsive", "Home Styles"],
              ].map(([base, bold]) => (
                <div key={base + bold} className="flex items-center gap-6">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#74dc62]">
                    <span className="h-2 w-2 rounded-full bg-[#74dc62]" />
                  </span>
                  <p className="text-[30px] leading-none">
                    {base} <span className="font-bold">{bold}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <>
            <div className="relative flex h-[70px] w-fit items-center justify-center gap-8 overflow-hidden rounded-xl bg-white px-6">
              <div className="absolute -left-[20%] bottom-0 top-0 w-[70%] -skew-x-[18deg] bg-[#8dbb82]" />
              <div className="absolute left-[50%] h-[100px] w-[2px] -skew-x-[18deg] bg-gray-300" />
              <Link
                href="/sign-in?redirect_url=/dashboard"
                aria-label="Sign in"
                className="relative z-10 flex h-[54px] w-fit items-center justify-center rounded-full px-5 text-xl font-bold text-black"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/sign-up"
                aria-label="Sign up"
                className="relative z-10 flex h-[54px] w-fit items-center justify-center rounded-xl  px-5 text-xl font-bold text-black"
              >
                Нэгдэх
              </Link>
            </div>
          </>
        </div>
        <div className="relative hidden min-h-[860px] lg:block">
          {[0, 2, 4].map((start, i) => (
            <div
              key={start}
              className="absolute left-0 grid w-full grid-cols-[1fr_0.46fr] gap-8"
              style={{ top: [0, 270, 610][i] }}
            >
              <TemplateCard card={cards[start]} />
              <TemplateCard card={cards[start + 1]} />
            </div>
          ))}
        </div>
        <div className="grid gap-5 lg:hidden">
          {cards.map((card) => (
            <TemplateCard key={card.join("-")} card={card} />
          ))}
        </div>
      </section>
    </main>
  );
}

function TemplateCard({ card }: { card: string[] }) {
  const [size, kind, line1, line2] = card;
  const dark = kind === "dark" || kind === "photo" || kind === "form";
  const shell = `${size === "wide" ? "h-[238px]" : "h-[318px]"} ${dark ? "bg-[#073b44] text-white" : "bg-white text-[#0a3b46]"}`;
  return (
    <article
      className={`relative overflow-hidden rounded-xl shadow-[0_16px_36px_rgba(6,60,63,0.08)] ${shell}`}
    >
      <div
        className={`absolute left-7 right-7 top-5 z-10 flex items-center justify-between text-[8px] ${dark ? "text-white/70" : "text-[#6d858a]"}`}
      >
        <span className="font-bold text-[#73df5f]">Түрээс</span>
        <div className="flex gap-6">
          <span className="text-[#70df5c]">Home</span>
          <span>About</span>
        </div>
      </div>
      {kind === "dark" && <DarkCard line1={line1} line2={line2} />}
      {kind === "light" && <LightCard line1={line1} line2={line2} />}
      {kind === "phone" && <PhoneCard line1={line1} line2={line2} />}
      {(kind === "photo" || kind === "form") && (
        <PhotoCard line1={line1} line2={line2} form={kind === "form"} />
      )}
    </article>
  );
}

function DarkCard({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-10 text-center">
      <h2 className="text-[26px] font-bold leading-tight">
        {line1}
        <br />
        <span className="text-[#74e45e]">{line2}</span>
      </h2>
      <p className="mt-4 max-w-[440px] text-[9px] leading-4 text-white/45">
        Feugiat primis ligula risus auctor egestas and mauris viverra tortor
        undo iaculis feugiat magna.
      </p>
      <div className="mt-5 flex items-center gap-4">
        <button className="h-8 rounded bg-[#76e45e] px-5 text-[10px] font-bold text-[#06363d]">
          Registration
        </button>
        <span className="text-[10px] text-white/72">See How It Work!</span>
      </div>
    </div>
  );
}

function LightCard({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="px-8 pt-20">
      <span className="rounded bg-[#e7f7ef] px-2 py-1 text-[9px] font-bold text-[#0b6d55]">
        NEW
      </span>
      <h3 className="mt-4 text-[25px] font-bold leading-tight">
        {line1}
        <br />
        <span className="text-[#71d85e]">{line2}</span>
      </h3>
      <p className="mt-4 max-w-[240px] text-[9px] leading-4 text-[#8fa0a3]">
        With our app, you get fast message and calling for free.
      </p>
      <StoreBadges />
    </div>
  );
}

function PhoneCard({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="grid h-full grid-cols-[1fr_0.62fr] items-center px-8 pt-8">
      <div>
        <span className="rounded bg-[#e7f7ef] px-2 py-1 text-[9px] font-bold text-[#0b6d55]">
          NEW
        </span>
        <h3 className="mt-4 text-[26px] font-bold leading-tight">
          {line1}
          <br />
          <span className="text-[#71d85e]">{line2}</span>
        </h3>
        <StoreBadges />
      </div>
      <div className="mx-auto flex h-[230px] w-[112px] flex-col rounded-[28px] border-[7px] border-[#162124] bg-[#073b44] p-4 text-white">
        <p className="text-[8px] font-bold text-[#9be887]">Түрээс</p>
        <p className="mt-9 text-center text-sm font-bold leading-tight">
          Business Skyrocketing With{" "}
          <span className="text-[#74e45e]">Digital Marketing</span>
        </p>
        <span className="mt-auto h-7 rounded bg-[#76e45e]" />
      </div>
    </div>
  );
}

function PhotoCard({
  line1,
  line2,
  form,
}: {
  line1: string;
  line2: string;
  form: boolean;
}) {
  return (
    <div className="h-full bg-[linear-gradient(90deg,rgba(7,59,68,0.94),rgba(7,59,68,0.62)),radial-gradient(circle_at_80%_50%,#9ca9a3_0%,#315b5b_34%,#073b44_70%)] px-8 pt-24">
      <h3 className="max-w-[320px] text-[27px] font-bold leading-tight">
        {line1}
        <br />
        <span className="text-[#73e35e]">{line2}</span>
      </h3>
      <p className="mt-3 max-w-[300px] text-[9px] leading-4 text-white/55">
        Wished he entire esteem mr oh by possible body disposal plan.
      </p>
      {form && (
        <div className="absolute bottom-0 right-12 h-[190px] w-[170px] rounded-t-2xl bg-white p-5 text-[#173236]">
          <p className="text-center text-[10px] font-bold">
            Get 30 day FREE trial
          </p>
          <div className="mt-5 space-y-3">
            {["First Name", "Last Name", "Email"].map((x) => (
              <span
                key={x}
                className="block border-b border-[#dfe7e7] pb-2 text-[9px] text-[#9aaaad]"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StoreBadges() {
  return (
    <div className="mt-5 flex gap-2">
      {["Google Play", "App Store"].map((x) => (
        <span
          key={x}
          className="rounded bg-black px-3 py-1.5 text-[9px] font-bold text-white"
        >
          {x}
        </span>
      ))}
    </div>
  );
}
