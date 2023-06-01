import React, {useEffect, useState, useRef} from 'react';
import { PitchDetector } from 'react-native-pitch-detector';
import { LineChart, Grid } from 'react-native-svg-charts'

import {
 ScrollView,
 StatusBar,
 StyleSheet,
 Text,
 useColorScheme,
 View,
} from 'react-native';


import {
 Colors,
} from 'react-native/Libraries/NewAppScreen';


function App(): JSX.Element {
  const [data, setData] = useState( { tone: "", frequency: 0} );
  const dataArray = useRef(new Array(100).fill(undefined));

  dataArray.current.push(data?.frequency === 0 ? undefined : Number(data?.frequency?.toFixed(1)));
  dataArray.current.shift();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const start = async () => {
    await PitchDetector.start();
  };


  const stop = async () => {
    await PitchDetector.stop();
  };

  useEffect(() => {
    start();
    const subscription = PitchDetector.addListener(setData);

    return () => {
      PitchDetector.removeListener(subscription);
      stop();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(data);
      setData( { tone: "", frequency: 0} );
    }, 50);

    return () => {
      clearInterval(interval);
    };

  }, [data])

 return (
   <>
     <StatusBar backgroundColor="#222222" />
     <View style={styles.navBar}>
       <Text style={styles.title}>Vocal Pitch Monitor</Text>
     </View>
     <View style={styles.pitch}>
       <Text style={styles.pitchText}>{data?.tone}</Text>
     </View>
     <LineChart
        style={{ height: "90%" }}
        data={dataArray.current}
        svg={{ stroke: 'rgb(134, 65, 244)' }}
        yMin={100}
        yMax={250}
        contentInset={{ top: 20, bottom: 20 }}
      >
        <Grid />
    </LineChart>
   </>


 );
}

const styles = StyleSheet.create({
 navBar: {
   backgroundColor: '#222222',
   height: 40,
   justifyContent: 'center',
   alignItems: 'center',
 },
 title: {
   color: '#fff',
   fontSize: 20,
   fontWeight: 'bold',
 },
 pitch: {
   backgroundColor: '#2298aa',
   height: '5%',
   justifyContent: 'center',
   alignItems: 'center',
 },
 pitchText: {
   color: '#fff',
   fontSize: 20,
   fontWeight: 'bold',
 }
});


export default App;





