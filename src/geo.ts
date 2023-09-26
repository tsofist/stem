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
 * @see https://ru.wikipedia.org/wiki/%D0%93%D0%B5%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5_%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82%D1%8B Географические координаты
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system Geographic coordinate system
 */
export type Coordinates2D = [latitude: Latitude, longitude: Longitude];
