# Backend Deployment Note

## Current Status

The frontend is now configured to deploy to Vercel with a simplified configuration.

## Backend Deployment Options

Since the simplified Vercel configuration focuses on frontend-only deployment, you have two options for the backend:

### Option 1: Deploy Backend Separately (Recommended)

Deploy the backend to a different platform:
- **Railway**: https://railway.app (Easy Node.js deployment)
- **Render**: https://render.com (Free tier available)
- **Heroku**: https://heroku.com
- **Fly.io**: https://fly.io

Then update the frontend's `VITE_API_URL` environment variable in Vercel to point to your backend URL.

### Option 2: Add Backend to Vercel Later

Once the frontend is working, we can add Vercel serverless functions for the backend API.

## Environment Variables Needed in Vercel

For the frontend deployment, you may need to add:
- `VITE_API_URL` - URL of your backend API (if deployed separately)

## Backend Environment Variables

When deploying the backend separately, ensure these are set:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PORT` (usually provided by the platform)
- `FRONTEND_URL` - URL of your Vercel frontend (for CORS)

## Next Steps

1. Deploy frontend to Vercel (automatic on git push)
2. Choose backend deployment platform
3. Deploy backend
4. Update `VITE_API_URL` in Vercel environment variables
5. Redeploy frontend
