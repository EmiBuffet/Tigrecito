"use strict";

Vue.component('tg-partido', {
    data: function() {
        return {
            isSendingInfo: false
        }
    },
    template: `
    <tr>
        <td>Unión Sunchales</td>
        <td>5</td>
        <td>7</td>
        <td>-</td>
        <td>Libertad Sunchales</td>
        <td>5</td>
        <td>7</td>
    </tr>
    `,
    props: ['partido'],
    methods: {

    }
})

var vmCambiarResultadoPartidos = new Vue({
    el: '#cambiarPartidos',
    delimiters: ["[%", "%]"],
    data: {
        selectedCategory: 'default', // watch this prop so you can fetch the API.
        isFetchingCategories: true
    },
    methods: {
        getAllCategories: function() {
            
        }
    }
})
