function extractPublicIdFromUrl(url) {
  const parts = url.split("/");
  const fileWithExt = parts.pop();
  const publicId = parts.slice(parts.indexOf("upload") + 1).join("/") + "/" + fileWithExt;
  return publicId.replace(/\.[^/.]+$/, ""); 
}
export default extractPublicIdFromUrl;