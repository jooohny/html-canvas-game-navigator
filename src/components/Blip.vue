<template>
        <div class="icon" :style="iconStyle">
            <img
                :src="`assets/sprites/${icon}.png`"
                :height="iconHeight + 'px'"
                :width="iconWidth + 'px'">
        </div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex';
import {
    x,
    y,
    vectorCoords,
    pseudoscalarProductSign,
    crossingRatio,
} from '../Helpers/coords';
export default {
    props: [
        'position',
        'icon',
        'isInner',
    ],
    data() {
        return {
            iconOffset: [0, 0],
        };
    },
    beforeMount() {
        this.$set(this.iconOffset, x, this.iconWidth / 2);
        this.$set(this.iconOffset, y, this.iconHeight / 2);
    },
    computed: {
        ...mapState([
            'iconWidth',
            'iconHeight',
            'window',
            'heading',
        ]),
        ...mapGetters([
            'getPlayerMapPosition',
            'getExpandedMapPosition',
            'getMapPosition',
            'getWindowAreaRotatedCoords',
            'getWindowAngleVectors',
        ]),
        mapPosition() {
            return this.getMapPosition(this.position);
        },
        localPosition() {
            if (this.window.isExpanded)
                return this.expandedMapPosition();
            if (this.isInner)
                return this.mapPosition;
            return this.edgePosition();
        },
        iconStyle() {
            const rotation = this.isInner && !this.window.isExpanded
                ? -this.heading
                : 0;
            return {
                transform: `translate(
                    ${this.localPosition[x] - this.iconOffset[x]}px,
                    ${this.localPosition[y] - this.iconOffset[y]}px
                    )
                    rotate(${rotation}deg)`,
                width: this.iconWidth + 'px',
                height: this.iconHeight + 'px',
            };
        },
    },
    methods: {
        calculateEdgePosition(axis, from, edgeCoord) {
            let position = [0, 0];
            position[from] = edgeCoord;
            position[axis] = this.mapPosition[axis]
            + (this.vector()[axis] / (this.vector()[from]))
            * (position[from] - this.mapPosition[from]);
            return position;
        },
        vector() {
            return vectorCoords(this.mapPosition, this.getPlayerMapPosition);
        },
        edgePosition() {
            if (this.angleVectorProductSign_2() < 0) {
                if (this.angleVectorProductSign_0() > 0) {
                    return this.upperEdgePosition();
                }
                return this.leftEdgePosition();
            }
            if (this.angleVectorProductSign_1() > 0)
                return this.lowerEdgePosition();
            return this.rightEdgePosition();
        },
        expandedMapPosition() {
            return this.getExpandedMapPosition(this.position);
        },
        upperEdgePosition() {
            const Ua = crossingRatio(this.getWindowAreaRotatedCoords[0], this.getWindowAreaRotatedCoords[2], this.mapPosition, this.getPlayerMapPosition);
            return [(1 - Ua) * this.window.width, 0];
        },
        lowerEdgePosition() {
            const Ua = crossingRatio(this.getWindowAreaRotatedCoords[1], this.getWindowAreaRotatedCoords[3], this.mapPosition, this.getPlayerMapPosition);
            return [Ua * this.window.width, this.window.height];

        },
        leftEdgePosition() {
            const Ua = crossingRatio(this.getWindowAreaRotatedCoords[3], this.getWindowAreaRotatedCoords[0], this.mapPosition, this.getPlayerMapPosition);
            return [0, Ua * this.window.height];
        },
        rightEdgePosition() {
            const Ua = crossingRatio(this.getWindowAreaRotatedCoords[2], this.getWindowAreaRotatedCoords[1], this.mapPosition, this.getPlayerMapPosition);
            return [this.window.width, (1 - Ua) * this.window.height];
        },
        angleVectorProductSign_0() {
            return pseudoscalarProductSign(this.getWindowAngleVectors[0], this.vector());
        },
        angleVectorProductSign_1() {
            return pseudoscalarProductSign(this.getWindowAngleVectors[1], this.vector());
        },
        angleVectorProductSign_2() {
            return pseudoscalarProductSign(this.getWindowAngleVectors[2], this.vector());
        },
    },
};
</script>

<style lang="scss" scoped>
.icon {
    position: absolute;
    top: 0;
    transform-origin: center;
    display: flex;
}
.icon path {
    stroke: #000;
    fill: #FFF;
    stroke-width: 35;
}
</style>
