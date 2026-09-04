import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SoundtrackProvider, useSoundtrack } from "@/lib/audio";
import { Reveal } from "@/components/Reveal";
import { MemoryVideo } from "@/components/MemoryVideo";
import { Terminal } from "@/components/Terminal";

import v5 from "@/assets/memory-5.mp4.asset.json";
import v6 from "@/assets/memory-6.mp4.asset.json";
import v7 from "@/assets/memory-7.mp4.asset.json";
import v8 from "@/assets/memory-8.mp4.asset.json";
import p5 from "@/assets/memory-5-poster.jpg.asset.json";
import p6 from "@/assets/memory-6-poster.jpg.asset.json";
import p7 from "@/assets/memory-7-poster.jpg.asset.json";
import p8 from "@/assets/memory-8-poster.jpg.asset.json";

// Configure these before sharing the link.
const CALL_LINK = "#call-link";
const MESSAGE_LINK = "#message-link";

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

  useEffect(() => {
    document.documentElement.style.overflow = entered ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [entered]);

  return (
    <>
      <Intro
        entered={entered}
        onEnter={() => {
          start();
          setEntered(true);
        }}
      />
      <main
        aria-hidden={!entered}
        className="relative mx-auto w-full max-w-[1100px] px-6 sm:px-10"
        style={{
          opacity: entered ? 1 : 0,
          filter: entered ? "blur(0px)" : "blur(26px)",
          transform: entered ? "scale(1)" : "scale(1.03)",
          transition:
            "opacity 1.6s var(--ease-cine), filter 1.8s var(--ease-cine), transform 1.8s var(--ease-cine)",
        }}
      >
        <Letter />
      </main>
      {started && <MusicControl />}
    </>
  );
}

function Intro({ entered, onEnter }: { entered: boolean; onEnter: () => void }) {
  const btn = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    btn.current?.focus();
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
          filter: entered ? "blur(0px)" : "blur(22px)",
          opacity: entered ? 1 : 0.72,
          transform: entered ? "scale(1)" : "scale(1.03)",
          transition:
            "filter 1.6s var(--ease-cine), opacity 1.6s var(--ease-cine), transform 1.6s var(--ease-cine)",
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

function Letter() {
  return (
    <>
      <section className="flex min-h-[92svh] flex-col justify-center py-24">
        <Reveal>
          <p className="whisper">A letter</p>
          <h2 className="display-lg mt-6 max-w-[16ch]">Let me start with the part I own.</h2>
        </Reveal>
        <div className="mt-12 max-w-[38ch] space-y-7 sm:max-w-[46ch]">
          <Line>I was the one who ended the relationship.</Line>
          <Line delay={80}>
            Zipporah did not leave me. She did not decide we weren&apos;t worth it. She did not stop
            caring. I made the decision.
          </Line>
        </div>
      </section>

      <section className="max-w-[42ch] space-y-8 py-[12vh] sm:max-w-[50ch]">
        <Line>
          The reason I gave myself was distance. Being apart felt difficult, and I convinced myself
          that difficult meant impossible.
        </Line>
        <Line>
          I now understand those are not the same thing. Distance is hard, missing someone is hard,
          and not being able to see someone whenever you want is hard — but I made the mistake of
          treating difficulty like a conclusion.
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
          After the breakup, I acted nonchalant and distant. This was not because I stopped caring.
          I didn&apos;t know how to be &ldquo;just friends&rdquo; with you.
        </Line>
        <Line>
          I thought that if I became distant enough, stopped talking as much, stopped looking for
          reasons to interact with you and acted like everything was normal, eventually the feelings
          would disappear.
        </Line>
        <Reveal as="p" className="display-lg py-6">
          They didn&apos;t.
        </Reveal>
        <Line>I was hurting quietly.</Line>
        <Line>
          My distance may have looked like indifference, but it wasn&apos;t. I was distant because I
          cared too much and didn&apos;t know how to exist around you without wanting you back.
        </Line>
      </section>

      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Line>I haven&apos;t been able to function properly without you in my life.</Line>
        <Line>
          I&apos;ve continued working, studying, building things, laughing, talking to people and
          doing everything I&apos;m supposed to do — but underneath everything there has been an
          emptiness, because you are no longer part of my everyday life.
        </Line>
        <div className="space-y-3 pt-4">
          <Reveal as="p" className="prose-line">
            I miss the conversations.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={120}>
            The random moments.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={240}>
            The things I would normally tell you.
          </Reveal>
          <Reveal as="p" className="prose-line" delay={360}>
            Being able to have someone on the other side of my phone who was you.
          </Reveal>
        </div>
        <Line>
          I didn&apos;t realize how deeply you had become part of my everyday life until I
          deliberately removed you from it.
        </Line>
        <Line>I don&apos;t want a life where I simply have to get used to you not being in it.</Line>
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
            I miss you. Not an imaginary version of you. You. I miss your voice, our conversations,
            the stupid little things that probably didn&apos;t seem important at the time.
          </Line>
        </div>

        <Chapter caption="And this." src={v6.url} poster={p6.url} label="A memory of us" />

        <div className="mx-auto max-w-[40ch] py-[6vh]">
          <Line>
            Laughing together. Being able to tell you random things and knowing you&apos;d
            understand why I was telling you.
          </Line>
          <Reveal as="p" className="display-lg pt-8">
            I miss being us.
          </Reveal>
        </div>

        <Chapter
          caption="I wish I could go back to this moment for a minute."
          src={v7.url}
          poster={p7.url}
          label="A memory of us"
        />

        <div className="mx-auto max-w-[40ch] space-y-7 py-[8vh]">
          <Line>I didn&apos;t know I was going to miss moments like these this much.</Line>
          <Line delay={120}>
            Funny how you don&apos;t realize you&apos;re living a memory until it&apos;s already
            one.
          </Line>
        </div>
      </section>

      <Beat />

      {/* ACCOUNTABILITY */}
      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Reveal>
          <p className="whisper">What I own</p>
        </Reveal>
        <Line>I could make excuses, but I don&apos;t want to. I made the decision. I have to own it.</Line>
        <Line>
          You didn&apos;t deserve to be left wondering whether you were worth the effort. You
          didn&apos;t deserve to have someone who loved you decide that the circumstances were
          enough reason to walk away. And you didn&apos;t deserve my pretending afterward that I was
          fine.
        </Line>
        <Reveal as="p" className="display-lg py-4">
          I&apos;m sorry. Genuinely sorry.
        </Reveal>
        <Line>
          I now understand that loving someone doesn&apos;t mean everything will always be easy.
          Sometimes loving someone means looking at something difficult and asking:
        </Line>
        <Reveal as="p" className="display-lg">
          &ldquo;How do we figure this out?&rdquo;
        </Reveal>
        <Line>
          Instead, I looked at the distance and decided the answer for both of us. I didn&apos;t
          give us the chance to figure it out together. That&apos;s what I regret.
        </Line>
        <Line>
          The problem wasn&apos;t that I stopped loving you. The problem was that I convinced myself
          love wasn&apos;t enough to make the difficult parts worth facing.
        </Line>
      </section>

      <section className="max-w-[42ch] space-y-8 py-[10vh] sm:max-w-[50ch]">
        <Line>If I could go back to the moment I ended things, I wouldn&apos;t do it.</Line>
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
        <Line>
          And then I&apos;d ask how we could figure it out together, instead of deciding that we
          should end it.
        </Line>
        <Line>I know I hurt you. I know an apology doesn&apos;t erase what happened.</Line>
        <Line>
          You may be angry. You may be confused. You may not trust me the same way anymore. You may
          need time. You may not even want the relationship anymore.
        </Line>
        <Line>
          I don&apos;t get to decide how you feel about what happened. I will not pressure you. I
          will not ask you to forget. I will not ask you to pretend nothing happened.
        </Line>
        <Line>
          I simply want you to know that I understand what I did now, and that I regret it.
        </Line>
      </section>

      <Beat />

      {/* EASTER EGG */}
      <section className="py-[8vh]">
        <Reveal>
          <Terminal />
        </Reveal>
      </section>

      <Beat />

      {/* FINAL MEMORY */}
      <section className="py-[8vh]">
        <Reveal>
          <p className="whisper">One last memory.</p>
        </Reveal>
        <Chapter src={v8.url} poster={p8.url} label="A memory of us" />
        <div className="mx-auto max-w-[40ch] space-y-6 py-[6vh]">
          <Reveal as="p" className="display-lg">
            Look at us.
          </Reveal>
          <Line>I don&apos;t want this to just be something I look back on.</Line>
          <Line delay={120}>I want more moments like this.</Line>
          <Reveal as="p" className="display-lg pt-2" delay={220}>
            With you.
          </Reveal>
        </div>
      </section>

      <Beat />

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
      </footer>
    </>
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
          I am not asking for a perfect relationship. Distance will still be difficult. There will
          still be difficult days. There will still be moments when being apart sucks.
        </Line>
        <Line>
          But if there is still something here, I&apos;d rather face those things with you than lose
          you because I was afraid of them.
        </Line>
        <Line>
          I want another chance. Not to pretend nothing happened — but to do better. To communicate
          better. To be honest when something is bothering me instead of running from it. To stop
          treating obstacles like conclusions. To actually fight for something before deciding it is
          impossible.
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
          <div className="reveal is-in mt-10 max-w-[42ch] space-y-6">
            <p className="display-lg">Then let&apos;s talk.</p>
            <p className="prose-line">
              No more speeches. No more pretending. No more trying to act like we don&apos;t still
              mean something to each other. Just you and me.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <a href={CALL_LINK} className="quiet-btn">
                Call me
              </a>
              <a href={MESSAGE_LINK} className="quiet-btn">
                Message me
              </a>
            </div>
          </div>
        )}

        {choice === "time" && (
          <div className="reveal is-in mt-10 max-w-[42ch] space-y-6">
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
