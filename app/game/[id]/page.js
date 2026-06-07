import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GAMES } from '@/lib/evolution-api';

export function generateStaticParams() {
  return Object.keys(GAMES).map((id) => ({ id }));
}

export default function GamePage({ params }) {
  const game = GAMES[params.id];

  if (!game) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="text-sm text-purple-300 hover:text-purple-200">
        ← Voltar para o painel
      </Link>
      <section className="mt-6 rounded-lg bg-gray-800 p-6">
        <div className="text-5xl">{game.icon}</div>
        <h1 className="mt-4 text-3xl font-bold text-yellow-500">{game.name}</h1>
        <p className="mt-2 text-gray-300">{game.description}</p>
        <dl className="mt-6 grid gap-3 text-sm">
          <div className="rounded bg-gray-700 p-3">
            <dt className="text-gray-400">ID interno</dt>
            <dd className="font-mono text-white">{game.id}</dd>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <dt className="text-gray-400">ID Evolution cadastrado</dt>
            <dd className="font-mono text-white">{game.evolutionId}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
