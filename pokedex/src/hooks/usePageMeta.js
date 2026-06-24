import { useEffect } from 'react';

/**
 * Hook para definir document.title e meta description dinamicamente.
 * @param {string} title  - Título da página (sem prefixo)
 * @param {string} [description] - Meta description opcional
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | The Pokemon Atlas` : 'The Pokemon Atlas | A Enciclopédia Pokémon Completa';

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevContent = metaDesc?.content || '';
    if (description && metaDesc) {
      metaDesc.content = description;
    }

    return () => {
      document.title = prev;
      if (metaDesc && prevContent) metaDesc.content = prevContent;
    };
  }, [title, description]);
}
