<template>
    <svg class="icon"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        xml:space="preserve"
        :style="iconStyle"
    >
        <g>
            <path
                d="M468.458,475.756L265.792,6.437c-1.686-3.902-5.732-6.434-9.78-6.437c-4.056-0.004-8.114,2.527-9.804,6.437
                    L43.542,475.756c-2.25,5.198-0.042,11.239,5.021,13.77l42.667,21.333c2.542,1.281,5.458,1.5,8.146,0.573L256,459.225
                    l156.625,52.207c1.104,0.375,2.229,0.552,3.375,0.552c1.646,0,3.271-0.375,4.771-1.125l42.667-21.333
                    C468.5,486.995,470.708,480.954,468.458,475.756z"
            />
        </g>
    </svg>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex';
import { x, y, angle } from '../Helpers/coords';
export default {
    computed: {
        ...mapState([
            'iconWidth',
            'iconHeight',
            'heading',
            'window',
        ]),
        ...mapGetters(['getPlayerWindowPosition']),
        angle() {
            return this.window.isExpanded
                ? -this.heading
                : this.getPlayerWindowPosition[angle] + this.heading;
        },
        iconStyle() {
            return {
                transform: `translate(
                    ${this.getPlayerWindowPosition[x] - this.iconWidth / 2}px,
                    ${this.getPlayerWindowPosition[y] - this.iconHeight / 2}px
                    )
                    rotate(${this.angle}deg)`,
                width: this.iconWidth + 'px',
                height: this.iconHeight + 'px',
            };
        },
    },
};
</script>

<style lang="scss">
.icon {
    position: absolute;
    transform-origin: center;
}
.icon path {
    stroke: #000;
    fill: #FFF;
    stroke-width: 35;
}
</style>
