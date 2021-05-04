<template>
  <div id="app">
    <h2>Vue.js WebSocket Tutorial</h2> 
    <input v-model="message" placeholder="Type command here"/>
    <button v-on:click="sendMessage()">Send Message</button><br><br>
    <span v-text="result"></span>
  </div>
</template>

<script>

export default {
  name: 'App',
  
  data: function () {
    return {
      connection:null,
      message:"",
      result:null
    }
  },

  methods: {
    sendMessage: function() {
      console.log("Sent command:" + this.message);
      console.log(this.connection);
      this.connection.send(this.message);
    },
  },

  created: function() {
    
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://localhost:3000");
    this.result = "Result of command";

    this.connection.onmessage = (event) => {
      console.log(event);
    }

    this.connection.onopen = (event) => {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...")
    }

    this.connection.onmessage = (event) => {
      console.log("Resultttt:" + event.data);
      this.result = event.data;
    }

    this.connection.onopen = (event) => {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
    }
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
