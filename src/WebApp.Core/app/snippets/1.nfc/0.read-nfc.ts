export class ReadNfc {
  watchForNfcMessages() {
    if ("nfc" in navigator) {
      navigator.nfc
        .watch(this.processMessage, { mode: "web-nfc-only" })
        .then(() => console.log("Added a watch."))
        .catch(err => console.log("Adding watch failed: " + err.name));
    }
  }
  processMessage = (message: NFCMessage) => {
    message.records.forEach(record => {
      if (record.recordType === "text") {
        const productCode = record.data;
        console.log(`Read tag with Product Code: ${productCode}`);
      }
    });
  };
}
