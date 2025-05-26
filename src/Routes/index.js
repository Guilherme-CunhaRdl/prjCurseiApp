import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from '../context/themeContext';

import StackRoutes from './routesStack';

export default function Routes() {
  return (
    <ThemeProvider>
    <NavigationContainer>
       <StackRoutes/>
    </NavigationContainer>  
    </ThemeProvider>
  );
}