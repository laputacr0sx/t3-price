import React from "react";
import Html5QrcodePlugin from "~/components/CodeReader";

function newChecker() {
  const onNewScanResult = () => {
    return;
  };

  return (
    <div className="">
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
        verbose={false}
      />
    </div>
  );
}

export default newChecker;
