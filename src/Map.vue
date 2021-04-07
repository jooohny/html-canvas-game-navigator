<template>
    <div class="container">
        <input
            type="text"
            v-on:keydown.up.exact="MUTATE_PLAYER_POSITION({axis: 1, value: 1})"
            v-on:keydown.down.exact="MUTATE_PLAYER_POSITION({axis: 1, value: -1})"
            v-on:keydown.left.exact="MUTATE_PLAYER_POSITION({axis: 0, value: -1})"
            v-on:keydown.right.exact="MUTATE_PLAYER_POSITION({axis: 0, value: 1})"
            v-on:keydown.ctrl.65.prevent="changeCamera(5)"
            v-on:keydown.ctrl.68.prevent="changeCamera(-5)"
            v-on:keydown.tab.exact.prevent="expandMap(!window.isExpanded)"
            style="border: 3px solid black; position: absolute; z-index: 2;"
            v-if="true"
        >
        <div
            :class="['map', { 'map_expanded' : window.isExpanded }]"
            :style="mapWindowStyle"

        >
            <div
                :class="['map__wrapper', { 'map__wrapper_expanded' : window.isExpanded }]"
                :style="[mapWrapperStyle, mapWrapperStyleRotation]"
            >
                <img
                    class="map__img"
                    :style="imgStyle"
                    src="assets/main-map.jpg"
                >
                <canvas class="map__canvas" ref="canvas"></canvas>
                <Blip v-for="blip in getSortedBlips[0]"
                    :position="blip.position"
                    :icon="blip.icon"
                    :key="blip.id"
                    :isInner="true"
                />
            </div>
            <progress
                class="map__progress"
                v-if="!window.isExpanded"
                :value="player.health"
                max="100"
            >
            </progress>
            <progress
                class="map__progress map__progress_stamina"
                v-if="!window.isExpanded"
                :value="player.stamina"
                max="100"
            >
            </progress>

        </div>
        <div
            :class="['map', 'map_blips', { 'map_expanded' : window.isExpanded }]"
            :style="mapWindowStyle"
        >
            <Blip v-for="blip in getSortedBlips[1]"
                :position="blip.position"
                :icon="blip.icon"
                :key="blip.id"
                :isInner="false"
            />
            <div
                :class="['map__wrapper', 'map__wrapper_blips', { 'map__wrapper_expanded' : window.isExpanded }]"
                :style="[mapWrapperStyle]"
            >
                <PlayerArrow/>
            </div>
        </div>
    </div>
    <!-- <div class="container">
        <h1>Hey!</h1>
    </div> -->
</template>

<script>
import {
    MUTATE_PLAYER_POSITION,
    UPDATE_HEADING,
} from './store/mutation-types';
import {
    expandMap,
} from './store/action-types';
import {
    mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import PlayerArrow from './components/PlayerArrow.vue';
import Blip from './components/Blip.vue';
import { x, y } from './Helpers/coords';

export default {
    components: {
        PlayerArrow,
        Blip,
    },
    data() {
        return {
            canvas: null,
            ctx: null,
            windowOffset: [0, 0],
        };
    },
    beforeMount() {
        this.$set(this.windowOffset, x, this.window.width / 2);
        this.$set(this.windowOffset, y, this.window.height / 2);
    },
    computed: {
        ...mapState([
            'window',
            'heading',
            'player',
        ]),
        ...mapGetters([
            'getScaleMultiplier',
            'getPlayerMapPosition',
            'getMapPosition',
            'getWindowAreaCoords',
            'getSortedBlips',
        ]),
        mapWindowStyle() {
            return {
                height: (this.window.isExpanded
                    ? this.window.expandedHeight
                    : this.window.height)
                    + 'px',
                width: (this.window.isExpanded
                    ? this.window.expandedWidth
                    : this.window.width)
                    + 'px',
            };
        },
        mapWrapperStyle() {
            return this.window.isExpanded
                ? {
                    width: this.canvas.width / this.window.scale + 'px',
                    height: this.canvas.height / this.window.scale + 'px',
                }
                : {
                    'transform-origin': this.getPlayerMapPosition[x] + 'px ' + this.getPlayerMapPosition[y] + 'px',
                    transform: `translate(
                        ${-this.getPlayerMapPosition[x] + this.windowOffset[x]}px,
                        ${-this.getPlayerMapPosition[y] + this.windowOffset[y]}px
                    )`,
                };
        },
        mapWrapperStyleRotation() {
            return this.window.isExpanded
                ? null
                : {
                    transform: `translate(
                        ${-this.getPlayerMapPosition[x] + this.windowOffset[x]}px,
                        ${-this.getPlayerMapPosition[y] + this.windowOffset[y]}px
                        )
                        rotate(${this.heading}deg)`,
                };
        },
        imgStyle() {
            return {
                height: this.window.expandedHeight * this.getScaleMultiplier + 'px',
            };
        },
    },
    methods: {
        ...mapMutations([
            MUTATE_PLAYER_POSITION,
            UPDATE_HEADING,
        ]),
        ...mapActions([
            expandMap,
        ]),
        changeCamera(angle) {
            this.UPDATE_HEADING(this.heading + angle);
        },
        drawLine([x1, y1], [x2, y2], color) {
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(...this.getMapPosition([x1, y1]));
            this.ctx.lineTo(...this.getMapPosition([x2, y2]));
            this.ctx.stroke();
        },
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        window.onload = () => {
            this.canvas.height = this.canvas.parentNode.offsetHeight;
            this.canvas.width = this.canvas.parentNode.offsetWidth;
            this.ctx.lineWidth = this.window.scale;
        };
    },
};
</script>

<style lang="scss">
html, body {
    margin: 0;
}
.container {
    width: 100vw;
    height: 100vh;
    position: relative;
    left: 0;
}
.map {
    overflow: hidden;
    position: absolute;
    left: 17px;
    bottom: 17px;
    opacity: 0.85;
    border-radius: 10px;
}
.map_blips {
    overflow: visible;
    opacity: 1;
}
.map_expanded {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    border-radius: 0;
}
.map__wrapper {
    height: fit-content;
    width: fit-content;
    position: relative;

}
.map__wrapper_blips {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    list-style-type: none;
}
.map__wrapper_expanded {
    left: 50%;
    transform: translateX(-50%);
}
.map__img {
    display: block;
    transform-origin: center;
    transform: rotate(180deg);
    background: rgba(255, 255, 255, 0.1);
}
.map__canvas {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
}
.map__progress {
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    display: block;
    width: 50%;
    height: 8px;
    border-right: 1px solid black;
    position: absolute;
    bottom: 0;
}
.map__progress::-webkit-progress-bar {
    background-color: #0A3D21;
}
.map__progress::-webkit-progress-value {
    background-color: #02D965;
}
.map__progress_stamina {
    border-right: unset;
    border-left: 1px solid black;
    right: 0;
}
.map__progress_stamina::-webkit-progress-bar {
    background-color: #002B43;
}
.map__progress_stamina::-webkit-progress-value {
    background-color: #0090DF;
}
</style>
