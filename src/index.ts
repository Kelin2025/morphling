export const createMorpher = ({
  from,
  to,
  duration,
  easing = "ease-in",
}: {
  from: Store<HTMLElement>;
  to: Store<HTMLElement>;
  duration: number;
  easing?: string;
}) => {
  const el = document.createElement("div");
  el.style.display = "none";
  el.style.position = "absolute";
  el.style.background = "yellow";
  document.body.appendChild(el);

  const fakeShowEl = createEffect((el: HTMLElement) => {
    el.style.display = "block";
    el.style.visibility = "hidden";
    el.style.pointerEvents = "none";
  });

  const showEl = createEffect((el: HTMLElement) => {
    el.style.display = "block";
    el.style.visibility = "unset";
    el.style.pointerEvents = "unset";
  });

  const hideEl = createEffect((el: HTMLElement) => {
    el.style.display = "none";
  });

  const animateFx = createEffect(
    ({ from, to }: { from: HTMLElement; to: HTMLElement }) => {
      return new Promise((resolve) => {
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        el.style.display = "block";
        const animation = el.animate(
          [
            {
              width: `${fromRect.width}px`,
              height: `${fromRect.height}px`,
              left: `${fromRect.left}px`,
              top: `${fromRect.top}px`,
            },
            {
              width: `${toRect.width}px`,
              height: `${toRect.height}px`,
              left: `${toRect.left}px`,
              top: `${toRect.top}px`,
            },
          ],
          {
            iterationStart: 0,
            duration,
            easing,
          }
        );
        animation.addEventListener("finish", () => {
          el.style.display = "none";
          resolve(null);
        });
      });
    }
  );

  const morphInFx = attach({
    source: { from, to },
    effect: animateFx,
  });

  const morphOutFx = attach({
    source: { from: to, to: from },
    effect: animateFx,
  });

  const morphIn = attach({
    source: $to,
    effect: (el) => {
      fakeShowEl(el);
      return morphInFx();
    },
  });
  
  const morphOut = attach({
    source: $to,
    effect: (el) => {
      fakeShowEl(el);
      return morphOutFx();
    },
  });

  sample({
    clock: morphIn.doneData,
    target: attach({ source: $to, effect: showEl }),
  });

  sample({
    clock: morphOut.doneData,
    target: attach({ source: $to, effect: hideEl }),
  });

  return { morphIn, morphOut };
};
