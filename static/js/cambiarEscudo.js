"use strict";

var vmEscudos = new Vue({
    el: '#appChangeShield',
	delimiters: ["[%", "%]"],
    data: {
        clubs: [],
        isSearching: true,
        error: null
    },
    methods: {
        fetchAllClubs: function() {
            this.isSearching = true
            axios.get(`${HOST}/api/clubes?format=json`)
				.then(res => {
                    //TODO: Ordenar alfabeticamente
					this.clubs = res.data.clubes
                    this.isSearching = false
				})
				.catch(err => {
					console.eror(err)
                    this.error = err
                    this.isSearching = false
				})
        },
        onCloseAlertError: function() {
            this.error = null
        }
    }
})

vmEscudos.fetchAllClubs()
