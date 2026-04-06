# Onboarding Implementation Guide

## Overview
The onboarding system now persists the Welcome page until all 3 phases are completed. Users cannot skip or bypass the onboarding process.

## What Changed

### Backend Changes

#### 1. User Model (`backend/app/models/user.py`)
Added three boolean fields to track onboarding completion:
- `onboarding_phase_1_complete` - Personal data completed
- `onboarding_phase_2_complete` - Medical method selected
- `onboarding_phase_3_complete` - First medical record added

#### 2. New API Endpoints (`backend/app/routers/me.py`)
Added two new endpoints:
- `GET /users/me/onboarding` - Returns current onboarding status
- `POST /users/me/onboarding/phase/{phase_number}/complete` - Marks a phase as complete

### Frontend Changes

#### 1. API Client (`frontend/api-client.ts`)
Added two new methods:
- `getOnboardingStatus()` - Fetches onboarding status
- `completeOnboardingPhase(phaseNumber)` - Marks a phase complete

#### 2. WelcomePage Component (`frontend/components/WelcomePage.tsx`)
- Now fetches and displays onboarding progress
- Shows checkmarks for completed phases
- Displays progress bar and step count
- Prevents early navigation to dashboard
- Auto-redirects to dashboard when all 3 phases complete
- Shows "Go" buttons only for current and completed phases

#### 3. PersonalDataPage (`frontend/components/PersonalDataPage.tsx`)
- Marks Phase 1 complete after successful save
- Redirects back to welcome page (not directly to method selection)

#### 4. MethodSelectionPage (`frontend/components/MethodSelectionPage.tsx`)
- Marks Phase 2 complete before navigating to OCR or Manual form
- Removed "Skip for now" option to enforce completion

#### 5. Medical Data Forms
Updated all forms that add medical data to mark Phase 3 complete:
- `AddVaccinePage.tsx`
- `AddMedicationPage.tsx`
- `AddSurgeryPage.tsx`

### Database Migration

#### Migration Script (`backend/add_onboarding_columns.py`)
Run this script to add the onboarding columns to your existing database:

```bash
# If PostgreSQL
python backend/add_onboarding_columns.py

# Or if using with Docker
docker-compose exec backend python add_onboarding_columns.py
```

## Three Phases Explained

### Phase 1: Datos Personales (Personal Data)
- **Requirement**: User must fill at least the required fields:
  - Full name
  - Birth date (optional but checked)
  - Blood type
  - Identity card
  - Address
  - Emergency contact info
- **Completion**: Marked complete when PersonalDataPage saves successfully
- **Next Step**: Redirects to welcome page to show phase 2 is available

### Phase 2: Método de Ficha Médica (Medical Method)
- **Requirement**: User must choose either OCR or Manual entry
- **Completion**: Marked complete when user selects a method on MethodSelectionPage
- **Next Step**: Proceeds to OCR upload or Manual form depending on selection

### Phase 3: Tu Primera Ficha Médica (First Medical Record)
- **Requirement**: User must add at least one medical item (vaccine, medication, or surgery)
- **Completion**: Marked complete when first medical item is successfully added
- **Next Step**: Auto-redirects from welcome page to dashboard after all phases complete

## User Flow

1. **User Logs In** → Welcome Page
2. **Welcome Page** fetches onboarding status and shows progress
3. **Phase 1**: User clicks "Comenzar" → PersonalDataPage
4. **Personal Data Saved** → Phase 1 marked complete → Redirects to Welcome Page
5. **Welcome Page** shows Phase 2 available → User clicks "Ir" on Phase 2
6. **Phase 2**: User selects method → Phase 2 marked complete → Goes to OCR or Manual form
7. **Phase 3**: User adds medical data → Phase 3 marked complete → Welcome Page redirects to Dashboard
8. **Dashboard**: User can now access all features

## Testing

### Manual Testing Steps

1. **Test Phase 1 Completion**:
   - Create a new account
   - Login
   - Fill personal data form
   - Save
   - Should see Phase 1 marked as complete on Welcome page
   - Progress bar should show ~33%

2. **Test Phase 2 Completion**:
   - Click "Ir" on Phase 2
   - Select either OCR or Manual method
   - Should proceed and mark Phase 2 complete
   - Progress bar should show ~67%

3. **Test Phase 3 Completion**:
   - Add a vaccine or medication
   - Should mark Phase 3 complete
   - Welcome page should auto-redirect to Dashboard
   - All phases should show with checkmarks

4. **Test Prevention of Skipping**:
   - Login as a new user
   - Try to navigate directly to `/dashboard`
   - Should be redirected to welcome page
   - Try to skip Phase 2 without filling Phase 1
   - Should not be able to access Phase 2 options

### Database Verification

Check that columns were added:

```sql
-- For PostgreSQL
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name LIKE 'onboarding%';

-- For SQLite
PRAGMA table_info(users);
```

## Rollback (If Needed)

If you need to reset a user's onboarding status:

```sql
-- Reset all phases for a user
UPDATE users 
SET 
  onboarding_phase_1_complete = FALSE,
  onboarding_phase_2_complete = FALSE,
  onboarding_phase_3_complete = FALSE
WHERE id = <user_id>;

-- Or reset all users
UPDATE users 
SET 
  onboarding_phase_1_complete = FALSE,
  onboarding_phase_2_complete = FALSE,
  onboarding_phase_3_complete = FALSE;
```

## Notes

- The onboarding status is stored permanently in the database
- Once a phase is marked complete, it stays complete (no way to uncomplete it in the current implementation)
- The welcome page fetches status on every visit to ensure it's up-to-date
- If a phase endpoint fails, the error is logged but doesn't prevent the user from continuing
- All existing users will have all phases as incomplete (default FALSE)

## Future Enhancements

- [ ] Add ability for admins to reset user onboarding
- [ ] Add analytics to track which phase users drop off at
- [ ] Add option to edit onboarding preferences
- [ ] Add skippable phases for returning users
- [ ] Add progress persistence to backend storage
