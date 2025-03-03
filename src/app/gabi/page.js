import dynamic from 'next/dynamic';

// Import the component with no SSR
// This completely avoids hydration issues
const GabiPageNoSSR = dynamic(() => import('@/components/GabiPageWrapper'), {
  ssr: false,
  loading: () => <div style={{
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    background: '#0f0f0f',
    color: 'white'
  }}>Loading...</div>
});

export default function GabiPage() {
  return <GabiPageNoSSR />;
}