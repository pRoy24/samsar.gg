
export function getNFTMetaData(nftPayload) {
  const metadata = {
    name: nftPayload.name,
    description: nftPayload.description,
    image: nftPayload.image,
    attributes: [],
  };
  return metadata;
}