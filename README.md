## Repro: rollup-plugin-visualizer does not adjust for minification

This repsitory contains a minimal reproduction of a bug in [https://github.com/btd/rollup-plugin-visualizer](rollup-plugin-visualizer:) all sizes are reported un-minified. [index.js](./index.js) file imports `* from date-fns` —  un-minified modules with JSDoc comments, and the bundle size is overestimated by around 5x. Prviousluy reported in [#96](https://github.com/btd/rollup-plugin-visualizer/issues/96)

To reproduce:

1. `npm ci`
2. `npm run build`: build and open visualizer. The reported bundle size is ~514kB.
3. `npm run real-size`: print actual bundle size (~101kB)

I'm pretty sure this is caused by using non-minified modules for size computation — 514kB is very close to the bundle size without terser. This is very problematic for several reasons:

1. Such massive overestimation can cause useless optimization. In our production app, the reported `date-fns` size was around 30kB gzip, while the real size was around 3.5kB.
2. The relative sizes of different modules (especially libraries) are skewed, depending on whether the dist is shipped minified, and on comments. Using oly percents, as suggested in [#98](https://github.com/btd/rollup-plugin-visualizer/issues/98), won't work.
3. For large ES bundles where dead code is eliminated during tree-shaking, the overestimation can be even bigger.

`sourcemap` plugin option has no major effect (~45 bytes) — both the original module in the FS and the sourcemap version are non-minified.

Using `renderedLength` as reported by rollup in [plugin/index.js](https://github.com/btd/rollup-plugin-visualizer/blob/f70d2e5a0bc94ac009954b1d6a3e987f759f9d41/plugin/index.ts#L183) gives a much better result. From what I hear, this method underestimates the size of unicode strings, and the reported size is a bit smaller for our production app with cyrillic UI, but nowhere close to 5x.