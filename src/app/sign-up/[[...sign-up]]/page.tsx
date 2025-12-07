import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '2rem',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        }}>
            <SignUp
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
