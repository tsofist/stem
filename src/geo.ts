import type { Float } from './number/float/types';

/**
 * Latitude value
 *
 * @asType number
 * @minimum -90
 * @maximum 90
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system Geographic coordinate system
 */
export type Latitude = number;

/**
 * Longitude value
 *
 * @asType number
 * @minimum -180
 * @maximum 180
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system Geographic coordinate system
 */
export type Longitude = number;

/**
 * Coordinates (latitude from −90° to +90°, longitude from −180° to +180°)
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system Geographic coordinate system
 */
export type Coordinates2D = [latitude: Latitude, longitude: Longitude];

/**
 * Geographic position information.
 *
 * @see https://pub.dev/documentation/geolocator/latest/geolocator/Position-class.html Geolocator > Position
 */
export type GeopositionInfo = {
    /**
     * Geographic coordinates
     * @see Coordinates2D
     */
    coordinates: {
        /** Latitude value */
        latitude: Latitude;
        /** Longitude value */
        longitude: Longitude;
        /** Estimated horizontal accuracy of the position in meters */
        accuracy?: Float;
    };
    /** Altitude information */
    altitude?: {
        /** Altitude value above sea level in meters */
        value: Float;
        /** Estimated vertical accuracy of the position in meters */
        accuracy?: Float;
    };
    /** Direction information */
    heading?: {
        /** Heading in which the device is traveling in degrees */
        value: Float;
        /** Estimated heading accuracy of the position in degrees */
        accuracy?: Float;
    };
    /** Speed information */
    speed?: {
        /** Speed at which the devices are traveling in meters per second over ground */
        value: Float;
        /** Estimated speed accuracy of this position, in meters per second */
        accuracy?: Float;
    };
};
