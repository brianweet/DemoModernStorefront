export class WriteNfc {
  writeNfc(productCode: string) {
    if ("nfc" in navigator) {
      const nfcMessage = this.createNfcMessage(productCode);
      navigator.nfc
        .push(nfcMessage)
        .then(() => console.log("Wrote product code to NFC tag."))
        .catch(err => console.log("Something went wrong: " + err.name));
    }
  }
  createNfcMessage(productCode: string): NFCMessage {
    return {
      records: [
        {
          recordType: "text",
          mediaType: "text/plain",
          data: productCode
        }
      ]
    };
  }
}
