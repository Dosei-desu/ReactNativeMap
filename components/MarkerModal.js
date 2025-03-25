import { useState } from "react";
import { Modal, TextInput, View } from "react-native";

//started making this bug got stuck trying to get the read functionality of database to work,
//so I put it on halt for now

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