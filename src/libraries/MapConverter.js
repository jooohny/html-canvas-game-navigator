import {
    x,
    y,
    angle,
} from '../Helpers/coords';

export default class MapConverter {
    constructor({
        origin, measurePoint, measureValue, prescale, scale, windowHeight,
    }) {
        const windowCoeff = windowHeight / 576;
        this._origin = origin.map((value, dimension) => dimension === angle ? value : (value / prescale) * scale * windowCoeff);
        this._coeff = ((measurePoint[x] - origin[x] - measurePoint[y] + origin[y]) / 2 / measureValue / prescale) * scale * windowCoeff;
        this.scale = scale;
    }

    globalToLocal(coords, divider = 1) {
        const newArr = coords.map((value, dimension) => {
            switch (dimension) {
                case y:
                    return (this._origin[dimension] - value * this._coeff) / divider;
                case angle:
                    return -value;
                default:
                    return (this._origin[dimension] + value * this._coeff) / divider;
            }
        });
        return newArr;
    }

    localToGlobal(coords) {
        return coords.map((value, dimension) => {
            switch (dimension) {
                case y:
                    return (this._origin[dimension] - value) / this._coeff;
                case angle:
                    return -value;
                default:
                    return (value - this._origin[dimension]) / this._coeff;
            }
        });
    }
}
