"use strict";
var vm = new Vue({
	el: '#listadoPartidos',
	delimiters: ["[%", "%]"],
	data: {
		isFetchingMatches: false,
		matches: [],
		errors: {
			hasError: false,
			errorMessage: ''
		}
	},
	methods: {
		fetchMatches: function(){
			this.isFetchingMatches = true
			axios.get(`${HOST}/api/partidos?format=json`)
				.then(response => {
					if(response.status !== 200) {
						//show error
						this.isFetchingMatches = false
						this.errors.hasError = true
						return;
					}
					this.matches = response.data.partidos
					this.isFetchingMatches = false
				})
				.catch(err => {
					console.error(err)
					this.errors.hasError = true
				})
		}
	}
})
vm.fetchMatches()
