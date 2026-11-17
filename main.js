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
        // 1. Get the token stored during login
        const token = localStorage.getItem('token');
        
        // If there's no token, redirect to the login page immediately
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        axios.get('http://localhost:5209/api/musicRecords', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
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
                // 3. If the backend says unauthorized (token expired/invalid), force re-login
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }
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
    logout() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    },
  }
});

app.component('logout-component', window.logoutComponent);
app.mount('#app');