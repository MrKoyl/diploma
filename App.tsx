import { StatusBar } from 'expo-status-bar';
import * as Redux from 'react-redux';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const store = Redux.createStore([])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Redux.Provide store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Redux.Provide>
    );
  }
}
