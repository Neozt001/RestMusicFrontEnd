const app = Vue.createApp({
  data() {
    return {
        postList: [],
        id: '',
        title: '',
        artist: '',
        duration: '',
        publicationYear: '',
        showPosts: true,
        statusCode: null
    }
  },
  methods: {
    getAllPosts() {
        axios.get('http://localhost:5209/api/musicRecords')
            .then(response => {
                console.log(response)
                console.log('Status code:', response.status)
                this.postList = response.data
                console.log(this.postList)
            })
            .catch(error => {
                console.error('Error fetching posts:', error)
            })
    }
  }
});

app.mount('#app');