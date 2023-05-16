import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from "rollup"

console.log(visualizer);
export default defineConfig({
	input: 'index.js',
	output: {
		sourcemap: true,
		file: 'build/bundle.js'
	},
	plugins: [
		resolve(),
		terser(),
		visualizer({ 
			open: true,
			template: 'treemap',
			sourcemap: true,
		})
	],
});
