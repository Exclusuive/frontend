import { Membership } from "@/types/collection";
import { extractItemImages } from "@/lib/extractItemImages";

interface CharacterImageProps {
  membership: Membership;
}

const CharacterImage = ({ membership }: CharacterImageProps) => {
  const item_images = extractItemImages(membership.equipped_items || []);

  return (
    <div>
      {item_images.length > 0 ? (
        item_images.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt="Character"
            className="absolute top-0 left-0 h-full w-full object-contain"
          />
        ))
      ) : (
        <img
          src={membership.img_url || "/placeholder-character.png"}
          alt="Character"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};

export default CharacterImage;
