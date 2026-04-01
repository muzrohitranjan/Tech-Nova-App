# 🍳 Modern Cooking & Recipe Management App

### Developed by Lavanya J

This is a high-fidelity React prototype for a Cultural Recipe Documentation and Guided Cooking application. It features AI-powered recipe extraction, a community moderation flow, and an immersive step-by-step cooking mode.

---

## 🚀 How to Run the App on Windows

Follow these steps to get the project running on your laptop:

### 1. Install Node.js

If you don't have it yet, download and install the **LTS version** from:
https://nodejs.org/

### 2. Extract and Open

* Unzip the project folder
* Open **Command Prompt** or **PowerShell**
* Navigate to the project folder:
  cd path/to/your/extracted-folder

### 3. Install Dependencies

Run this command to download all the necessary UI libraries (Ant Design, Icons, Router):

npm install

---

# 🧪 Application Test Plan & Validation Guide

This document outlines the end-to-end functional validation scenarios for the application. Each test case includes actions and expected outcomes to ensure feature completeness, UX consistency, and system integrity.

---

## 🚀 Test 1: Global Boot & Strict Login

**Action:**
Refresh your browser on any page (e.g., localhost:3000/login)

**Expected Result:**
The orange/magenta gradient Splash Screen appears as a global overlay for 2.5 seconds before fading out to reveal the page.

**Action:**
Try logging in with a random email and password

**Expected Result:**
An error message appears stating "Invalid email or password"

**Action:**
Log in with [user@test.com](mailto:user@test.com) and password user

**Expected Result:**
A success message appears, and you are taken to the standard User Dashboard.

---

## 🔐 Test 2: Onboarding & Mandatory Verification

**Action:**
Logout and click "Sign up". Fill in the details and click "Create Account"

**Expected Result:**
You are taken to the Verify Your Email screen. The "Continue (Demo)" button is gone.

**Action:**
Click "I have clicked the link"

**Expected Result:**
The button displays a loading spinner and "Checking status..." for 2 seconds before showing a success checkmark and redirecting you.

---

## 📄 Test 3: Interactive Uploads & AI Extraction

**Action:**
Tap the Add (+) tab and select Upload Document

**Expected Result:**
The "Extract Recipe using AI" button is greyed out and disabled.

**Action:**
Tap the dashed box and select a file from your computer

**Expected Result:**
A success toast appears, the box turns green, and the "Extract Recipe" button turns bright orange and becomes clickable.

**Action:**
Go back and try Record Voice. Tap the orange circle to record, then tap again to stop

**Expected Result:**
The timer stops, and the "Transcribe & Extract" button becomes active only after the recording is finished.

---

## 🔍 Test 4: User Search, Filters, & UI Fixes

**Action:**
Tap the Recipes tab

**Action:**
Enter a search term (e.g., "Tacos") or use the Filter icon to select a cuisine (e.g., "Mexican") and click "Apply Filters"

**Expected Result:**
The list dynamically updates to show only matching recipes. A yellow badge appears on the filter icon showing the number of active filters.

**Action:**
Click on "Authentic Mexican Tacos" to open the detail view

**Expected Result:**
Scroll to the bottom. The "Prepare to Cook" button is now fully visible and sits beautifully above the bottom navigation bar.

---

## 🍳 Test 5: Cooking Mode & Voice Synthesis

**Action:**
From the Recipe Detail, click "Prepare to Cook" and then "Start Cooking"

**Expected Result:**
You enter the new step-by-step Cooking Mode with a progress bar and navigation dots.

**Action:**
Click the blue "Voice Hint" button

**Expected Result:**
Your browser actually speaks the current cooking step out loud.

**Action:**
Tap the "Next Step" button until you reach the end

**Expected Result:**
You see the new "Master Chef" completion screen with your 5-star rating and achievement badges.

---

## ⚙️ Test 6: Settings Persistence & Security

**Action:**
Go to Profile > Settings. Toggle Dark Mode on and change the Font Size to "Large"

**Expected Result:**
The UI theme and text scale update instantly.

**Action:**
Refresh your browser

**Expected Result:**
The app reloads with your Dark Mode and Large Font settings still active.

**Action:**
Click "Change Password". Enter a simple password like "123"

**Expected Result:**
The checklist below shows red "X" icons because the password doesn't meet the Regex requirements (min 8 chars, uppercase, lowercase, and number).

**Action:**
Enter a strong password (e.g., "Heritage2026")

**Expected Result:**
All requirements show green checkmarks.

---

## 🛠️ Test 7: Admin Moderate Logic

**Action:**
Logout and login as [admin@test.com](mailto:admin@test.com) with password admin

**Action:**
Go to Moderate Recipes and click the green "Approve" button on a recipe

**Expected Result:**
A success toast appears. Go back to the Admin Dashboard. The "Pending Review" count has decreased, and "Approved Recipes" has increased.

---

## ✅ Summary

This test suite ensures:

* Authentication strictness
* End-to-end onboarding validation
* AI-assisted feature enablement
* Dynamic UI responsiveness
* State persistence across sessions
* Role-based administrative workflows
