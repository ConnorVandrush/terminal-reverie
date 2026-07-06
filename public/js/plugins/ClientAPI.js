class ClientAPI {
  constructor() {
    this.dispatchToReact;
    this.getReactState;
    this.login = io("http://192.168.1.235:15987/login");
    this.auth;
  }
}

window.clientAPI = new ClientAPI();
