import { StatusBar } from 'expo-status-bar';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { StyleSheet, Text, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  //database-------------------
    //had to add database here, since keeping it in separate file didn't work for some reason
  const firebaseConfig = {
    apiKey: "AIzaSyBdxBEQADYvANV7V2mJBjO3cZU-EMhg_Gk",
    authDomain: "reactnativemapproject-29fac.firebaseapp.com",
    projectId: "reactnativemapproject-29fac",
    storageBucket: "reactnativemapproject-29fac.firebasestorage.app",
    messagingSenderId: "411557810879",
    appId: "1:411557810879:web:d085fe912d0c23a4b32c0a"
  };

  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  //----------------------------
  
  const [markerTitle, setTitle] = useState('');
  //const [markers, setMarkers] = useState([]);
  const [values, loading, error] = useCollection(collection(database, "markers"));
  const markers = values?.docs.map((doc) => ({...doc.data(), id: doc.id}));

  const [region, setRegion] = useState({
    latitude: 55.66497,
    longitude: 12.44021,
    latitudeDelta: 0.75,
    longitudeDelta: 0.75
  });

  const mapView = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() =>{
    async function startListening(){
      let { status } = await Location.requestForegroundPermissionsAsync();

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
        setRegion(newRegion);
        if(mapView.current){
          mapView.current.animateToRegion(newRegion)
        }
      }); 
    }

    startListening();

    return () =>{
      if(locationSubscription.current){
        locationSubscription.current.remove();
      }
    }
  }, []);

  async function addMarker(data){
    const {coordinate} = data.nativeEvent;
    const newMarker = {
      coordinate,
      title: "Marker"
    };
    try{
      await addDoc(collection(database, "markers"), newMarker);
    }
    catch(error){
      console.log("Database error: "+error)
    }    
  }

  function onMarkerPressed(text,coordinate){
    alert(text+" pressed!"+
      "\nLatitude: "+coordinate.latitude+
      "\nLongitude: "+coordinate.longitude
    );
    
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={addMarker}
        >
          {markers?.map(marker =>(
            <Marker
              id={marker.id}
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => onMarkerPressed(marker.text,marker.coordinate)}
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
