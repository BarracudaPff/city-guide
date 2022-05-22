import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MapView, {LatLng, MAP_TYPES, Marker, Region} from 'react-native-maps';
import Geolocation, {
    GeolocationError,
    GeolocationOptions,
    GeolocationResponse,
} from '@react-native-community/geolocation';
import useWatchLocation from '../utils/hooks/useWatchLocation';
import {getDistance} from 'geolib';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MARKERS_AMOUNT = 10;
const MARKERS_DIF = 0.005;
// 37.33669 -122.0362

// const defaultMarkers = markersFreeDrive

const DisplayLatLng: FC = () => {
    const map = useRef<MapView>(null);
    const [defaultMarkers, setDefaultMarkers] = useState<LatLng[]>([]);
    const [region, setRegion] = useState<Region>({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    let mounted = true;

    const initMarkers = () => {
        Geolocation.getCurrentPosition((position) => {
            const markers: LatLng[] = [];
            for (let i = 0; i < MARKERS_AMOUNT; i++) {
                for (let j = 0; j < MARKERS_AMOUNT; j++) {
                    markers.push({
                        latitude: position.coords.latitude + MARKERS_DIF * (i - 5),
                        longitude: position.coords.longitude + MARKERS_DIF * (j - 5),
                    });
                }
            }

            setDefaultMarkers(markers);
        });
    };

    const toMyLoc = () => {
        Geolocation.getCurrentPosition((position) => {
            defaultMarkers.map(it => ({coords: position.coords, dist: getDistance(position.coords, it)}))
                .sort(({dist: d1}, {dist: d2}) => d1 - d2)
                .forEach((it, index) => {
                    console.log(`You are ${it.dist} meters away from ${index}'st marker.`);
                });

            map.current?.animateToRegion({
                ...region,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }, (error) => {
            console.error(error);
        }, {
            enableHighAccuracy: true,
            timeout: 60000,
        });
    };

    const animateRandom = () => map.current?.animateToRegion(randomRegion());

    const animateRandomCoordinate = () => map.current?.animateCamera({center: randomCoordinate()});

    const animateToRandomBearing = () => map.current?.animateCamera({heading: getRandomFloat(-360, 360)});

    const getRandomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

    const randomCoordinate = () => ({
        latitude: region.latitude + (Math.random() - 0.5) * (region.latitudeDelta / 2),
        longitude: region.longitude + (Math.random() - 0.5) * (region.longitudeDelta / 2),
    });

    const randomRegion = () => ({...region, ...randomCoordinate()});

    const jumpRandom = () => setRegion(randomRegion());

    const animateToRandomViewingAngle = () => map.current?.animateCamera({pitch: getRandomFloat(0, 90)});

    const onEvent = (position: GeolocationResponse) => {
        console.log(`Watching  at ${position.timestamp}.`);

        if (defaultMarkers.length > 0) {
            const markers = defaultMarkers.map(it => ({
                coords: position.coords,
                dist: getDistance(position.coords, it),
            })).sort(({dist: d1}, {dist: d2}) => d1 - d2);
            const marker = markers[0]

            if (marker.dist < 100) {
                // Toast
                Alert.alert("Triggered place.")
            }

            console.log(`Near marker ${marker.coords.latitude} ${marker.coords.longitude}. Distance ${marker.dist}m.`);
        }
    };

    useEffect(() => {
        Geolocation.getCurrentPosition(onEvent);
        const watchId = Geolocation.watchPosition(onEvent, undefined, {
            enableHighAccuracy: true
        });

        return () => Geolocation.clearWatch(watchId);
    }, [defaultMarkers]);

    return (
        <View style={styles.container}>
            <MapView
                // provider={this.props.provider}
                ref={map}
                style={styles.map}
                mapType={MAP_TYPES.STANDARD}

                showsUserLocation
                showsCompass
                showsScale
                showsMyLocationButton={false}
                loadingEnabled
                scrollEnabled

                initialRegion={region}
                onRegionChange={setRegion}>
                {defaultMarkers.map((it, index) => (
                    <Marker key={index} coordinate={it} draggable/>
                ))}
            </MapView>
            <View style={[styles.bubble, styles.latlng]}>
                <Text style={styles.centeredText}>
                    {region.latitude.toPrecision(7)},
                    {region.longitude.toPrecision(7)}
                </Text>
                <Button title={'To my location'} onPress={toMyLoc}/>
                <Button title={'Init markers'} onPress={initMarkers}/>
            </View>
            <View style={styles.buttonContainer}>
                {/*<TouchableOpacity*/}
                {/*    onPress={jumpRandom}*/}
                {/*    style={[styles.bubble, styles.button]}>*/}
                {/*    <Text style={styles.buttonText}>Jump</Text>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    onPress={animateRandom}
                    style={[styles.bubble, styles.button]}>
                    <Text style={styles.buttonText}>Animate (Region)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={animateRandomCoordinate}
                    style={[styles.bubble, styles.button]}>
                    <Text style={styles.buttonText}>Animate (Coordinate)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={animateToRandomBearing}
                    style={[styles.bubble, styles.button]}>
                    <Text style={styles.buttonText}>Animate (Bearing)</Text>
                </TouchableOpacity>
                {/*<TouchableOpacity*/}
                {/*    onPress={animateToRandomViewingAngle}*/}
                {/*    style={[styles.bubble, styles.button]}>*/}
                {/*    <Text style={styles.buttonText}>Animate (View Angle)</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>
        </View>
    );
};
// class DisplayLatLng extends React.Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             region: {
//                 latitude: LATITUDE,
//                 longitude: LONGITUDE,
//                 latitudeDelta: LATITUDE_DELTA,
//                 longitudeDelta: LONGITUDE_DELTA,
//             },
//         };
//     }
//
//     onRegionChange(region) {
//         this.setState({ region });
//     }
//
//     jumpRandom() {
//         this.setState({ region: this.randomRegion() });
//     }
//
//     animateRandom() {
//         this.map.animateToRegion(this.randomRegion());
//     }
//
//     animateRandomCoordinate() {
//         this.map.animateCamera({ center: this.randomCoordinate() });
//     }
//
//     animateToRandomBearing() {
//         this.map.animateCamera({ heading: this.getRandomFloat(-360, 360) });
//     }
//
//     animateToRandomViewingAngle() {
//         this.map.animateCamera({ pitch: this.getRandomFloat(0, 90) });
//     }
//
//     getRandomFloat(min, max) {
//         return Math.random() * (max - min) + min;
//     }
//
//     randomCoordinate() {
//         const region = this.state.region;
//         return {
//             latitude:
//                 region.latitude + (Math.random() - 0.5) * (region.latitudeDelta / 2),
//             longitude:
//                 region.longitude + (Math.random() - 0.5) * (region.longitudeDelta / 2),
//         };
//     }
//
//     randomRegion() {
//         return {
//             ...this.state.region,
//             ...this.randomCoordinate(),
//         };
//     }
//
//     render() {
//     }
// }

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
    centeredText: {textAlign: 'center'},
});

export default DisplayLatLng;
