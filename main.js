const apiUrl = 'http://localhost:5209/api/musicRecords';
const authUrl = 'http://localhost:5209/api/auth/login';

const tokenName = 'token';

const app = Vue.createApp({
    data() {
        return {
            postList: [],
            userInfo: null,
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
            },
            auth: {
                username: '',
                password: '',
                errorMessage: ''
            }
        }
    },
    created() {
        const token = this.getToken();
        // console.log('User Info from localStorage:', token); // Debugging line to check the value of userInfoStr
        if (token){
            this.getAllPosts();
        } 
        else {
            window.location.href = 'login.html';
        }
    },
    methods: {
        async login() {
            this.errorMessage = '';

            try {
                const response = await fetch(authUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.auth.username,
                        password: this.auth.password
                    })
                });

                if (!response.ok) {
                    throw new Error('Invalid username or password.');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } catch (err) {
                this.errorMessage = err.message;
            }
        },
        getToken() {
            return localStorage.getItem(tokenName);
        },
        getAllPosts() {
            // 1. Get the token stored during login
            const token = this.getToken();
            console.log('token:', token); // Debugging line to check the token value
        
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
        if(!this.isValidRecord()) return;

        const token = this.getToken();

        axios.post(apiUrl, {
            title: this.record.title.trim(),
            artist: this.record.artist.trim(),
            duration: Number(this.record.duration),
            publicationYear: Number(this.record.publicationYear)
        }, {
            headers: { // TODO - move to interceptor
                'Authorization': 'Bearer ' + token
            }
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
        
        const token = this.getToken();

        axios.delete(`${apiUrl}/${id}`,{
            headers: { // TODO - move to interceptor
                'Authorization': 'Bearer ' + token
            }
        })
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

        const token = this.getToken();

        axios.put(`${apiUrl}/${id}`, {
            title: this.record.title.trim(),
            artist: this.record.artist.trim(),
            duration: Number(this.record.duration),
            publicationYear: Number(this.record.publicationYear)
        }, {
            headers: { // TODO - move to interceptor
                'Authorization': 'Bearer ' + token
            }
        })
            .then(() => {
                this.successMessage = 'Record updated.';
                this.errorMessage = '';
                this.clearRecordForm();
                this.clearFilters();
            })
            .catch(error => {
                this.errorMessage = 'Could not update the record.';
                console.error('Error updating music record:', error);
            });
    },
    deleteRecord() {
        const id = Number(this.record.id);
        if (!Number.isInteger(id) || id <= 0) {
            this.errorMessage = 'Enter a valid record ID to delete.';
            return;
        }

        const token = this.getToken();

        axios.delete(`${apiUrl}/${id}`, {
            headers: { // TODO - move to interceptor
                'Authorization': 'Bearer ' + token
            }
        })
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

        const token = this.getToken();

        axios.put(`${apiUrl}/${id}`, {
            title: this.record.title.trim(),
            artist: this.record.artist.trim(),
            duration: Number(this.record.duration),
            publicationYear: Number(this.record.publicationYear)
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
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

app.component('logout-component', window.logoutComponent);
app.mount('#app');