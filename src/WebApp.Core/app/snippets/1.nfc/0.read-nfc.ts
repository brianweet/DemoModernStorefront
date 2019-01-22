export class ReadNfc {
  constructor() {
    this.readNfc();
  }
  readNfc() {
    if ("nfc" in navigator) {
      navigator.nfc
        .watch(this.processMessage, { mode: "any" })
        .then(() => console.log("Added a watch."))
        .catch(err => console.log("Adding watch failed: " + err.name));
    }
  }
  processMessage = (message: NFCMessage) => {
    console.log("NFC message received", message);
    var items = message.records || message.data;
    items.forEach(record => {
      if (record.recordType === "text") {
        console.log("Record type text: " + record.data);
      }
    });
  };
}
