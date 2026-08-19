// Sorting algorithms modeled as step generators.
// Each step is an immutable snapshot describing WHAT to show, never HOW to draw it.

export interface ArrayStep {
  array: number[];
  highlights: number[]; // indices being compared
  swapped?: [number, number]; // indices just swapped
  sorted: number[]; // indices confirmed in final position
  pointers?: Record<string, number>; // e.g. { i, j, pivot }
  note: string;
}

type Gen = Generator<ArrayStep>;

const snap = (
  array: number[],
  partial: Omit<ArrayStep, "array" | "sorted"> & { sorted?: number[] }
): ArrayStep => ({
  array: [...array],
  sorted: [],
  ...partial,
});

export function* bubbleSort(input: number[]): Gen {
  const a = [...input];
  const n = a.length;
  const sorted: number[] = [];
  yield snap(a, { highlights: [], note: "Start bubble sort." });
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      yield snap(a, {
        highlights: [j, j + 1],
        sorted: [...sorted],
        pointers: { j },
        note: `Compare index ${j} (${a[j]}) and ${j + 1} (${a[j + 1]}).`,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield snap(a, {
          highlights: [j, j + 1],
          swapped: [j, j + 1],
          sorted: [...sorted],
          note: `Swap because ${a[j + 1]} > ${a[j]}.`,
        });
      }
    }
    sorted.unshift(n - 1 - i);
  }
  sorted.unshift(0);
  yield snap(a, { highlights: [], sorted: [...sorted], note: "Sorted!" });
}

export function* selectionSort(input: number[]): Gen {
  const a = [...input];
  const n = a.length;
  const sorted: number[] = [];
  yield snap(a, { highlights: [], note: "Start selection sort." });
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield snap(a, {
        highlights: [min, j],
        sorted: [...sorted],
        pointers: { i, min, j },
        note: `Find min in unsorted region. Comparing ${a[j]} with current min ${a[min]}.`,
      });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      yield snap(a, {
        highlights: [i, min],
        swapped: [i, min],
        sorted: [...sorted],
        note: `Swap min into position ${i}.`,
      });
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  yield snap(a, { highlights: [], sorted: [...sorted], note: "Sorted!" });
}

export function* insertionSort(input: number[]): Gen {
  const a = [...input];
  const n = a.length;
  yield snap(a, { highlights: [], note: "Start insertion sort." });
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield snap(a, {
      highlights: [i],
      pointers: { i },
      note: `Insert ${key} into the sorted left part.`,
    });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      yield snap(a, {
        highlights: [j, j + 1],
        swapped: [j, j + 1],
        pointers: { j },
        note: `Shift ${a[j]} right.`,
      });
      j--;
    }
    a[j + 1] = key;
  }
  yield snap(a, {
    highlights: [],
    sorted: a.map((_, i) => i),
    note: "Sorted!",
  });
}

export function* quickSort(input: number[]): Gen {
  const a = [...input];
  const sorted: number[] = [];

  function* partition(lo: number, hi: number): Generator<ArrayStep, number> {
    const pivot = a[hi];
    let i = lo;
    yield snap(a, {
      highlights: [hi],
      sorted: [...sorted],
      pointers: { lo, hi, pivot: hi },
      note: `Pivot = ${pivot} (index ${hi}).`,
    });
    for (let j = lo; j < hi; j++) {
      yield snap(a, {
        highlights: [j, hi],
        sorted: [...sorted],
        pointers: { i, j, pivot: hi },
        note: `Compare ${a[j]} with pivot ${pivot}.`,
      });
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        yield snap(a, {
          highlights: [i, j],
          swapped: [i, j],
          sorted: [...sorted],
          note: `${a[i]} < pivot, swap into position ${i}.`,
        });
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    yield snap(a, {
      highlights: [i, hi],
      swapped: [i, hi],
      sorted: [...sorted],
      note: `Place pivot at its final index ${i}.`,
    });
    return i;
  }

  function* qs(lo: number, hi: number): Gen {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.push(lo);
      return;
    }
    const p = yield* partition(lo, hi);
    sorted.push(p);
    yield* qs(lo, p - 1);
    yield* qs(p + 1, hi);
  }

  yield snap(a, { highlights: [], note: "Start quick sort." });
  yield* qs(0, a.length - 1);
  yield snap(a, {
    highlights: [],
    sorted: a.map((_, i) => i),
    note: "Sorted!",
  });
}

export const SORTERS = {
  bubble: { label: "Bubble Sort", fn: bubbleSort, complexity: "O(n²)" },
  selection: { label: "Selection Sort", fn: selectionSort, complexity: "O(n²)" },
  insertion: { label: "Insertion Sort", fn: insertionSort, complexity: "O(n²)" },
  quick: { label: "Quick Sort", fn: quickSort, complexity: "O(n log n) avg" },
} as const;

export type SorterKey = keyof typeof SORTERS;
