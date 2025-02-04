# FreeCast

A minimal, open-source Farcaster Frame implementation with Privy authentication.

## Features
- Automatic Frame context detection
- Seamless Privy authentication
- Web app & Frame-specific UI
- Farcaster integration
- Profile management

## Setup

1. Clone the repository:
```sh
git clone https://github.com/compusophy/freecast.git
```

2. Install dependencies:
```sh
npm install
```

3. Set up your environment variables in `.env.local`:
```
NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
NEXT_PUBLIC_URL=<your-frame-url>
```

4. Run the development server:
```sh
npm run dev
```

## Testing

For Frame testing, use [Warpcast Embed Tools](https://warpcast.com/~/developers/frames). Note: You'll need a public URL - use ngrok or similar for local development.

## Structure
- `src/components/Demo.tsx` - Main Frame/Web app component
- `src/app/providers.tsx` - Auth providers setup
- `src/app/.well-known/farcaster.json/route.ts` - Frame metadata
