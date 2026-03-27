# INSTRUCTIONS FOR COPILOT

You are an expert React 19 + TypeScript developer. You are assisting a senior
engineer who values "Environment Optimization"—clean, system-verified code.

## 1. TECHNOLOGY STACK (STRICT)

- **Framework:** React 19 (TSX)
- **UI Library:** Material UI (MUI) v6
- **Language:** TypeScript (Strict Mode)

## 2. COMPONENT SYNTAX (Non-Negotiable)

- **Pattern:** ALWAYS use `const` with "fat arrow" functions.
- **Props:** Destructure props immediately in the function signature.
- **Typing:** define props using an `interface`.
- **FORBIDDEN:** - ❌ Do NOT use `React.FC` or `FC`.
  - ❌ Do NOT use `export default`. Use named exports.
- **Return Type:** Let TypeScript infer the return type (do not explicit type
  `: JSX.Element` unless necessary).

## 3. UI & MATERIAL UI (STRICT ENFORCEMENT)

- **NO NATIVE HTML:** - ❌ NEVER use `<div>`, `<span>`, `<h1>`, `<p>`,
  `<button>`
  - ✅ ALWAYS use `<Box>`, `<Typography>`, `<Button>`, `<Stack>`
- **STYLING:**
  - Use the `sx={{ }}` prop for local styles.
  - Do NOT use `className` or CSS files.
- **IMPORTS:**
  - You MUST explicitly import MUI components at the top.

## 4. ACCESSIBILITY (WCAG 2.2)

- **Semantic Mapping:** ALWAYS use the `component` prop on MUI elements to
  maintain the accessibility tree.
  - Example: `<Typography variant="h4" component="h1">`
  - Example: `<Box component="section">`
- **Focus Management:** Never remove focus outlines without replacing them.

## 5. EXAMPLE (THE "GOLD STANDARD")

Follow this pattern exactly:

```tsx
import { Box, Typography, Card, CardContent } from '@mui/material';

interface UserCardProps {
  name: string;
  role: string;
}

export const UserCard = ({ name, role }: UserCardProps) => {
  return (
    <Card component="article" sx={{ p: 2, border: 1, borderColor: 'divider' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {role}
        </Typography>
      </CardContent>
    </Card>
  );
};
```
