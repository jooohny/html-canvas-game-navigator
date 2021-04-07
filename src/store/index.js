import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import {
    x,
    y,
    distanceBetweenPoints,
    doesBelongToRect,
    rotatePoint,
    vectorCoords,
} from '../Helpers/coords';
import {
    MUTATE_PLAYER_POSITION,
    ADD_BLIP,
    REMOVE_BLIP,
    SET_IS_EXPANDED_IN,
    UPDATE_PLAYER_POSITION,
    UPDATE_HEADING,
    UPDATE_PLAYER_STAMINA,
    UPDATE_PLAYER_HEALTH,
} from './mutation-types';
import {
    expandMap,
} from './action-types';
import MapConverter from '../libraries/MapConverter';
const { innerHeight } = window;
const expandedHeight = 0.88 * innerHeight;
const expandedWidth = expandedHeight * 1.4;
const converter = new MapConverter({
    origin: [9963.7, 1889.6, 15, 0],
    measurePoint: [9987.5, 1867.3],
    measureValue: 10,
    prescale: 20,
    scale: 8,
    windowHeight: expandedHeight,
});
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        iconWidth: 22,
        iconHeight: 22,
        player: {
            position: [0, 0, 0, 0],
            health: 100,
            stamina: 100,
        },
        heading: 0,
        blips: [
            {
                icon: 'parking',
                position: [10, 10, 10, 0],
                title: 'Parking',
                id: 32251,
                group: null,
                hideOnMiniMapEdge: false,
            },
        ],
        minDistance: 2000,
        window: {
            height: 180,
            width: 270,
            expandedHeight,
            expandedWidth,
            scale: converter.scale,
            isExpanded: false,
        },
    },
    mutations: {
        [MUTATE_PLAYER_POSITION](state, { axis, value }) {
            Vue.set(state.player.position, axis, state.player.position[axis] + value);
        },
        [ADD_BLIP](state, blip) {
            state.blips = [...state.blips, blip];
        },
        [REMOVE_BLIP](state, blipId) {
            state.blips = state.blips.filter(blip => blip.id !== blipId);
        },
        [SET_IS_EXPANDED_IN](state, newValue) {
            Vue.set(state.window, 'isExpanded', newValue);
        },
        [UPDATE_HEADING](state, newValue) {
            state.heading = newValue;
        },
        [UPDATE_PLAYER_POSITION](state, newValue) {
            Vue.set(state.player, 'position', newValue);
        },
        [UPDATE_PLAYER_STAMINA](state, newValue) {
            Vue.set(state.player, 'stamina', newValue);
        },
        [UPDATE_PLAYER_HEALTH](state, newValue) {
            Vue.set(state.player, 'health', newValue);
        },
    },
    actions: {
        [expandMap]({ commit }, newState) {
            commit(SET_IS_EXPANDED_IN, newState);
        },
    },
    getters: {
        getExpandedMapPosition: () => objectPosition => {
            return converter.globalToLocal(objectPosition, converter.scale);
        },
        getMapPosition: () => objectPosition => {
            return converter.globalToLocal(objectPosition);
        },
        getPlayerWindowPosition: (state) => {
            if (state.window.isExpanded)
                return converter.globalToLocal(state.player.position, state.window.scale);
            return converter.globalToLocal(state.player.position);
        },
        getPlayerMapPosition: (state) => {
            return converter.globalToLocal(state.player.position);
        },
        getWindowAreaRotatedCoords: (state, getters) => {
            const coords = [
                [
                    getters.getPlayerMapPosition[x] - state.window.width / 2,
                    getters.getPlayerMapPosition[y] - state.window.height / 2,
                ],
                [
                    getters.getPlayerMapPosition[x] + state.window.width / 2,
                    getters.getPlayerMapPosition[y] + state.window.height / 2,
                ],
                [
                    getters.getPlayerMapPosition[x] + state.window.width / 2,
                    getters.getPlayerMapPosition[y] - state.window.height / 2,
                ],
                [
                    getters.getPlayerMapPosition[x] - state.window.width / 2,
                    getters.getPlayerMapPosition[y] + state.window.height / 2,
                ],
            ];
            return coords.map(point => rotatePoint(getters.getPlayerMapPosition, point, -state.heading));
        },
        getWindowAngleVectors: (state, getters) => {
            return [
                vectorCoords(getters.getWindowAreaRotatedCoords[0], getters.getPlayerMapPosition),
                vectorCoords(getters.getWindowAreaRotatedCoords[1], getters.getPlayerMapPosition),
                vectorCoords(getters.getWindowAreaRotatedCoords[2], getters.getPlayerMapPosition),
            ];
        },
        getWindowAreaCoords: (state, getters) => {
            const coords = [
                [
                    getters.getPlayerMapPosition[x] - state.window.width / 2,
                    getters.getPlayerMapPosition[y] - state.window.height / 2,
                ],
                [
                    getters.getPlayerMapPosition[x] + state.window.width / 2,
                    getters.getPlayerMapPosition[y] + state.window.height / 2,
                ],
                [
                    getters.getPlayerMapPosition[x] + state.window.width / 2,
                    getters.getPlayerMapPosition[y] - state.window.height / 2,
                ],
                [
                    getters.getPlayerMapPosition[x] - state.window.width / 2,
                    getters.getPlayerMapPosition[y] + state.window.height / 2,
                ],
            ];
            return coords;
        },
        getScaleMultiplier: (state) => state.window.isExpanded
            ? 1
            : state.window.scale,
        getNearestBlips: (state) => {
            return state.window.isExpanded
                ? state.blips
                : state.blips.filter(({ position }) => distanceBetweenPoints(state.player.position, position) <= state.minDistance);
        },
        getSortedBlips: (state, getters) => {
            if (state.window.isExpanded)
                return [state.blips, []];

            let innerBlips = [];
            let outerBlips = [];

            getters.getNearestBlips.forEach(blip => {
                if (doesBelongToRect(getters.getMapPosition(blip.position), getters.getWindowAreaRotatedCoords))
                    innerBlips = [...innerBlips, blip];
                else if (!blip.hideOnMiniMapEdge)
                    outerBlips = [...outerBlips, blip];
            });

            return [innerBlips, outerBlips];
        },

    },
});
