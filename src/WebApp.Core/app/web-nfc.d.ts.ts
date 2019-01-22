interface Navigator {
  nfc: NFC;
}

interface NFC {
  watch(
    messageCallback: (message: NFCMessage, url: String) => void,
    options: NFCWatchOptions
  ): Promise<any>;
  push(nfcMessage: NFCMessage): Promise<any>;
}

interface NFCWatchOptions {
  url?: String; // domain/path or URL pattern
  kind?: String;
  type?: String;
  mode?: "web-only" | "all" | "any";
}

interface NFCMessage {
  records?: NFCRecord[];
  data?: NFCRecord[];
  url?: String;
}

interface NFCRecord {
  recordType: "empty" | "text" | "url" | "json" | "opaque";
  mediaType: String;
  data: null | String | ArrayBuffer;
}