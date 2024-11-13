export default function b64DecodeUnicode(str) {
  if(!str){
    return "";
  }
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    window
      ?.atob(str)
      ?.split("")
      ?.map(function (c) {
        return "%" + ("00" + c?.charCodeAt(0)?.toString(16))?.slice(-2);
      })
      ?.join("")
  );
}
