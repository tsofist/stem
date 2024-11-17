/**
 * @asType number
 * @minimum -90
 * @maximum 90
 */
export type Latitude = number;

/**
 * @asType number
 * @minimum -180
 * @maximum 180
 */
export type Longitude = number;

/**
 * Coordinates (latitude from −90° to +90°, longitude from −180° to +180°)
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system Geographic coordinate system
 */
export type Coordinates2D = [latitude: Latitude, longitude: Longitude];
