import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/ReactiveHTMLElement.js',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
    },
    plugins: [
        resolve(),
        html({
            include: 'src/ReactiveHTMLElementTemplate.js',
        }),
    ],
};
