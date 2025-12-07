import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '2rem',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        }}>
            <SignIn
                appearance={{
                    elements: {
                        rootBox: 'mx-auto',
                        card: 'bg-white shadow-2xl',
                    },
                }}
            />
        </div>
    );
}
