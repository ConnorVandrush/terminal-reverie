class ClientAPI {
  constructor() {
    this.dispatchToReact;
    this.getReactState;
    this.loginNamespace = io("http://192.168.1.235:15987/login");
    this.authNamespace;
    this.spriteColorer;
    this.playerManager;
  }
}

window.clientAPI = new ClientAPI();
