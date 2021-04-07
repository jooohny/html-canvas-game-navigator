const x = 0, y = 1, z = 2, angle = 3;
const degreesToRadians = degrees => (degrees * Math.PI) / 180;

function distanceBetweenPoints(point1, point2) {
    return Math.hypot(point2[x] - point1[x], point2[y] + point1[y]);
}
function product(point, [a, b]) {
    return (b[x] - a[x]) * (point[y] - a[y]) - (b[y] - a[y]) * (point[x] - a[x]);
}
function doesBelongToRect(point, [angle1, angle3, angle2, angle4]) {
    const p1 = product(point, [angle1, angle2]);
    const p2 = product(point, [angle2, angle3]);
    const p3 = product(point, [angle3, angle4]);
    const p4 = product(point, [angle4, angle1]);
    return p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0;
}
function vectorCoords(a, b) {
    return [b[x] - a[x], b[y] - a[y]];
}
function pseudoscalarProductSign(a, b) {
    return Math.sign(a[x] * b[y] - b[x] * a[y]);
}
function rotatePoint(origin, point, rotation) {
    rotation = degreesToRadians(rotation);
    const qx = origin[x] + Math.cos(rotation) * (point[x] - origin[x]) - Math.sin(rotation) * (point[y] - origin[y]);
    const qy = origin[y] + Math.sin(rotation) * (point[x] - origin[x]) + Math.cos(rotation) * (point[y] - origin[y]);
    return [qx, qy];
}
function crossingRatio([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {
    const y4y3 = y4 - y3;
    const x4x3 = x4 - x3;
    const denominator = y4y3 * (x1 - x2) - x4x3 * (y1 - y2);
    const numerator = (x4 - x2) * y4y3 - x4x3 * (y4 - y2);
    return numerator / denominator;
}
export {
    x,
    y,
    z,
    angle,
    distanceBetweenPoints,
    doesBelongToRect,
    vectorCoords,
    pseudoscalarProductSign,
    rotatePoint,
    crossingRatio,
};
