import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SoundtrackProvider, useSoundtrack } from "@/lib/audio";
import { Reveal } from "@/components/Reveal";
import { MemoryVideo } from "@/components/MemoryVideo";
import { Terminal } from "@/components/Terminal";
import { AmbientBreath } from "@/components/AmbientBreath";
import { ThingsIMiss } from "@/components/ThingsIMiss";
import { PhoneDownGate } from "@/components/PhoneDownGate";
import { GoBack } from "@/components/GoBack";

const v5 = { url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VID-20260905-WA0015-IrEr2QWpnKdw1F7SUhAZjwvOTkV2tX.mp4" };
const v6 = { url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VID-20260905-WA0013-gcV1tSrT1Re1DEOAbW4DS1EFFHtpwD.mp4" };
const v7 = { url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VID-20260905-WA0014-GX1g7LzW73QFarjnywUqG8YIbZxZuo.mp4" };
const v8 = { url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VID-20260905-WA0016-HIpe4kA9vEVjoVRMRErkcbbzlmwgJ0.mp4" };
import p5 from "@/assets/memory-5-poster.jpg.asset.json";
import p6 from "@/assets/memory-6-poster.jpg.asset.json";
import p7 from "@/assets/memory-7-poster.jpg.asset.json";
import p8 from "@/assets/memory-8-poster.jpg.asset.json";

const CALL_LINK = "tel:+2348114403035";
const WHATSAPP_MESSAGE = "Hey Josiah. I read all of it. Can we talk?";
const MESSAGE_LINK = `https://wa.me/2349044162184?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For Zipporah — I need you to let me say this" },
      {
        name: "description",
        content:
          "A private letter from Josiah to Zipporah: an apology, a few real memories, and one question.",
      },
      { property: "og:title", content: "For Zipporah" },
      {
        property: "og:description",
        content: "A private letter from Josiah — an apology, a few real memories, and one question.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SoundtrackProvider>
      <Experience />
    </SoundtrackProvider>
  );
}

function Experience() {
  const { start, started } = useSoundtrack();
  const [entered, setEntered] = useState(false);
  const [cinema, setCinema] = useState(false);

  useEffect(() => {
    if (cinema) return;
    document.documentElement.style.overflow = entered ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [entered, cinema]);

  const onCinema = useCallback((on: boolean) => setCinema(on), []);

  return (
    <>
      <AmbientBreath />
      <Intro
        entered={entered}
        onEnter={() => {
          start();
          setEntered(true);
        }}
      />
      <main
        aria-hidden={!entered}
        className="relative z-10 mx-auto w-full max-w-[1100px] px-6 sm:px-10"
        style={{
          opacity: entered ? 1 : 0,
          filter: entered ? "blur(0px)" : "blur(26px)",
          transform: entered ? "scale(1)" : "scale(1.03)",
          transition:
            "opacity 1.6s var(--ease-cine), filter 1.8s var(--ease-cine), transform 1.8s var(--ease-cine)",
        }}
      >
        <Letter onCinema={onCinema} />
      </main>
      {started && !cinema && <MusicControl />}
    </>
  );
}

function Intro({ entered, onEnter }: { entered: boolean; onEnter: () => void }) {
  const btn = useRef<HTMLButtonElement | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    btn.current?.focus();
    const id = window.setTimeout(() => setFocused(true), 700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      aria-hidden={entered}
      className="fixed inset-0 z-50 grid place-items-center bg-[color:var(--void-deep)] px-6"
      style={{
        opacity: entered ? 0 : 1,
        pointerEvents: entered ? "none" : "auto",
        transition: "opacity 1.5s var(--ease-cine)",
      }}
    >
      <div
        className="w-full max-w-xl text-center"
        style={{
          filter: focused ? "blur(0px)" : "blur(24px)",
          opacity: focused ? 1 : 0.6,
          transform: focused ? "scale(1)" : "scale(1.03)",
          transition:
            "filter 2s var(--ease-cine), opacity 2s var(--ease-cine), transform 2s var(--ease-cine)",
        }}
      >
        <h1 className="display-xl text-[color:var(--ink)]">Hey, you.</h1>
        <p className="prose-line mx-auto mt-6 max-w-md">
          Before you go any further, I need you to let me say this.
        </p>
        <button ref={btn} type="button" onClick={onEnter} className="quiet-btn mt-12">
          Enter
        </button>
      </div>
    </div>
  );
}

function MusicControl() {
  const { muted, toggleMute } = useSoundtrack();
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute music" : "Mute music"}
      className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-[color:var(--hairline)] bg-black/45 text-[color:var(--ink)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/10 sm:bottom-8 sm:right-8"
    >
      {muted ? (
        <VolumeX className="h-[18px] w-[18px]" strokeWidth={1.5} />
      ) : (
        <Volume2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
      )}
    </button>
  );
}

function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Reveal as="p" className="prose-line" delay={delay}>
      {children}
    </Reveal>
  );
}

function Beat() {
  return <div className="h-[16vh] sm:h-[22vh]" aria-hidden />;
}

function Letter({ onCinema }: { onCinema: (on: boolean) => void }) {
  return (
    <>
      <section className="flex min-h-[92svh] flex-col justify-center py-24">
        <Reveal>
          <p className="whisper">A letter</p>
          <h2 className="display-lg mt-6 max-w-[16ch]">Let me start with the part I own.</h2>
        </Reveal>
        <div className="mt-12 max-w-[38ch] space-y-7 sm:max-w-[46ch]">
          <Line>I was the one who ended us.</Line>
          <Line delay={80}>
            You didn&apos;t leave me. You didn&apos;t decide we weren&apos;t worth it. You didn&apos;t
            stop caring.
          </Line>
          <Line delay={160}>I made that decision. And I need to own that.</Line>
        </div>
      </section>

      <section className="max-w-[42ch] space-y-8 py-[12vh] sm:max-w-[50ch]">
        <Line>
          The reason I gave myself was distance. Being apart felt difficult, and I convinced myself
          that difficult meant impossible.
        </Line>
        <Line>
          I know now those aren&apos;t the same thing. Distance is hard. Missing you is hard. Not
          being able to see you whenever I wanted is hard. But I treated difficulty like a
          conclusion.
        </Line>
        <Reveal as="p" className="display-lg pt-6">
          I was wrong, and I regret it deeply.
        </Reveal>
      </section>

      <Beat />

      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Reveal>
          <p className="whisper">After</p>
        </Reveal>
        <Line>
          After the breakup, I acted nonchalant and distant. It wasn&apos;t because I stopped
          caring. I didn&apos;t know how to be &ldquo;just friends&rdquo; with you.
        </Line>
        <Line>
          I thought that if I became distant enough, stopped talking as much, stopped looking for
          reasons to interact with you and acted like everything was normal, the feelings would
          eventually disappear.
        </Line>
        <Reveal as="p" className="display-lg py-6">
          They didn&apos;t.
        </Reveal>
        <Line>I was hurting quietly.</Line>
        <Line>
          My distance may have looked like indifference. It wasn&apos;t. I was distant because I
          cared too much and didn&apos;t know how to be around you without wanting you back.
        </Line>
      </section>

      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Line>I haven&apos;t been able to function properly without you in my life.</Line>
        <Line>
          I&apos;ve kept working, studying, building things, laughing, talking to people, doing
          everything I&apos;m supposed to do — and underneath all of it there&apos;s just emptiness,
          because you&apos;re not part of my days anymore.
        </Line>
        <div className="space-y-3 pt-4">
          <Reveal as="p" className="prose-line">
            I miss the conversations.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={120}>
            The random moments.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={240}>
            The things I&apos;d normally tell you.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={360}>
            Having you on the other side of my phone.
          </Reveal>
        </div>
        <Line>
          I didn&apos;t realise how much of my everyday life was you until I took you out of it.
        </Line>
        <Line>I don&apos;t want a life where I just get used to you not being in it.</Line>

        <div className="pt-10">
          <Reveal>
            <ThingsIMiss />
          </Reveal>
        </div>
      </section>

      <Beat />

      {/* WHAT YOU TAUGHT ME */}
      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Reveal>
          <p className="whisper">Something I never thanked you for properly</p>
        </Reveal>
        <Reveal as="p" className="display-lg">
          You taught me that I&apos;m nothing like my father.
        </Reveal>
        <Line>You taught me to stop looking down on myself.</Line>
        <Line delay={120}>To stop talking down to myself.</Line>
        <Line delay={240}>
          To stop shrinking myself and defining who I am by the things I&apos;ve been through.
        </Line>
        <Line>
          So when I think about what you gave me, it wasn&apos;t only love. You changed the way I
          see myself. You made me believe I could be better than the version of me I sometimes
          believed I was.
        </Line>
        <Line>And I don&apos;t know if you ever realised how much that meant to me.</Line>
      </section>

      <Beat />

      {/* MEMORIES */}
      <section className="py-[8vh]">
        <div className="max-w-[40ch] space-y-8">
          <Reveal>
            <p className="whisper">Our memories</p>
          </Reveal>
          <Reveal as="p" className="display-lg">
            Before I ask you for anything...
          </Reveal>
          <Reveal as="p" className="display-lg" delay={120}>
            I want you to remember us.
          </Reveal>
          <div className="space-y-2 pt-4">
            <Reveal as="p" className="prose-line">
              Not the breakup.
            </Reveal>
            <Reveal as="p" className="prose-line" delay={100}>
              Not the distance.
            </Reveal>
            <Reveal as="p" className="prose-line" delay={200}>
              Not the awkwardness afterward.
            </Reveal>
            <Reveal as="p" className="prose-line" delay={320}>
              Us.
            </Reveal>
          </div>
        </div>

        <Chapter caption="I remember this." src={v5.url} poster={p5.url} label="A memory of us" />

        <div className="mx-auto max-w-[40ch] py-[6vh]">
          <Line>
            I miss you. Not an imaginary version of you. You. Your voice, our conversations, the
            stupid little things that probably didn&apos;t seem important at the time.
          </Line>
        </div>

        <Chapter src={v6.url} poster={p6.url} label="A memory of us" caption="And this." />

        <div className="mx-auto max-w-[40ch] py-[6vh]">
          <Line>
            Laughing with you. Telling you random things and knowing you&apos;d get why I was
            telling you.
          </Line>
          <Reveal as="p" className="display-lg pt-8">
            I miss being us.
          </Reveal>
        </div>
      </section>

      <Beat />

      {/* THE UK / MASTER'S MEMORY */}
      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Reveal>
          <p className="whisper">One I keep coming back to</p>
        </Reveal>
        <Line>
          I still remember that conversation about what I wanted to do after university. I told you
          about my plan to get a scholarship and go straight to the UK for my master&apos;s. Then I
          told you I&apos;d changed my mind. That I&apos;d stay here, with you.
        </Line>
        <Line>You told me you didn&apos;t want me throwing my life away just for you.</Line>
        <Line delay={120}>
          And I told you I&apos;d throw whatever needed throwing without a second thought.
        </Line>
        <Line>
          Then you sent me that voice note. You told me how lucky you were to have me. You told me
          how much you loved me.
        </Line>
        <Reveal as="p" className="display-lg pt-4">
          I still listen to it.
        </Reveal>
        <Line delay={120}>Even now.</Line>
        <Line delay={240}>I listen to it and I smile.</Line>
        <Line delay={400}>And then I remember that I don&apos;t have you anymore.</Line>
      </section>

      <Beat />

      {/* PUT YOUR PHONE DOWN → cinematic memory */}
      <section className="py-[12vh]">
        <PhoneDownGate src={v7.url} poster={p7.url} label="A memory of us" onCinema={onCinema} />
      </section>

      <div className="mx-auto max-w-[40ch] space-y-7 py-[8vh]">
        <Line>I didn&apos;t know this would become a memory.</Line>
        <Line delay={160}>
          Funny how you don&apos;t realise you&apos;re living a memory until it&apos;s already one.
        </Line>
      </div>

      <Beat />

      {/* ACCOUNTABILITY */}
      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Reveal>
          <p className="whisper">What I own</p>
        </Reveal>
        <Line>I could make excuses. I don&apos;t want to. I made the decision. I own it.</Line>
        <Line>
          You didn&apos;t deserve to be left wondering whether you were worth the effort. You
          didn&apos;t deserve someone who loved you deciding that the circumstances were reason
          enough to walk away. And you didn&apos;t deserve me pretending afterwards that I was fine.
        </Line>
        <Reveal as="p" className="display-lg py-4">
          I&apos;m sorry. Genuinely sorry.
        </Reveal>
        <Line>
          Loving someone doesn&apos;t mean everything is always easy. Sometimes it means looking at
          something hard and asking:
        </Line>
        <Reveal as="p" className="display-lg">
          &ldquo;How do we figure this out?&rdquo;
        </Reveal>
        <Line>
          Instead I looked at the distance and decided the answer for both of us. I didn&apos;t give
          us the chance to figure it out together. That&apos;s what I regret.
        </Line>
        <Line>
          The problem wasn&apos;t that I stopped loving you. It&apos;s that I convinced myself love
          wasn&apos;t enough to make the hard parts worth facing.
        </Line>
      </section>

      <Beat />

      {/* YOU'RE STILL HERE */}
      <section className="flex min-h-[60svh] max-w-[40ch] flex-col justify-center gap-8 py-[10vh]">
        <Reveal as="p" className="display-lg">
          You&apos;re still here.
        </Reveal>
        <Reveal as="p" className="prose-line" delay={900}>
          Thank you for staying long enough to hear me out.
        </Reveal>
      </section>

      <Beat />

      {/* EASTER EGG */}
      <section className="py-[8vh]">
        <Reveal>
          <Terminal />
        </Reveal>
      </section>

      <Beat />

      {/* IF I COULD GO BACK */}
      <section className="py-[12vh]">
        <GoBack />
      </section>

      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <div className="space-y-3">
          <Reveal as="p" className="prose-line">
            I&apos;d talk to you.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={100}>
            I&apos;d tell you I was scared.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={200}>
            I&apos;d tell you the distance was getting to me.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={300}>
            I&apos;d tell you I didn&apos;t know how we&apos;d make it work.
          </Reveal>
        </div>
        <Line>And then I&apos;d ask how we could figure it out together, instead of ending it.</Line>
        <Line>I know I hurt you. I know an apology doesn&apos;t erase that.</Line>
        <Line>
          You may be angry. You may be confused. You may not trust me the same way. You may need
          time. You may not want the relationship anymore.
        </Line>
        <Line>
          I don&apos;t get to decide how you feel about what I did. I won&apos;t pressure you. I
          won&apos;t ask you to forget. I won&apos;t ask you to pretend nothing happened.
        </Line>
        <Line>I just needed you to know that I understand what I did, and that I regret it.</Line>
      </section>

      <Beat />

      {/* THE "US" TRANSITION */}
      <UsTransition />

      <FinalAsk />

      <footer className="flex min-h-[80svh] flex-col items-center justify-center gap-6 py-24 text-center">
        <Reveal as="p" className="whisper">
          Made with too much code, too many memories, and one very stupid decision.
        </Reveal>
        <Reveal as="p" className="display-lg" delay={200}>
          I&apos;m sorry, Zipporah.
        </Reveal>
        <Reveal as="p" className="prose-line" delay={340}>
          I really, really am.
        </Reveal>
        <Reveal as="p" className="whisper pt-8" delay={480}>
          — Josiah
        </Reveal>
        <StayLine />
      </footer>
    </>
  );
}

function UsTransition() {
  return (
    <section className="us-veil -mx-6 px-6 sm:-mx-10 sm:px-10">
      <div className="mx-auto flex min-h-[80svh] max-w-[38ch] flex-col justify-center gap-12 py-[14vh]">
        <Reveal as="p" className="prose-line">
          For a while, I thought I needed to get used to life without you.
        </Reveal>
        <Reveal as="p" className="display-lg" delay={1200}>
          I don&apos;t want to.
        </Reveal>
        <Reveal as="p" className="display-lg" delay={2400}>
          I want more moments like those.
        </Reveal>
      </div>

      <div className="py-[6vh]">
        <Reveal>
          <p className="whisper text-center">One last memory.</p>
        </Reveal>
        <Chapter src={v8.url} poster={p8.url} label="A memory of us" />
      </div>

      <div className="mx-auto flex min-h-[60svh] max-w-[38ch] flex-col justify-center gap-10 py-[10vh]">
        <Reveal as="p" className="display-xl">
          With you.
        </Reveal>
      </div>
    </section>
  );
}

function StayLine() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), 14000);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <p
      className="whisper pt-24 transition-opacity duration-[2500ms]"
      style={{ opacity: show ? 0.6 : 0 }}
    >
      You can stay here for a while.
    </p>
  );
}

function Chapter({
  src,
  poster,
  caption,
  label,
}: {
  src: string;
  poster: string;
  caption?: string;
  label: string;
}) {
  return (
    <figure className="mx-auto w-full max-w-[420px] py-[8vh] sm:max-w-[460px]">
      <Reveal>
        <MemoryVideo src={src} poster={poster} label={label} />
      </Reveal>
      {caption && (
        <Reveal as="p" className="whisper mt-6 text-center normal-case tracking-[0.02em]" delay={200}>
          <span className="prose-line">{caption}</span>
        </Reveal>
      )}
    </figure>
  );
}

function FinalAsk() {
  const [choice, setChoice] = useState<null | "talk" | "time">(null);

  return (
    <section className="flex min-h-[90svh] flex-col justify-center py-[10vh]">
      <div className="max-w-[42ch] space-y-8 sm:max-w-[50ch]">
        <Reveal as="p" className="display-xl">
          Zipporah,
        </Reveal>
        <Line>
          The thing I&apos;ve been too scared to say is simple: I want you back. I still love you. I
          don&apos;t want to lose you because I was foolish enough to think distance was the end of
          our story.
        </Line>
        <Line>
          I&apos;m not asking for a perfect relationship. Distance will still be hard. There will
          still be difficult days. There will still be moments when being apart sucks.
        </Line>
        <Line>
          But if there&apos;s still something here, I&apos;d rather face all of that with you than
          lose you because I was afraid of it.
        </Line>
        <Line>
          I want another chance. Not to pretend nothing happened — but to do better. To communicate
          better. To be honest when something is bothering me instead of running from it. To stop
          treating obstacles like conclusions. To actually fight for something before deciding
          it&apos;s impossible.
        </Line>
        <Reveal as="p" className="display-lg pt-6">
          Can we try again?
        </Reveal>
      </div>

      <div className="mt-16">
        <Reveal>
          <h2 className="display-lg">Can we talk?</h2>
        </Reveal>

        {!choice && (
          <Reveal delay={160}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button type="button" onClick={() => setChoice("talk")} className="quiet-btn">
                I want to talk ❤️
              </button>
              <button type="button" onClick={() => setChoice("time")} className="quiet-btn">
                I need time
              </button>
            </div>
          </Reveal>
        )}

        {choice === "talk" && (
          <div className="soft-in mt-10 max-w-[42ch] space-y-6">
            <p className="display-lg">Then let&apos;s talk.</p>
            <p className="prose-line">
              No more speeches. No more pretending. No more trying to act like we don&apos;t still
              mean something to each other. Just you and me.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <a href={CALL_LINK} className="quiet-btn">
                Call me
              </a>
              <a href={MESSAGE_LINK} target="_blank" rel="noreferrer" className="quiet-btn">
                Message me
              </a>
            </div>
          </div>
        )}

        {choice === "time" && (
          <div className="soft-in mt-10 max-w-[42ch] space-y-6">
            <p className="display-lg">That&apos;s okay.</p>
            <p className="prose-line">
              You don&apos;t owe me an answer because I built an unnecessarily elaborate website to
              apologize to you. 😭
            </p>
            <p className="prose-line">
              You don&apos;t owe me forgiveness. You don&apos;t owe me another chance. And you
              don&apos;t owe me a decision right now. Take whatever time you need. I just needed you
              to know the truth. I love you. I&apos;m sorry. And whatever you decide, I&apos;ll
              respect it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
