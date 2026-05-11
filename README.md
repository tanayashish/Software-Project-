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
3. Configure your environment variables. Create a `.env` file in the root directory and add the following:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```
   *Note: Firebase configuration is also managed via `firebase-applet-config.json` in this environment.*

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
