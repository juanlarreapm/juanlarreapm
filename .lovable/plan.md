

## Fix Forgot Password Flow

### Problem
The current password reset redirects to `/auth?reset=true`, which auto-logs the user in without letting them set a new password.

### Changes

**1. Create `/reset-password` page** (`src/pages/ResetPassword.tsx`)
- Form with "New Password" and "Confirm Password" fields
- On mount, listen for `PASSWORD_RECOVERY` event via `onAuthStateChange`
- On submit, call `supabase.auth.updateUser({ password })` to save the new password
- Show success message and redirect to `/admin`
- Handle error/expired link states

**2. Update redirect URL in Auth.tsx** (line ~58)
- Change `redirectTo` from `/auth?reset=true` to `/reset-password`

**3. Add route in App.tsx**
- Add `<Route path="/reset-password" element={<ResetPassword />} />`

### Technical Details

The reset password page will:
- Use `onAuthStateChange` to detect the `PASSWORD_RECOVERY` event (triggered when user clicks the email link)
- Validate that both password fields match and meet minimum length (6 chars)
- Call `updateUser({ password })` to finalize the reset
- Reuse existing Layout, Input, Button, and Label components
- Show appropriate error states if the link is expired or invalid

