import DefaultLayout from '@components/layout/DefaultLayout';
import Client from './client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List',
};

export default function Page() {
  return (
    <DefaultLayout>
      <Client />
    </DefaultLayout>
  );
}
