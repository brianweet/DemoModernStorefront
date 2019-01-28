export class ReadNfc {
  constructor() {
    this.readNfc();
  }
  readNfc() {
    if ("nfc" in navigator) {
      navigator.nfc
        .watch(this.processMessage, { mode: "web-nfc-only" })
        .then(() => console.log("Added a watch."))
        .catch(err => console.log("Adding watch failed: " + err.name));
    }
  }
  processMessage = (message: NFCMessage) => {
    console.log("NFC message received", message);
    message.records.forEach(record => {
      if (record.recordType === "text") {
        console.log("Record type text: " + record.data);
      }
    });
  };
}
