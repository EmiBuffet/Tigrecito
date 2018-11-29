"use strict";

var vm2 = new Vue({
	el: '#buscadorPartido',
	delimiters: ["[%", "%]"],
	data: {
		selectedClub: {},
		hasSelectedClub: false,
		clubs: [],
		resultSearch: [],
		notFound: false,
		isSearching: false,
		matchInfo: {
			clubId: null,
			categoryId: null
		}
	},
	methods: {
		searchByClubName: function(e) {
			this.isSearching = false
			this.resultSearch = []
			this.selectedClub = {}
			let searchText = e.target.value.trim().toLowerCase()
			if(!this.hasSelectedClub && searchText.length > 2) {
				this.isSearching = true
				this.resultSearch = this.clubs.filter(function(currentValue){
					return currentValue.name.toLowerCase().includes(searchText)
				})
			}
		},
		getAllClubs: function() {
			axios.get(`${HOST}/api/clubes?format=json`)
				.then(res => {
					this.clubs = res.data.clubes
				})
				.catch(err => {
					console.eror(err)
				})
		},
		selectClub: function(index) {
			this.isSearching = false
			this.hasSelectedClub = true
			this.selectedClub = this.resultSearch[index]
			this.matchInfo.clubId = this.selectedClub.id
			this.resultSearch = []
		},
		onRemoveSelectedClub: function() {
			this.matchInfo.clubId = null
			this.matchInfo.categoryId = null
			this.hasSelectedClub = false
			this.selectedClub = {}
		},
		onSelectCategoryId: function(categoryId) {
			this.matchInfo.categoryId = categoryId
		},
		onShowMatches: function() {
			let clubName = this.selectedClub.name.replace(/\s+/g, '-').toLowerCase()
			if(this.matchInfo.clubId !== null && this.matchInfo.categoryId !== null){
                console.log('redirecting...')
				window.location = `${HOST}/partido/equipo/${clubName}/${this.matchInfo.clubId}/${this.matchInfo.categoryId}`;
			}
		}
	}
})

vm2.getAllClubs()
