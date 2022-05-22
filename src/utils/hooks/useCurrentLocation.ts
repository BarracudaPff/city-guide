import {useState, useEffect} from 'react';
import {GeolocationError, GeolocationOptions, GeolocationResponse} from '@react-native-community/geolocation';
import Geolocation from '@react-native-community/geolocation';
import {Location} from './types';

const useCurrentLocation = (options:GeolocationOptions = {}) => {
    // store location in state
    const [location, setLocation] = useState<Location>();
    // store error message in state
    const [error, setError] = useState<string>();

    // Success handler for geolocation's `getCurrentPosition` method
    const handleSuccess = (pos: GeolocationResponse) => setLocation(pos.coords);

    // Error handler for geolocation's `getCurrentPosition` method
    const handleError = (error:  GeolocationError) => {
        setError(error.message);
    };

    useEffect(() => {
        // If the geolocation is not defined in the used browser we handle it as an error
        if (!Geolocation) {
            setError('Geolocation is not supported.');
            return;
        }

        // Call Geolocation API
        Geolocation.getCurrentPosition(handleSuccess, handleError, options);
    }, [options]);

    return {location, error};
};

export default useCurrentLocation;
