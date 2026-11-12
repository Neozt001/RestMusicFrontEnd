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
  computed: {
    filteredPosts() {
        let records = this.postList;
        const title = this.title.trim().toLocaleLowerCase();
        if (title) {
            records = records.filter(record =>
                (record.title || '').toLocaleLowerCase().includes(title)
            );
        }

        if (this.sortBy === 'id' || this.sortBy === 'duration' || this.sortBy === 'publicationYear') {
            records = [...records].sort((a, b) => a[this.sortBy] - b[this.sortBy]);
        } else if (this.sortBy === 'title' || this.sortBy === 'artist') {
            const field = this.sortBy;
            records = [...records].sort((a, b) =>
                (a[field] || '').localeCompare(b[field] || '', undefined, { sensitivity: 'base' })
            );
        }

        return records;
    }
  },
  methods: {
    getAllPosts() {
        axios.get('http://localhost:5209/api/musicRecords')
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
        this.title = '';
        this.sortBy = '';
    }
  }
});

app.mount('#app');