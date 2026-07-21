class ClientAPI {
  constructor() {
    this.dispatchToReact;
    this.getReactState;
    this.loginNamespace = io("http://192.168.1.235:15987/login");
    this.authNamespace = null;
    this.spriteManager;
    this.playerManager;
    this.createCharacterCB = {
      cb: null,

      set(cb) {
        this.cb = cb;
      },

      call(payload) {
        if (this.cb) {
          this.cb(payload);
          this.cb = null;
        }
      },

      clear() {
        this.cb = null;
      },
    };
  }
}

window.clientAPI = new ClientAPI();
