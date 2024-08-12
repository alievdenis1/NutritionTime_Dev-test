import '../src/shared/styles/index.scss';
import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';

const pinia = createPinia();

setup((app) => {
    app.use(pinia);
});

export const decorators = [
    (story) => ({
        components: { story },
        template: '<story />',
        setup() {
            // Любая дополнительная логика инициализации
        },
    }),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};


