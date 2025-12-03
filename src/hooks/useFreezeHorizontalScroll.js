import { useLayoutEffect, useRef } from "react";

export const useFreezeHorizontalScroll = (scrollRef) => {
  const saved = useRef(0);

  // сохраняем scrollLeft перед каждым ререндером
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    saved.current = el.scrollLeft;
  });

  // восстанавливаем scrollLeft сразу после рендера
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    console.log(saved.current)
    el.scrollLeft = saved.current;
  });
};
