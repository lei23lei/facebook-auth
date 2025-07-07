# Lab6 - Authentication System

A modern authentication system built with Next.js, ShadCN UI, SQLite, and NextAuth.js featuring both credential-based and Facebook OAuth authentication.

## Features

- ✅ **ShadCN UI Components** - Beautiful, accessible UI components
- ✅ **SQLite Database** - Lightweight database with Drizzle ORM
- ✅ **NextAuth.js** - Secure authentication with multiple providers
- ✅ **Facebook OAuth** - Social login integration
- ✅ **Credential Authentication** - Username/email/password system
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with Drizzle ORM
- **Authentication**: NextAuth.js (Auth.js)
- **UI Components**: ShadCN UI + Radix UI
- **Styling**: Tailwind CSS
- **Password Hashing**: bcryptjs
- **Language**: TypeScript

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in your project root:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

### 3. Set up Facebook OAuth (Optional)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Navigate to Facebook Login > Settings
4. Add `http://localhost:3000/api/auth/callback/facebook` to Valid OAuth Redirect URIs
5. Copy your App ID and App Secret to the environment variables

### 4. Set up Database

The database will be automatically created when you run the application. The SQLite database file will be created as `sqlite.db` in your project root.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication Features

1. **Sign Up**: Create a new account with username, email, and password
2. **Sign In**: Login with your credentials
3. **Facebook Login**: Sign in with your Facebook account
4. **Session Management**: Automatic session handling with NextAuth.js

### Database Schema

The application uses the following database tables:

- `users`: User credentials and profile information
- `accounts`: OAuth account information
- `sessions`: User session data
- `verificationTokens`: Email verification tokens

### Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth API routes
│   │   └── register/route.ts         # Registration endpoint
│   ├── auth/
│   │   ├── signin/page.tsx           # Sign in page
│   │   └── signup/page.tsx           # Sign up page
│   ├── layout.tsx                    # Root layout with AuthProvider
│   └── page.tsx                      # Homepage
├── components/
│   ├── providers/
│   │   └── auth-provider.tsx         # Session provider
│   └── ui/                           # ShadCN UI components
└── lib/
    ├── auth.ts                       # NextAuth configuration
    ├── db.ts                         # Database connection
    ├── schema.ts                     # Database schema
    └── utils.ts                      # Utility functions
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate database migrations
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push
```

## Security Features

- Password hashing with bcryptjs
- CSRF protection via NextAuth.js
- Secure session management
- Environment variable protection
- Input validation and sanitization

## Customization

### Adding New OAuth Providers

Add new providers to `src/lib/auth.ts`:

```typescript
import Google from 'next-auth/providers/google';

// Add to providers array
Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
```

### Extending User Schema

Modify `src/lib/schema.ts` to add new fields:

```typescript
export const users = sqliteTable("users", {
  // ... existing fields
  firstName: text("first_name"),
  lastName: text("last_name"),
  // ... other fields
});
```

## Troubleshooting

1. **Database Connection Issues**: Make sure the `sqlite.db` file has proper permissions
2. **Facebook OAuth Errors**: Verify your redirect URIs in Facebook Developer Console
3. **Environment Variables**: Ensure all required environment variables are set
4. **NEXTAUTH_SECRET**: Generate a secure secret for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
# facebook-auth
# facebookauth
# facebookauth
# facebookauth
