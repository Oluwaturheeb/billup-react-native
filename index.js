import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  Provider as PaperProvider,
  configureFonts,
  MD2LightTheme,
} from 'react-native-paper';
import {pry, sec} from './components/colors';

const font = {
  titleSmall: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  titleMedium: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleLarge: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  bodySmall: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 12,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  bodyLarge: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  default: 'Alegreya-Regular',
};
const theme = {
  ...MD2LightTheme,
  fonts: configureFonts({config: font, isV3: false}),
  roundness: 5,
  colors: {
    ...MD2LightTheme.colors,
    primary: pry,
    text: 'red',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
