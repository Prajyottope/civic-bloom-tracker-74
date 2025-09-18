# Clean & Green Technology - Deployment Guide

This guide will help you make this project completely independent and ready for production deployment.

## Step 1: Environment Setup

1. **Create Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Supabase** (Required for database functionality)
   - Create a new Supabase project at https://supabase.com
   - Get your project URL and API keys
   - Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Step 2: Database Setup

1. **Run the included migrations** in your Supabase project:
   - Navigate to your Supabase dashboard
   - Go to SQL Editor
   - Run the migrations found in `supabase/migrations/` folder in chronological order

2. **Set up Row Level Security (RLS)**
   - The migrations include RLS policies
   - Verify they're properly applied in your Supabase dashboard

## Step 3: Customize the Application

1. **Branding**
   - Update the app name in `src/pages/Index.tsx`
   - Replace logos and icons in `public/` folder
   - Modify color scheme in `src/index.css` and `tailwind.config.ts`

2. **Remove Demo Content**
   - All demo credentials have been removed
   - Add your own municipal team data through the Supabase dashboard

3. **Update README.md**
   - Replace repository URLs
   - Add your own project information
   - Update deployment instructions for your hosting platform

## Step 4: Production Configuration

1. **Build Configuration**
   ```bash
   npm run build
   ```

2. **Test Production Build**
   ```bash
   npm run preview
   ```

3. **Environment Variables for Production**
   - Set up your production environment variables
   - Ensure Supabase keys are configured correctly
   - Configure any additional services (email, storage, etc.)

## Step 5: Deployment Options

### Option A: Vercel (Recommended)
1. Connect your Git repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on each push

### Option B: Netlify
1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Option C: Self-Hosted
1. Build the application: `npm run build`
2. Serve the `dist` folder using any static file server
3. Configure reverse proxy if needed

## Step 6: Domain and SSL

1. **Custom Domain**
   - Configure your custom domain in your hosting provider
   - Update CORS settings in Supabase for your domain

2. **SSL Certificate**
   - Most hosting providers handle SSL automatically
   - Ensure HTTPS is enforced for security

## Step 7: Monitoring and Maintenance

1. **Error Monitoring**
   - Consider integrating error tracking (Sentry, LogRocket, etc.)
   - Monitor application performance

2. **Database Backups**
   - Supabase handles backups automatically
   - Consider additional backup strategies for critical data

3. **Updates and Security**
   - Regularly update dependencies
   - Monitor Supabase for security updates
   - Keep the application updated

## Step 8: Going Live Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies verified
- [ ] Custom branding applied
- [ ] Demo content removed
- [ ] Production build tested
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Error monitoring setup
- [ ] Backup strategy in place

## Additional Customizations

### Adding New Features
- Create new components in `src/components/`
- Add new pages in `src/pages/`
- Extend database schema through Supabase migrations

### Styling Customization
- Modify design tokens in `src/index.css`
- Update Tailwind configuration in `tailwind.config.ts`
- Customize component variants in `src/components/ui/`

### Integration Options
- Email service for notifications
- SMS service for alerts
- File storage for larger attachments
- Analytics for usage tracking

## Support and Documentation

- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- Supabase: https://supabase.com/docs
- Shadcn/UI: https://ui.shadcn.com/

This application is now completely independent and ready for production use with your own infrastructure and branding.