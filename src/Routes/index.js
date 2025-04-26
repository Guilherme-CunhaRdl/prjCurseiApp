import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";

import StackRoutes from './routesStack';

export default function Routes() {
  return (
    <NavigationContainer>
       <StackRoutes/>
    </NavigationContainer>  
  );
}