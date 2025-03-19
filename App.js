import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [markers, setMarkers] = useState([])

  const [region, setRegion] = useState({
    latitude: 55.66497,
    longitude: 12.44021,
    latitudeDelta: 0.75,
    longitudeDelta: 0.75
  })

  const mapView = useRef(null)
  const locationSubscription = useRef(null)

  useEffect(() =>{
    async function startListening(){
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status !== 'granted'){
        alert("Access denied!")
        return
      }
      locationSubscription.current = await Location.watchPositionAsync({
        distanceInterval: 100,
        accuracy: Location.Accuracy.High
      }, (location) =>{
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.75,
          longitudeDelta: 0.75
        }
        setRegion(newRegion)
        if(mapView.current){
          mapView.current.animateToRegion(newRegion)
        }
      }) 
    }
    startListening()
    return () =>{
      if(locationSubscription.current){
        locationSubscription.current.remove()
      }
    }
  }, [])

  function addMarker(data){
    const {latitude, longitude} = data.nativeEvent.coordinate
    const newMarker = {
      coordinate: {latitude, longitude},
      key: data.timeStamp,
      title: "Marker"
    }
    setMarkers([...markers, newMarker])
  }

  function onMarkerPressed(text,coordinate){
    alert(text+" pressed!"+
      "\nLatitude:"+coordinate.latitude+
      "\nLongitude"+coordinate.longitude
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={addMarker}
        >
          {markers.map(marker =>(
            <Marker
              coordinate={marker.coordinate}
              key={marker.key}
              title={marker.title}
              onPress={() => onMarkerPressed(marker.title,marker.coordinate)}
            />
          ))

          }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
});
