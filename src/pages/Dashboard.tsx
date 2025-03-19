import { useImageOverlay, ImageOverlay } from "exclusuive-typescript-sdk";

const App = () => {
  const { images } = useImageOverlay({
    imageUrls: [
      "https://myyonseinft.s3.us-east-1.amazonaws.com/MAJOR/test/background.PNG",
      "https://myyonseinft.s3.us-east-1.amazonaws.com/MAJOR/test/character.png",
      "https://myyonseinft.s3.us-east-1.amazonaws.com/MAJOR/test/clothes.PNG",
    ],
  });
  console.log(images);
  return (
    <ImageOverlay
      images={images}
      sizes={[
        { width: 300, height: 300 },
        { width: 300, height: 300 },
        { width: 300, height: 300 },
      ]}
    />
  );
};

export default App;
