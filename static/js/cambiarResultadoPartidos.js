"use strict";

Vue.component('tg-partido', {
    data: function() {
        return {
            isSendingInfo: false
        }
    },
    template: `
    <tr>
        <td>15/10 15:00</td>
        <td><img :src="partido.idClub_Category_home.image_url" width="25px">
        {{partido.idClub_Category_home.name}}</td>
        <td>
        <input type="number" v-model="partido.homeGoals" style="width: 80px;" :disabled="isSendingInfo">
        </td>
        <td><input type="number" v-model="partido.Penaltis" style="width: 80px;" :disabled="isSendingInfo"></td>
        <td>-</td>
        <td><img :src="partido.idClub_Category_away.image_url" width="25px">
        {{partido.idClub_Category_away.name}}</td>
        <td><input type="number" v-model="partido.awayGoals" style="width: 80px;" :disabled="isSendingInfo"></td>
        <td><input type="number" v-model="partido.awayPenaltis" style="width: 80px;" :disabled="isSendingInfo"></td>
        <td>
        <button class="btn btn-primary" @click="onSaveMatch($event)" :disabled="isSendingInfo">Guardar</button>
        </td>
    </tr>
    `,
    props: ['partido'],
    methods: {
        onSaveMatch: function(event) {
            this.isSendingInfo = true
            event.target.textContent = 'Enviando...'
        }
    }
})

var vmCambiarResultadoPartidos = new Vue({
    el: '#cambiarPartidos',
    delimiters: ["[%", "%]"],
    data: {
        selectedCategory: 'default',
        isFetchingCategories: true,
        categories: [],
        matches: [],
        isFetchingMatches: false
    },
    methods: {
        getAllCategories: function() {
            axios.get(`${HOST}/api/categorias`)
                .then(response => {
                    this.categories = response.data.categorias
                    this.isFetchingCategories = false
                })
                .catch(e => {
                    console.error(e)
                    this.isFetchingCategories = false
                })
        }
    },
    watch: {
        selectedCategory: function(newValue, oldValue){
            if(newValue !== 'default') {
                this.isFetchingMatches = true
                axios.get(`${HOST}/api/partidos_categoria/${this.selectedCategory}`)
                    .then(response => {
                        this.matches = response.data.partidosCategoria
                        this.isFetchingMatches = false
                    })
                    .catch()
            }
        }
    }
})
vmCambiarResultadoPartidos.getAllCategories()
