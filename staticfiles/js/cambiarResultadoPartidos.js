"use strict";

Vue.component('tg-partido', {
    data: function() {
        return {
            isSendingInfo: false,
            config: {
                headers: {'X-CSRFToken': Cookies.get('csrftoken'),
                        'Content-Type': 'text/json'},
                withCredentials: true
            }
        }
    },
    template: `
    <tr>
        <td>{{partido.starDate | formatDateArg}}</td>
        <td><img :src="partido.idClub_Category_home.image_url" width="25px">
        {{partido.idClub_Category_home.name}}</td>
        <td>
        <input type="number" v-model="partido.homeGoals" style="width: 80px;" :disabled="isSendingInfo">
        </td>
        <td><input type="number" v-model="partido.homePenaltis" style="width: 80px;" :disabled="isSendingInfo"></td>
        <td>-</td>
        <td><img :src="partido.idClub_Category_away.image_url" width="25px">
        {{partido.idClub_Category_away.name}}</td>
        <td><input type="number" v-model="partido.awayGoals" style="width: 80px;" :disabled="isSendingInfo"></td>
        <td><input type="number" v-model="partido.awayPenaltis" style="width: 80px;" :disabled="isSendingInfo"></td>
        <td>
        <button class="btn btn-primary" @click="onSaveMatch($event)" :disabled="isSendingInfo"><i class="fas fa-paper-plane"></i></button>
        </td>
    </tr>
    `,
    props: ['partido'],
    methods: {
        onSaveMatch: function(event) {
            this.isSendingInfo = true
            event.target.innerHTML = '<i class="fas fa-spinner"></i>'
            axios.post(`${HOST}/cambiar-resultado/`,{
                idPartido: this.partido.id,
                GolesLocal: this.partido.homeGoals,
                GolesVisitante: this.partido.awayGoals,
                PenalesLocal: this.partido.homePenaltis,
                PenalesVisitante: this.partido.awayPenaltis
            },this.config).then(response => {
                this.isSendingInfo = false
                event.target.innerHTML = '<i class="fas fa-paper-plane"></i>'
            }).catch(err => {
                this.isSendingInfo = false
                event.target.innerHTML = '<i class="fas fa-paper-plane"></i>'
                console.err(err)
            })
        }
    },
    filters: {
        formatDateArg: function(value) {
            if(!value) return ''
            let nuevoDate = new Date(value)
            return nuevoDate.getDate() + '/' + (nuevoDate.getMonth() + 1)  + ' - ' + nuevoDate.getUTCHours() + ':' + nuevoDate.getMinutes()
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
        isFetchingMatches: false,
        sendingMatchToServer: false
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
