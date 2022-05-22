import React, {FC} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {MAP_TYPES} from 'react-native-maps';
import DisplayLatLng from './DisplayLatLng';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen: FC = () => {
    // Geolocation.getCurrentPosition(info => console.log(info), undefined, {
    //     enableHighAccuracy: true,
    // });
    // const {location, error} = useCurrentLocation({
    //     enableHighAccuracy: true,
    // })

    // console.log(location, error);

    return (
        <DisplayLatLng/>
        // <View style={styles.container}>
        //     <MapView
        //         provider={this.props.provider}
        //         ref={ref => {
        //             this.map = ref;
        //         }}
        //         mapType={MAP_TYPES.TERRAIN}
        //         style={styles.map}
        //         initialRegion={this.state.region}
        //         onRegionChange={region => this.onRegionChange(region)}
        //     />
        //     <View style={[styles.bubble, styles.latlng]}>
        //         <Text style={styles.centeredText}>
        //             {this.state.region.latitude.toPrecision(7)},
        //             {this.state.region.longitude.toPrecision(7)}
        //         </Text>
        //     </View>
        //     <View style={styles.buttonContainer}>
        //         <TouchableOpacity
        //             onPress={() => this.jumpRandom()}
        //             style={[styles.bubble, styles.button]}
        //         >
        //             <Text style={styles.buttonText}>Jump</Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => this.animateRandom()}
        //             style={[styles.bubble, styles.button]}
        //         >
        //             <Text style={styles.buttonText}>Animate (Region)</Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => this.animateRandomCoordinate()}
        //             style={[styles.bubble, styles.button]}
        //         >
        //             <Text style={styles.buttonText}>Animate (Coordinate)</Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => this.animateToRandomBearing()}
        //             style={[styles.bubble, styles.button]}
        //         >
        //             <Text style={styles.buttonText}>Animate (Bearing)</Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => this.animateToRandomViewingAngle()}
        //             style={[styles.bubble, styles.button]}
        //         >
        //             <Text style={styles.buttonText}>Animate (View Angle)</Text>
        //         </TouchableOpacity>
        //     </View>
        // </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 100,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    buttonText: {
        textAlign: 'center',
    },
    centeredText: { textAlign: 'center' },
});

export default MapScreen;
