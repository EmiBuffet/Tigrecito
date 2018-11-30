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
            percentage: 0,
            isUploadingToDjango: false
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
                this.upload.percentage = 0
                this.isUploadingToDjango = false
                this.manageUpload(equipo)
                //upload image to firebase

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
            var uploadTask = storageRef.put(this.selectedFile).on('state_changed', function(snappy) {
                this.upload.percentage = (snappy.bytesTransferred / snappy.totalBytes) * 100
            },
            function(err) {
                this.upload.isUploading = false
                this.error = err
            },
            function() {
                // when upload finished then send data to django server.
                this.upload.isUploading = false
                this.resetAllProps()
                console.log('Well done')
            })
        }
    }
})

vmEscudos.fetchAllClubs()
