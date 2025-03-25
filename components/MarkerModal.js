import { useState } from "react";
import { Modal, TextInput, View } from "react-native";

function MarkerModal(props){

    const [title, setTitle] = useState("");

    function markerInputHandler(text){
        setTitle(text);
    }

    function addMarkerHandler(){
        props.onAddMarker(title);
    }

    return (
        <Modal visible={props.visible} animationType="none">
            <View>
                
            </View>
        </Modal>
    );
}