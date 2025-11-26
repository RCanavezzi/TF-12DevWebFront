import { createRoot } from 'react-dom/client';
import { ComponentType } from 'react';
import '@app/css/app.css';

(async () => {

    console.log(import.meta.env);
    const element = document.getElementById('app');

    if (element === null) {
        console.log("No app react wrapper");
        return;
    }

    const componentName = element.dataset.component || "Users";

    const key = `./React/Pages/${componentName}/${componentName}.tsx`;

    const modules = import.meta.glob('./React/Pages/*/*.tsx');

    const loader = modules[key];

    if (!loader) throw new Error(`Componente não encontrado: ${key}`);
    const mod = await loader() as any;
    const Component = (mod.default ?? mod[componentName]) as ComponentType;

    createRoot(element).render(<Component />);
})();