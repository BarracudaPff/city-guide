import {useEffect, useRef, useState} from 'react';
import {Location} from './types';
import Geolocation, {
    GeolocationError,
    GeolocationOptions,
    GeolocationResponse,
} from '@react-native-community/geolocation';

const useWatchLocation = (options:GeolocationOptions = {}) => {
    // store location in state
    const [location, setLocation] = useState<Location>();
    // store error message in state
    const [error, setError] = useState<string>();
    // save the returned id from the geolocation's `watchPosition` to be able to cancel the watch instance
    const locationWatchId = useRef<number>(null);

    // Success handler for geolocation's `watchPosition` method
    const handleSuccess = (pos: GeolocationResponse) => setLocation(pos.coords);

    // Error handler for geolocation's `watchPosition` method
    const handleError = (error: GeolocationError) => {
        setError(error.message);
    };

    // Clears the watch instance based on the saved watch id
    const cancelLocationWatch = () => {
        if (locationWatchId.current && Geolocation) {
            Geolocation.clearWatch(locationWatchId.current);
        }
    };

    useEffect(() => {
        // If the geolocation is not defined in the used browser we handle it as an error
        if (!Geolocation) {
            setError('Geolocation is not supported.');
            return;
        }

        // @ts-ignore
        // Start to watch the location with the Geolocation API
        locationWatchId.current = Geolocation.watchPosition(handleSuccess, handleError, options);

        // Clear the location watch instance when React unmounts the used component
        return cancelLocationWatch;
    }, [options]);

    return {location, cancelLocationWatch, error};
};

export default useWatchLocation;
