import { useRef } from "react";
import { Membership } from "@/types/collection";
import { extractItemImages } from "@/lib/extractItemImages";

interface CharacterImageProps {
  membership: Membership;
  enableDownload?: boolean;
  // enableSync?: boolean;
}

const CharacterImage = ({
  membership,
  enableDownload = false,
  // enableSync = false,
}: CharacterImageProps) => {
  const item_images = extractItemImages(membership.equipped_items || []);
  const containerRef = useRef<HTMLDivElement>(null);

  // 합성 이미지 다운로드 핸들러
  const handleDownload = async () => {
    // 이미지가 없으면 membership.img_url 또는 placeholder만 다운로드
    const imagesToDraw =
      item_images.length > 0 ? item_images : [membership.img_url || "/placeholder-character.png"];
    // 컨테이너 크기 기준
    const width = containerRef.current?.offsetWidth || 512;
    const height = containerRef.current?.offsetHeight || 512;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 각 레이어 이미지를 순서대로 그림
    for (const src of imagesToDraw) {
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    }
    // 다운로드 트리거
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "character.png";
    link.click();
  };

  // // 합성 이미지 업로드 핸들러
  // const handleSync = async () => {
  //   const imagesToDraw =
  //     item_images.length > 0 ? item_images : [membership.img_url || "/placeholder-character.png"];
  //   const width = containerRef.current?.offsetWidth || 512;
  //   const height = containerRef.current?.offsetHeight || 512;
  //   const canvas = document.createElement("canvas");
  //   canvas.width = width;
  //   canvas.height = height;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   for (const src of imagesToDraw) {
  //     await new Promise<void>((resolve, reject) => {
  //       const img = new window.Image();
  //       img.crossOrigin = "anonymous";
  //       img.onload = () => {
  //         ctx.drawImage(img, 0, 0, width, height);
  //         resolve();
  //       };
  //       img.onerror = reject;
  //       img.src = src;
  //     });
  //   }

  //   canvas.toBlob(async (blob) => {
  //     if (!blob) return;
  //     try {
  //       await updateMembership(blob, membership);
  //       // 성공 알림 (예: toast, alert 등)
  //       alert("동기화 완료!");
  //     } catch (e) {
  //       alert("업로드 실패");
  //     }
  //   }, "image/png");
  // };
  console.log(membership);
  console.log(item_images);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {item_images.length > 0 ? (
        item_images.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt="Character"
            className="pointer-events-none absolute top-0 left-0 h-full w-full object-contain"
            draggable={false}
          />
        ))
      ) : (
        <img
          src={membership.img_url || "/placeholder-character.png"}
          alt="Character"
          className="pointer-events-none h-full w-full object-cover"
          draggable={false}
        />
      )}
      {/* 다운로드 버튼 */}
      {enableDownload && (
        <button
          type="button"
          onClick={handleDownload}
          aria-label="캐릭터 이미지 다운로드"
          className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-2 text-gray-800 shadow transition hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleDownload();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v11.25m0 0l4.5-4.5m-4.5 4.5l-4.5-4.5M3.75 19.5h16.5"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CharacterImage;
