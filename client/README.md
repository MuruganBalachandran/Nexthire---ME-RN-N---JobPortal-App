# Job Portal React Native App

A comprehensive job portal application built with React Native, featuring role-based navigation for job seekers and recruiters.

## Features

- **Authentication System**: Login, signup, and profile setup
- **Role-based Navigation**: Separate flows for job seekers and recruiters
- **Job Management**: Browse, search, and apply for jobs
- **Application Tracking**: Monitor application status
- **Recruiter Dashboard**: Post jobs and manage applications
- **Modern UI**: Clean, responsive design with consistent styling

## Project Structure

```
src/
├── navigation/          # Navigation setup
│   ├── AppNavigator.js       # Main navigation controller
│   ├── AuthNavigator.js      # Authentication screens
│   ├── JobSeekerNavigator.js # Job seeker screens
│   └── RecruiterNavigator.js # Recruiter screens
├── screens/             # All app screens
│   ├── auth/            # Authentication screens
│   ├── jobseeker/       # Job seeker specific screens
│   └── recruiter/       # Recruiter specific screens
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── context/            # Context providers
├── services/           # API service layer
├── utils/              # Helper functions
└── styles/             # Global styles and themes
```

## Getting Started

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Dependencies

### Core Navigation
- `@react-navigation/native` - Core navigation library
- `@react-navigation/stack` - Stack navigator for authentication
- `@react-navigation/bottom-tabs` - Tab navigator for main app
- `react-native-screens` - Native screen components
- `react-native-gesture-handler` - Gesture handling
- `react-native-reanimated` - Smooth animations

### Storage & Utilities
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-vector-icons` - Icon library

## Configuration

### Babel Configuration
The app uses react-native-reanimated plugin for smooth animations:
```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

## Mock Data

The app currently uses mock data for development:
- Users: `src/services/mockData.js`
- Jobs: Comprehensive job listings
- Applications: Sample applications with various statuses

## Development Notes

- The app uses a hierarchical navigation structure with authentication flow
- All styling is centralized in the `src/styles/` directory
- Context providers manage global state (authentication and app-wide state)
- Mock data is available for testing all features

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **iOS build issues**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

3. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
