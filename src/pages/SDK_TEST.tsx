import { ImageOverlay } from "exclusuive-typescript-sdk";

const App = () => {
  const images = [
    {
      layer: "background",
      url: "https://myyonseinft.s3.us-east-1.amazonaws.com/MAJOR/test/background.PNG",
    },
    {
      layer: "character",
      url: "https://myyonseinft.s3.us-east-1.amazonaws.com/MAJOR/test/character.png",
    },
    {
      layer: "effect",
      url: "https://myyonseinft.s3.us-east-1.amazonaws.com/MAJOR/test/clothes.PNG",
    },
  ];

  const layerInfo = ["background", "character", "effect"]; //

  return <ImageOverlay images={images} layerInfo={layerInfo} size={{ width: 300, height: 300 }} />;
};

export default App;
