

new Vue({
  el: '#room-list',
  data: {
    result: []
  },
  mounted() {
    const rooms = new Room({});
    rooms.getList().then((response)=>{
      // console.log(response.result);
      this.result = response.result;
    })
  }
});
