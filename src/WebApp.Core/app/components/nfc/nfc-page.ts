/// <amd-dependency path="text!./nfc-page.html" />
import * as ko from "knockout";
import ViewModelBase from "../ViewModelBase";

export class NfcViewModel extends ViewModelBase {
  nfcAccessStatus = ko.observable(false);
  nfcStatus = ko.observable("idle");
  newMessage = ko.observable<string>();
  messages = ko.observableArray<INfcMessage>([
    new ReadMessage("Messages will appear here")
  ]);

  constructor() {
    super();
    this.nfcAccessStatus("nfc" in navigator);
    this.readNfc();
  }

  write() {
    var message = this.newMessage();
    this.newMessage("");
    $("#write-message").blur();
    this.nfcStatus(`waiting to write: ${message}`);

    var nfcMessage = createNfcMessage(message);
    navigator.nfc
      .push(nfcMessage)
      .then(() => {
        consoleLog("Message pushed.", message);
        this.messages.unshift(new WriteMessage(`Write: ${message}`, true));
        this.nfcStatus("idle");
      })
      .catch(error => {
        consoleLog("Message push failed.", message);
        this.messages.unshift(
          new WriteMessage(`Write failed: ${message}`, false)
        );
        this.nfcStatus("idle");
      });
  }

  processMessage = (message: NFCMessage) => {
    console.log("NFC message received", message);
    message.records.forEach(record => {
      if (record.recordType === "text") {
        if (typeof record.data === "string") {
          this.messages.unshift(new ReadMessage(record.data));
        }
      }
    });
  };

  readNfc() {
    if ("nfc" in navigator) {
      navigator.nfc
        .watch(this.processMessage, { mode: "web-nfc-only" })
        .then(() => console.log("Added a watch."))
        .catch(err => console.log("Adding watch failed: " + err.name));
    }
  }
}

function createNfcMessage(message: string): NFCMessage {
  return {
    url: "",
    records: [
      {
        recordType: "text",
        mediaType: "text/plain",
        data: message || "empty"
      }
    ]
  };
}

function consoleLog(...data) {
  console.log(data);
}

interface INfcMessage {
  message: string;
  time: Date;
  isWrite: boolean;
  isSuccess: boolean;
}

class ReadMessage implements INfcMessage {
  message: string;
  time: Date;
  isWrite: false;
  isSuccess: true;
  constructor(message: string, time: Date = new Date()) {
    this.message = message;
    this.time = time;
    this.isWrite = false;
    this.isSuccess = true;
  }
}
class WriteMessage implements INfcMessage {
  message: string;
  time: Date;
  isWrite: true;
  isSuccess: boolean;
  constructor(message: string, isSuccess: boolean) {
    this.message = message;
    this.time = new Date();
    this.isWrite = true;
    this.isSuccess = isSuccess;
  }
}
