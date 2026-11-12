const app = Vue.createApp({
  data() {
    return {
        postList: [],
        id: '',
        title: '',
        artist: '',
        duration: '',
        publicationYear: ''
    }
  },
  methods: {
    getAllPosts() {
        axios.get('[GETALL]')
            .then(response => {
                console.log(response)
                console.log('Status code:', response.status)
            })
            .catch(error => {
                console.error('Error fetching posts:', error)
            })
    }
  }
})