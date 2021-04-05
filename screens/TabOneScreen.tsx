import * as React from 'react';
import { StyleSheet, Button, Pressable } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import MyCanvas from '../components/Canvas';

import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export default function TabOneScreen() {
  const theme = useColorScheme();
  const backgroundColor = Colors[theme];

  enum mods {
    'Position',
    'Destination',
    'Information'
  }

  const [mode, setMode] = React.useState(mods.Position);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonsWrapper: {
      flex: 0.1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 10
    },
    separator: {
      width: 9,
    },
    canvas: {
      marginVertical: 50,
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: Colors[theme].lightMedium
    }
  });

  const onPositionPress = () => {
    setMode(mods.Position);
  }

  const onDestinationPress = () => {
    setMode(mods.Destination);
  }

  const onInformationPress = () => {
    setMode(mods.Information);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsWrapper}>
        <Button
          onPress={onPositionPress}
          title="My position"
          color={mode === mods.Position ? backgroundColor.lightMedium : backgroundColor.darkMedium}
        />
        <View style={styles.separator} />
        <Button
          onPress={onDestinationPress}
          title="Destination"
          color={mode === mods.Destination ? backgroundColor.lightMedium : backgroundColor.darkMedium}
        />
        <View style={styles.separator} />
        <Button
          onPress={onInformationPress}
          title="Information"
          color={mode === mods.Information ? backgroundColor.lightMedium : backgroundColor.darkMedium}
        />
      </View>
      <MyCanvas />
    </View>
  );
}
