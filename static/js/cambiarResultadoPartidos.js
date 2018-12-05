"use strict";

Vue.component('tg-partido', {
    data: function() {
        return {
            myName: 'Lucas'
        }
    },
    template: '<h1>{{myName}}</h1>',
    props: ['partido']
    methods: {

    }
})

var vmCambiarResultadoPartidos = new Vue({
    el: '#cambiarPartidos',
    delimiters: ["[%", "%]"],
    data: {
        selectedCategory: 'default' // watch this prop so you can fetch the API.
    },
    methods: {

    }
})
