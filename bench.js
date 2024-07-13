let _value;
function blackBox(value) {
  _value = value;
}

const ITERS = 2048 * 2048 * 4;
const SMALL_ITERS = 2048 * 1024;

Deno.bench("hoisting/loop-invariant-variable - before", () => {
  const rand = Math.random();
  for (let i = 0; i < ITERS; i++) {
    const value = (rand - 32) / 1.8000 + 273.15;
    blackBox(value);
  }
});

Deno.bench("hoisting/loop-invariant-variable - after", () => {
  const rand = Math.random();
  const value = (rand - 32) / 1.8000 + 273.15;
  for (let i = 0; i < ITERS; i++) {
    blackBox(value);
  }
});

Deno.bench("hoisting/loop-invariant-variable - cc", () => {
  const rand = Math.random();
  for (let i = 0; i < ITERS; i++) {
    blackBox((rand - 32) / 1.8000 + 273.15);
  }
});

Deno.bench("hoisting/loop-invariant-expression - before", () => {
  const rand = Math.random();
  for (let i = 0; i < ITERS; i++) {
    blackBox((rand - 32) / 1.8000 + 273.15);
  }
});

Deno.bench("hoisting/loop-invariant-expression - after", () => {
  const rand = Math.random();
  const __0 = (rand - 32) / 1.8000 + 273.15;
  for (let i = 0; i < ITERS; i++) {
    blackBox(__0);
  }
});

Deno.bench("hoisting/loop-invariant-expression - cc", () => {
  const rand = Math.random();
  for (let i = 0; i < ITERS; i++) {
    blackBox((rand - 32) / 1.8000 + 273.15);
  }
});

Deno.bench(
  "hoisting/loop-invariant-expression-in-loop-condition - before",
  () => {
    for (let i = 0; i < 0.01 * ITERS * 10 / 0.1; i++) {
      blackBox(i);
    }
  },
);

Deno.bench(
  "hoisting/loop-invariant-expression-in-loop-condition - after",
  () => {
    const __0 = 0.01 * ITERS * 10 / 0.1;
    for (let i = 0; i < __0; i++) {
      blackBox(i);
    }
  },
);

Deno.bench("hoisting/loop-invariant-expression-in-loop-condition - cc", () => {
  for (let i = 0; 16777216 > i; i++) {
    blackBox(i);
  }
});

Deno.bench("constant-pre-calculation - before", () => {
  for (let i = 0; i < ITERS; i++) {
    const value = (57 - 32) / 1.8000 + 273.15;
    blackBox(i + value);
  }
});

Deno.bench("constant-pre-calculation - after", () => {
  for (let i = 0; i < ITERS; i++) {
    blackBox(i + 287.0388888888889);
  }
});

Deno.bench("constant-pre-calculation - cc", () => {
  for (let i = 0; i < ITERS; i++) {
    blackBox(i + (25 / 1.8000 + 273.15));
  }
});

Deno.bench("loop-unswitching/inner-outer-swap - before", () => {
  const rand = Math.random();
  for (let i = 0; i < ITERS; i++) {
    if (rand > 0.5) {
      blackBox(i);
    } else {
      blackBox(i + 1);
    }
  }
});

Deno.bench("loop-unswitching/inner-outer-swap - after", () => {
  const rand = Math.random();
  if (rand > 0.5) {
    for (let i = 0; i < ITERS; i++) {
      blackBox(i);
    }
  }
  else {
    for (let i = 0; i < ITERS; i++) {
      blackBox(i + 1);
    }
  }
});

Deno.bench("loop-unswitching/inner-outer-swap - cc", () => {
  const rand = Math.random();
  for (let i = 0; i < ITERS; i++) {
    0.5 < rand ? blackBox(i) : blackBox(i + 1);
  }
});

Deno.bench("loop-splitting - before", () => {
  for (let i = 0; i < ITERS; i++) {
    if (i < 2048) {
      blackBox(i);
    } else {
      blackBox(i + 1);
    }
  }
});

Deno.bench("loop-splitting - after", () => {
  for (let i = 0; i < 2048; i++) {
    blackBox(i);
  }
  for (let i = 2048; i < ITERS; i++) {
    blackBox(i + 1);
  }
});

Deno.bench("loop-splitting - cc", () => {
  for (let i = 0; i < ITERS; i++) {
    2048 > i ? blackBox(i) : blackBox(i + 1);
  }
});

Deno.bench("function-inlining/sync - before", (t) => {
  function isEven(i) {
    return i % 2 === 0;
  }

  t.start();
  for (let i = 0; i < ITERS; i++) {
    blackBox(isEven(i));
  }
});

Deno.bench("function-inlining/sync - after", () => {
  for (let i = 0; i < ITERS; i++) {
    blackBox(i % 2 === 0);
  }
});

Deno.bench("function-inlining/sync - cc", () => {
  for (let i = 0; i < ITERS; i++) {
    blackBox(0 === i % 2);
  }
});

Deno.bench("function-inlining/async - before", async (t) => {
  async function isEven(i) {
    return await Promise.resolve(i % 2 === 0);
  }

  t.start();
  for (let i = 0; i < SMALL_ITERS; i++) {
    blackBox(await isEven(i));
  }
});

Deno.bench("function-inlining/async - after", async () => {
  for (let i = 0; i < SMALL_ITERS; i++) {
    blackBox(await Promise.resolve(i % 2 === 0));
  }
});

Deno.bench("function-inlining/async - cc", async (t) => {
  async function isEven(i) {
    return await Promise.resolve(0 === i % 2);
  }
  t.start();
  for (let i = 0; i < SMALL_ITERS; i++) {
    blackBox(await isEven(i));
  }
});

Deno.bench("loop-unrolling - before", () => {
  for (let i = 0; i < ITERS; i++) {
    for (let x = 0; x < 4; x++) {
      blackBox(x);
    }
  }
});

Deno.bench("loop-unrolling - after", () => {
  for (let i = 0; i < ITERS; i++) {
    blackBox(0);
    blackBox(1);
    blackBox(2);
    blackBox(3);
  }
});

Deno.bench("loop-unrolling - cc", () => {
  for (let i = 0; i < ITERS; i++) {
    for (let x = 0; 4 > x; x++) {
      blackBox(x);
    }
  }
});
