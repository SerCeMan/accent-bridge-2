import dynamic from 'next/dynamic';
import { lessons } from '../../mock';

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export async function generateStaticParams() {
  return [
    { all: ['shadow'] },
    { all: ['lessons'] },
    ...lessons.map(list => ({ all: ['lessons', list.id] })),
    { all: ['settings'] },
  ];
}

export default function Page() {
  return <App />;
}
