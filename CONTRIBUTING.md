# Contributing to Clean & Green Technology

Thank you for your interest in contributing to this civic issue management platform!

## Getting Started

1. **Fork the repository**
2. **Clone your fork** 
   ```bash
   git clone https://github.com/yourusername/clean-green-technology.git
   cd clean-green-technology
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```
5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Use semantic HTML and ARIA labels
- Implement responsive design principles

### Component Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── integrations/       # External service integrations
```

### Database Changes
- Create migrations for schema changes
- Include RLS policies for new tables
- Test security policies thoroughly
- Document API changes

## Submitting Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise commit messages
   - Include tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build    # Ensure build succeeds
   npm run preview  # Test production build
   ```

4. **Submit a pull request**
   - Describe your changes clearly
   - Include screenshots for UI changes
   - Reference any related issues

## Feature Requests

We welcome feature suggestions! Please:
- Check existing issues first
- Provide clear use cases
- Consider implementation complexity
- Discuss with maintainers before large changes

## Bug Reports

When reporting bugs, include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and device information
- Screenshots or error messages

## Questions?

Feel free to open an issue for any questions about contributing!