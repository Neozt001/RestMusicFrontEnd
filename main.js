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
        errorMessage: ''
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
    }
  }
});

app.mount('#app');