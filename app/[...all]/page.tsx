import dynamic from 'next/dynamic';
import { lessons } from '../../data/lessons';

export const runtime = 'edge'

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export async function generateStaticParams() {
  return [
    { all: ['shadow'] },
    { all: ['lessons'] },
    ...lessons.map(list => ({ all: ['lessons', list.id] })),
    // convert lessons into pairs of lesson and exercise
    ...lessons.flatMap(l => l.exercises.map(e => ({ all: ['lessons', l.id, 'exercises', e.id] }))),
    { all: ['settings'] },
  ];
}

export default function Page() {
  return <App />;
}
