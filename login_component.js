const app = Vue.createApp({});

app.component('login-component', {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        async login() {
            this.errorMessage = '';

            try {
                const response = await fetch('http://localhost:5209/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
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
        }
    },
    template: 
    `
        <div class="login-box">
            <h2>Member Login</h2>
            <form @submit.prevent="login">
                <input v-model="username" type="text" placeholder="Username" required>
                <input v-model="password" type="password" placeholder="Password" required>
                <button type="submit">Log In</button>
            </form>
            <div class="error">{{ errorMessage }}</div>
        </div>
    `
});

app.mount('#app');