import React from "react";
import TailorMadeScanner from "~/components/TailorMadeScanner";
import useWindowDimension from "~/hooks/useWindowDimensions";

function Index() {
  const { width } = useWindowDimension();

  return (
    <div>
      <TailorMadeScanner cameraWidth={width} />
    </div>
  );
}

export default Index;
