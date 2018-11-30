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
        }
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
                axios.post(`${HOST}/escudo`, {
                    idClub: equipo.id,
                    shield: imageURL
                })
                .then(response => {
                    console.log(response.respuesta)
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
