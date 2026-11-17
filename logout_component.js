window.logoutComponent = {
  emits: ['logout'],
  template:
  /*html*/
  `
    <div>
        <button class="btn btn-primary" @click="$emit('logout')">Logout</button>  
    </div>  
    
  `
};