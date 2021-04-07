export default class Blip {
    constructor({
        position, icon, title, id, hideOnMiniMapEdge, group,
    }) {
        this.position = position;
        this.icon = icon;
        this.title = title;
        this.id = id;
        this.hideOnMiniMapEdge = hideOnMiniMapEdge;
        this.group = group;
    }
}
