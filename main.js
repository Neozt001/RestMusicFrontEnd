const apiUrl = 'http://localhost:5209/api/musicRecords';
const app = Vue.createApp({
  data() {
    return {
        postList: [],
        id: '',
        title: '',
        artist: '',
        duration: '',
        publicationYear: '',
        sortBy: '',
        showPosts: true,
        statusCode: null,
        errorMessage: '',
        successMessage: '',
        record: {
            id: '',
            title: '',
            artist: '',
            duration: '',
            publicationYear: ''
        }
    }
  },
  methods: {
    getAllPosts() {
        axios.get('http://localhost:5209/api/musicRecords', {
            params: {
                title: this.title.trim() || undefined,
                artist: this.artist.trim() || undefined,
                id: this.id || undefined,
                duration: this.duration || undefined,
                publicationYear: this.publicationYear || undefined,
                sortBy: this.sortBy || undefined
            }
        })
            .then(response => {
                this.statusCode = response.status;
                this.postList = response.data;
                this.errorMessage = '';
            })
            .catch(error => {
                this.errorMessage = 'Could not load music records. Check that the backend is running and accessible.';
                console.error('Error fetching music records:', error);
            })
    },
    clearFilters() {
        this.id = '';
        this.title = '';
        this.artist = '';
        this.duration = '';
        this.publicationYear = '';
        this.sortBy = '';
        this.getAllPosts();
    },
    isValidRecord() {
        const duration = Number(this.record.duration);
        const publicationYear = Number(this.record.publicationYear);
        if (!this.record.title.trim() || !this.record.artist.trim() ||
            !Number.isInteger(duration) || duration <= 0 ||
            !Number.isInteger(publicationYear) || publicationYear <= 0) {
            this.errorMessage = 'Enter a title, artist, positive duration and publication year.';
            return false;
        }

        return true;
    },
    clearRecordForm() {
        this.record = {
            id: '',
            title: '',
            artist: '',
            duration: '',
            publicationYear: ''
        };
    },
    addRecord() {
        if (!this.isValidRecord()) return;

        axios.post(apiUrl, {
            title: this.record.title.trim(),
            artist: this.record.artist.trim(),
            duration: Number(this.record.duration),
            publicationYear: Number(this.record.publicationYear)
        })
            .then(() => {
                this.successMessage = 'Record added.';
                this.errorMessage = '';
                this.clearRecordForm();
                this.clearFilters();
            })
            .catch(error => {
                this.errorMessage = 'Could not add the record.';
                console.error('Error adding music record:', error);
            });
    },
    deleteRecord() {
        const id = Number(this.record.id);
        if (!Number.isInteger(id) || id <= 0) {
            this.errorMessage = 'Enter a valid record ID to delete.';
            return;
        }

        axios.delete(`${apiUrl}/${id}`)
            .then(() => {
                this.successMessage = 'Record deleted.';
                this.errorMessage = '';
                this.clearRecordForm();
                this.clearFilters();
            })
            .catch(error => {
                this.errorMessage = error.response?.status === 404
                    ? 'No record found with that ID.'
                    : 'Could not delete the record.';
                console.error('Error deleting music record:', error);
            });
    },
    updateRecord() {
        const id = Number(this.record.id);
        if (!Number.isInteger(id) || id <= 0) {
            this.errorMessage = 'Enter a valid record ID to update.';
            return;
        }
        if (!this.isValidRecord()) return;

        axios.put(`${apiUrl}/${id}`, {
            title: this.record.title.trim(),
            artist: this.record.artist.trim(),
            duration: Number(this.record.duration),
            publicationYear: Number(this.record.publicationYear)
        })
            .then(() => {
                this.successMessage = 'Record updated.';
                this.errorMessage = '';
                this.clearRecordForm();
                this.clearFilters();
            })
            .catch(error => {
                this.errorMessage = error.response?.status === 404
                    ? 'No record found with that ID.'
                    : 'Could not update the record.';
                console.error('Error updating music record:', error);
            });
    }
  }
});

app.mount('#app');