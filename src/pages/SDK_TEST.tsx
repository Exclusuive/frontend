import { useEffect, useRef, useState } from "react";

export default function ImageOnlyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

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

  const layerOrder = ["background", "character", "effect"];

  useEffect(() => {
    const merge = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      for (const layer of layerOrder) {
        const found = images.find((img) => img.layer === layer);
        if (!found) continue;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = found.url;
        await new Promise((res) => (img.onload = res));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const url = canvas.toDataURL("image/png");
      setImgSrc(url);
    };

    merge();
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={300} height={300} style={{ display: "none" }} />
      {imgSrc && <img src={imgSrc} alt="Merged Image" />}
    </>
  );
}
