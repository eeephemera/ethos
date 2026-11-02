"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ymGoal } from "../_ui";

// Перенесено с сайта «Карточки·AI Лаб» (site/src/components/flow/flow-steps-play.tsx) — см. FlowSteps.tsx.
// Фазы «Как это работает» (FlowSteps.tsx): 0 — сброс, 1–4 — шаги. Время — мс: сколько шаг стоит на
// экране. Движения шага короче (1,7–2,3 с, scripts/flow-steps-keyframes.py) — остаток шаг стоит
// готовым, чтобы успеть прочесть подпись. Что меняется в каждой фазе — flow-steps.module.css.
const PHASES: [string, number][] = [
  ["0", 450],
  ["1", 2700],
  ["2", 3900],
  ["3", 2700],
  ["4", 3400],
];

/** Шаг, выбранный щелчком, стоит дольше: его выбрали, чтобы рассмотреть. */
const CHOSEN_EXTRA = 2500;

/** Первый показ: сразу с шага 1 (без сброса), через столько мс после появления блока. */
const FIRST_HOLD = 500;

/** Первый показ после чужих анимаций (after): шаг 1 — через столько мс после того, как они доиграли */
const AFTER_HOLD = 250;

/**
 * Переключает фазы и шаги. Петля играет, только пока блок на экране и вкладка открыта; ушёл —
 * пауза (вместе с CSS-анимациями фазы), вернулся — дальше с того же места. Шаг — кнопка
 * [data-step]: экран переходит к нему и проигрывает его заново; щелчок по экрану — следующий шаг.
 * При prefers-reduced-motion петли нет: экран без движения, шаги переключают его.
 * after — селектор блока: пока его конечные анимации (CSS) не доиграли, петля не начинается, экран
 * стоит на сбросе (фаза 0, она же — в разметке с сервера: без мелькания шага 2 до скрипта). Его анимации
 * ищутся по факту, а не по таймеру: и при переходе на страницу ссылкой, когда время страницы давно
 * идёт, левая колонка всё равно играет первой. При «уменьшить движение» — шаг 2 без движения, как всегда.
 */
export function FlowStepsPlay({
  className,
  after,
  children,
}: {
  className: string;
  after?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const buttons = [...el.querySelectorAll<HTMLButtonElement>("[data-step]")];
    const stage = el.querySelector<HTMLElement>("[data-flow-stage]");
    let index = 1;
    let timer = 0;
    let due = 0;
    let left = FIRST_HOLD;
    let inView = false;
    let started = false;
    let alive = true;
    // чужие анимации, которые играют первыми: конечные, ещё не доигравшие
    const gate = after ? document.querySelector(after) : null;
    const waiting = (gate?.getAnimations({ subtree: true }) ?? []).filter(
      (a) => a.playState !== "finished" && a.effect?.getComputedTiming().endTime !== Infinity,
    );
    let ready = waiting.length === 0;
    if (after && reduce.matches) delete el.dataset.phase;

    /** Фаза на экран: та же — проигрывается заново (анимации CSS перезапускаются); again: false —
     *  оставить, если уже стоит (сброс из разметки сервера не перезапускать: экран мигнул бы шагом 2) */
    const show = (phase: string, hold: number, again = true) => {
      if (el.dataset.phase === phase && again) {
        delete el.dataset.phase;
        void el.offsetWidth;
      }
      el.style.setProperty("--hold", `${hold}ms`);
      el.dataset.phase = phase;
      const step = phase === "0" ? "1" : phase;
      buttons.forEach((button) =>
        button.dataset.step === step ? button.setAttribute("aria-current", "step") : button.removeAttribute("aria-current"),
      );
    };

    const schedule = (ms: number) => {
      due = performance.now() + ms;
      timer = window.setTimeout(next, ms);
    };
    const next = () => {
      const [phase, ms] = PHASES[index];
      show(phase, ms);
      index = (index + 1) % PHASES.length;
      schedule(ms);
    };
    const stop = () => {
      window.clearTimeout(timer);
      timer = 0;
    };

    const update = () => {
      if (reduce.matches) {
        stop();
        delete el.dataset.paused;
        return;
      }
      if (!ready) return;
      const run = inView && !document.hidden;
      if (run && !timer) {
        delete el.dataset.paused;
        started = true;
        schedule(left);
      } else if (!run && timer) {
        stop();
        left = Math.max(0, due - performance.now());
        el.dataset.paused = "";
      }
    };

    /** Шаг по выбору посетителя: проиграть его, дальше петля — со следующего */
    const choose = (step: number) => {
      const at = PHASES.findIndex(([phase]) => phase === String(step));
      if (at < 0) return;
      stop();
      if (reduce.matches) {
        show(String(step), 0);
        return;
      }
      const hold = PHASES[at][1] + CHOSEN_EXTRA;
      show(String(step), hold);
      index = (at + 1) % PHASES.length;
      started = true;
      if (inView && !document.hidden) schedule(hold);
      else left = hold;
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const button = target.closest<HTMLElement>("[data-step]");
      if (button) {
        choose(Number(button.dataset.step));
        // ETHOS: интерес к анимации — цель Метрики flow_step (какой шаг смотрели)
        ymGoal("flow_step", { step: Number(button.dataset.step), place: "kartochki" });
        return;
      }
      if (stage && stage.contains(target)) {
        const current = Number(el.dataset.phase ?? 2) || 1;
        choose((current % 4) + 1);
        ymGoal("flow_step", { step: (current % 4) + 1, place: "kartochki_screen" });
      }
    };

    const observer = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      if (inView && !started) left = ready && waiting.length ? AFTER_HOLD : FIRST_HOLD;
      update();
    });
    if (!ready && !reduce.matches) {
      // до первого шага — сброс: тот же экран, с которого шаг 1 начнётся
      show("0", 0, false);
      Promise.allSettled(waiting.map((a) => a.finished)).then(() => {
        if (!alive) return;
        ready = true;
        if (!started) left = AFTER_HOLD;
        update();
      });
    }
    observer.observe(el);
    el.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", update);
    reduce.addEventListener("change", update);
    return () => {
      alive = false;
      stop();
      observer.disconnect();
      el.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", update);
      reduce.removeEventListener("change", update);
    };
  }, [after]);

  return (
    <div className={className} ref={ref} data-phase={after ? "0" : undefined}>
      {children}
    </div>
  );
}
