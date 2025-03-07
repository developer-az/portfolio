// src/app/gabi/page.js
import dynamic from 'next/dynamic';

// Import the component with no SSR
const GabiPageNoSSR = dynamic(() => import('@/components/Gabi'), {
  ssr: false,
  loading: () => <div style={{
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    background: '#0f0f0f',
    color: 'white',
    fontFamily: 'Avant Garde Book BT, sans-serif',
    fontWeight: '300'
  }}>Loading...</div>
});

export default function GabiPage() {
  return <GabiPageNoSSR />;
}