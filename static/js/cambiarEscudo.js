"use strict";

var vmEscudos = new Vue({
    el: '#appChangeShield',
	delimiters: ["[%", "%]"],
    data: {
        clubs: [],
        isSearching: true,
        error: null,
        selectedFile: null,
        upload: {
            isUploading: false,
            state: ''
        },
        config: {
            headers: {'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'text/json'},
            withCredentials: true
        }
    },
    methods: {
        fetchAllClubs: function() {
            this.isSearching = true
            axios.get(`${HOST}/api/clubes?format=json`)
				.then(res => {
					this.clubs = res.data.clubes
                    this.clubs.sort(function ccompareFunction(a, b){
                        if(a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1
                        }
                        if(a.name.toLowerCase() > b.name.toLowerCase()){
                            return 1
                        }
                        return 0
                    })
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
        },
        onUploadImageToFirebase: function(equipo, event) {
            if(this.selectedFile){
                this.manageUpload(equipo)
            }
        },
        onChangeInputFile: function(event) {
            this.selectedFile = event.target.files[0]
        },
        resetAllProps: function () {
            this.error = false
            this.selectedFile = null
        },
        manageUpload: function(equipo) {
            let storageRef = firebase.storage().ref(`shield/${equipo.id}/${this.selectedFile.name}`)
            this.upload.isUploading = true
            this.upload.state = 'Subiendo a Firebase...'
            var uploadTask = storageRef.put(this.selectedFile).then(snap => {
                this.upload.state = 'Obteniendo URL...'
                return snap.ref.getDownloadURL()
            }).then(imageURL => {
                //Enviar a django server
                this.upload.state = 'Subiendo a la base de datos...'
                axios.post(`${HOST}/escudo/`, {
                    idClub: equipo.id,
                    shield: imageURL
                }, this.config)
                .then(response => {
                    // todo ok. cambiar la imágen del escudo en el html
                    this.$refs[`shieldImage-${equipo.id}`][0].setAttribute('src', imageURL)
                    this.upload.isUploading = false
                    this.upload.state = ''
                })
                .catch(err => {
                    this.error = err
                    this.upload.isUploading = false
                    this.upload.state = ''
                })
            })
        }
    }
})

vmEscudos.fetchAllClubs()
