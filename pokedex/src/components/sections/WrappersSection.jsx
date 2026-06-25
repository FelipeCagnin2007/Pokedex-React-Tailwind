import { Box, Globe, Bot, Code2, Hexagon, MonitorSmartphone } from 'lucide-react';

const WRAPPERS = [
  {
    name: 'Pokédex Promise v2',
    lang: 'Node.js',
    icon: <Box size={24} className="text-green-500" />,
    desc: 'Wrapper completo com suporte a promises e cache para Node.js.',
    url: 'https://github.com/PokeAPI/pokedex-promise-v2',
    install: 'npm i pokedex-promise-v2',
  },
  {
    name: 'pokeapi-js-wrapper',
    lang: 'Browser',
    icon: <Globe size={24} className="text-blue-500" />,
    desc: 'Wrapper JavaScript para uso direto no navegador com cache incluso.',
    url: 'https://github.com/PokeAPI/pokeapi-js-wrapper',
    install: 'npm i pokeapi-js-wrapper',
  },
  {
    name: 'Pokéapi-kotlin',
    lang: 'Kotlin / Android',
    icon: <Bot size={24} className="text-emerald-500" />,
    desc: 'Biblioteca oficial para aplicativos Android com suporte a Coroutines.',
    url: 'https://github.com/PokeAPI/pokekotlin',
    install: 'implementation "me.sargunvohra.lib:pokekotlin:2.6.3"',
  },
  {
    name: 'pokebase',
    lang: 'Python',
    icon: <Code2 size={24} className="text-yellow-500" />,
    desc: 'Interface Python simples para a PokéAPI com cache automático.',
    url: 'https://github.com/zaneadix/pokebase',
    install: 'pip install pokebase',
  },
  {
    name: 'PokeApi.Net',
    lang: 'C# / .NET',
    icon: <Hexagon size={24} className="text-purple-500" />,
    desc: 'Wrapper .NET com suporte completo a tipos e cache integrado.',
    url: 'https://github.com/jtwotimes/PokeApiNet',
    install: 'dotnet add package PokeApiNet',
  },
  {
    name: 'pokeapi-dart',
    lang: 'Dart / Flutter',
    icon: <MonitorSmartphone size={24} className="text-cyan-500" />,
    desc: 'Biblioteca para Flutter/Dart com suporte a todos os endpoints da v2.',
    url: 'https://github.com/prathanbomb/pokeapi-dart',
    install: 'pokeapi_dart: ^0.3.0',
  },
];

export default function WrappersSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-4">Bibliotecas Wrapper</h2>
        <p className="text-poke-gray-light max-w-xl mx-auto text-sm">
          A comunidade mantém wrappers oficiais e não-oficiais para diversas linguagens.
          Use-as para facilitar a integração com a PokéAPI.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WRAPPERS.map(({ name, lang, icon, desc, url, install }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 border border-poke-gray hover:border-poke-yellow hover:shadow-yellow hover:-translate-y-1 transition-all duration-300 group block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <div>
                  <p className="text-white font-bold text-sm group-hover:text-poke-yellow transition-colors">
                    {name}
                  </p>
                  <span className="text-xs bg-poke-gray text-poke-gray-light px-2 py-0.5 rounded-full">
                    {lang}
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-poke-gray-light group-hover:text-poke-yellow transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <p className="text-poke-gray-light text-xs leading-relaxed mb-3">{desc}</p>
            <code className="text-green-400 text-xs bg-poke-dark px-3 py-1.5 rounded-lg border border-poke-gray block overflow-hidden text-ellipsis whitespace-nowrap">
              {install}
            </code>
          </a>
        ))}
      </div>
    </section>
  );
}
