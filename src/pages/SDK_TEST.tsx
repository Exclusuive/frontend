import { useEffect, useRef, useState } from "react";

export default function ImageOnlyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const images = [
    {
      layer: "background",
      url: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/test/background.png",
    },
    {
      layer: "character",
      url: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/test/character.png",
    },
    {
      layer: "effect",
      url: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/test/clothes.png",
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
      <canvas ref={canvasRef} width={1000} height={1000} style={{ display: "none" }} />
      {imgSrc && <img src={imgSrc} alt="Merged Image" />}
    </>
  );
}
