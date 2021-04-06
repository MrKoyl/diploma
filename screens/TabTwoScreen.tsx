import * as React from 'react';
import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, ScrollView, View } from '../components/Themed';

export default function TabTwoScreen({ store }) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{store.title}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {
          store.map((component, key) => { // { tag: 'string', content: 'string' }
            switch(component.tag) {
              case 'Text': return <Text key={key} style={styles.text}>{component.content}</Text>
              case 'Image': return <Image key={key} style={styles.image} source={{ uri: component.content }} />
            }
          })
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    marginBottom: 10,
  }
});
