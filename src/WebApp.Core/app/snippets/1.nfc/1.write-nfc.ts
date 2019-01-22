export class WriteNfc {
  constructor() {
    this.writeNfc("Write a message to an NFC tag");
  }
  writeNfc(message: string) {
    if ("nfc" in navigator) {
      var nfcMessage = this.createNfcMessage(message);
      navigator.nfc
        .push(nfcMessage)
        .then(() => console.log("Added a watch."))
        .catch(err => console.log("Adding watch failed: " + err.name));
    }
  }
  createNfcMessage(message: string): NFCMessage {
    return {
      records: [
        {
          recordType: "text",
          mediaType: "text/plain",
          data: message || "Empty message"
        }
      ]
    };
  }
}

var nfcRecord = {
  recordType: "text",
  mediaType: "text/plain",
  data: "Empty message"
};
var nfcMessage = {
  url: "",
  data: [nfcRecord]
};
