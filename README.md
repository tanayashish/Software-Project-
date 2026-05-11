# PredictStock AI

PredictStock AI is an intelligent retail inventory management system designed to optimize stock levels, prevent stockouts, and maximize profitability using advanced AI forecasting and real-time simulation.

## 🚀 Key Features

- **AI Inventory Analyst**: Powered by Google Gemini, the system provides deep insights and demand forecasting based on historical sales, weather patterns, and local events.
- **Dynamic Simulation Engine**: A built-in virtual loop that generates random sales data to test inventory resilience. Users can control the simulation speed via a dedicated "Tick Speed" slider in the settings.
- **Real-time Monitoring**: Track stock levels across multiple stores with a live-updating dashboard.
- **Proactive Alerting**: Receive automated notifications for low stock, expiring products, and unusual demand spikes.
- **System Synchronization**: A "Sync Data" utility that performs periodic audits, purges stale logs, and ensures database integrity.
- **Responsive Design**: A polished, modern interface built with Tailwind CSS that works across desktop and mobile devices.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Firebase project
- A Google Gemini API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables. For a production deployment (like Vercel), add the following to your Environment Variables panel:

#### Core API
- `GEMINI_API_KEY`: Your Google Gemini API key (from Google AI Studio).

#### Firebase Configuration
- `VITE_FIREBASE_API_KEY`: Firebase Web API Key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain.
- `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID.
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID.
- `VITE_FIREBASE_APP_ID`: Firebase App ID.
- `VITE_FIREBASE_DATABASE_ID`: (Optional) Firestore Database ID, defaults to `(default)`.

*Note: In the AI Studio development environment, these are partially managed via `firebase-applet-config.json`.*

### Development

Start the development server:

```bash
npm run dev
```

### Production Build

Create a production-ready build:

```bash
npm run build
```

## 🛡 Security

The project uses hardened Firestore Security Rules to protect data. Access is restricted based on authenticated user IDs, and schema validation is enforced for all write operations.

## 📄 License

MIT
