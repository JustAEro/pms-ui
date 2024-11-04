import {
  attach,
  combine,
  createEvent,
  createStore,
  Effect,
  EffectParams,
  EffectResult,
  sample,
  Store,
} from 'effector';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PaginationOptions<Item, Eff extends Effect<any, any, any>> = {
  limit: Store<number>; // store with number of items per page

  effect: Eff; // effect that will do fetching items

  /* Map effect result to extract items */
  mapResult: (result: EffectResult<Eff>) => Item[];

  /* Convert createPagination's page and limit into effect params */
  mapParams: (params: { page: number; limit: number }) => EffectParams<Eff>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPagination = <Item, Eff extends Effect<any, any, any>>(
  options: PaginationOptions<Item, Eff>
) => {
  const $currentPage = createStore(0);
  const $itemsSplitByPageNumbers = createStore<Record<number, Item[]>>({});
  const $canLoadNext = createStore(true);

  const $limit = options.limit;

  const $currentItems = combine(
    $itemsSplitByPageNumbers,
    $currentPage,
    (pages, page) => pages[page] ?? []
  );

  const $allItems = $itemsSplitByPageNumbers.map((pages) =>
    Object.values(pages).flat()
  );

  const $canLoadPrev = $currentPage.map((page) => page > 1);

  const loadFx = attach({
    effect: options.effect,
    mapParams: options.mapParams || ((payload) => payload),
  });

  const itemsLoaded = sample({
    clock: loadFx.done,
    source: $limit,
    fn: (limit, { params, result }) => {
      const items = options.mapResult(result);

      return {
        page: params.page,
        items,
        canGoNext: items.length >= limit,
      };
    },
  });

  sample({
    clock: itemsLoaded,
    source: $itemsSplitByPageNumbers,
    fn: (pages, { page, items }) => ({
      ...pages,
      [page]: items,
    }),
    target: $itemsSplitByPageNumbers,
  });

  sample({
    clock: itemsLoaded,
    fn: ({ canGoNext }) => canGoNext,
    target: $canLoadNext,
  });

  const loadPageFx = attach({
    effect: loadFx,
    source: { limit: $limit },
    mapParams: ({ page }: { page: number }, { limit }) => ({ page, limit }),
  });

  sample({
    clock: loadPageFx,
    fn: ({ page }) => page,
    target: $currentPage,
  });

  const loadNextPageFx = attach({
    effect: loadPageFx,
    source: { page: $currentPage.map((page) => page + 1) },
  });

  const loadPrevPageFx = attach({
    effect: loadPageFx,
    source: { page: $currentPage.map((page) => page - 1) },
  });

  const reset = createEvent();

  sample({
    clock: reset,
    target: [
      $currentPage.reinit,
      $itemsSplitByPageNumbers.reinit,
      $canLoadNext.reinit,
    ] as const,
  });

  $currentPage.watch(console.log);
  $currentItems.watch(console.log);
  $itemsSplitByPageNumbers.watch(console.log);

  return {
    $currentPage, // Current page number
    $itemsSplitByPageNumbers, // All loaded items split by page numbers
    $currentItems, // Items on current page
    $allItems, // All loaded items combined
    $canLoadPrev, // Can load previous page?
    $canLoadNext, // Can load next page?
    $pending: loadFx.pending, // Is currently pending?
    loadPageFx, // Load page with specific number
    loadNextPageFx, // Load next page
    loadPrevPageFx, // Load previous page
    reset, // Reset all state, clean up all loaded items
  };
};
