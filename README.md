# 🤖 Redbubble Automation Agent

AI-powered automation system that generates unique designs and automatically uploads them to Redbubble daily.

## Features

✅ **Niche-Based Idea Generation**: Analyzes trending design ideas using AI
✅ **AI Image Creation**: Generates unique, high-quality images using DALL-E 3
✅ **SEO Optimization**: Creates clickbait titles, keyword-rich descriptions, and 13-15 high-ranking tags
✅ **Automated Upload**: Uploads designs to Redbubble with product selection
✅ **Daily Automation**: Schedules 3-4 uploads per day automatically

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with your credentials:

```env
OPENAI_API_KEY=your_openai_api_key_here
REDBUBBLE_EMAIL=your_redbubble_email
REDBUBBLE_PASSWORD=your_redbubble_password
DESIGN_NICHE=motivational quotes
CRON_SECRET=your_secret_key_for_cron
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Quick Deploy

```bash
vercel deploy --prod
```

### Configure Vercel Environment Variables

Add these secrets to your Vercel project settings.

## License

MIT
