import IconApplication from "~icons/mdi/application";
import IconDatabase from "~icons/mdi/database";
import IconDisc from "~icons/mdi/database";
import IconFileOutline from "~icons/mdi/file-outline";
import IconFileCabinet from "~icons/mdi/file-cabinet";
import IconFileCadBox from "~icons/mdi/file-cad-box";
import IconFileCertificate from "~icons/mdi/file-certificate-outline";
import IconFileCodeOutline from "~icons/mdi/file-code-outline";
import IconFileCogOutline from "~icons/mdi/file-cog-outline";
import IconFileDelimitedOutline from "~icons/mdi/file-delimited-outline";
import IconFileDocumentOutline from "~icons/mdi/file-document-outline";
import IconFileDownloadOutline from "~icons/mdi/file-download-outline";
import IconFileExcelBox from "~icons/mdi/file-excel-box";
import IconFileImageOutline from "~icons/mdi/file-image-outline";
import IconFileKeyOutline from "~icons/mdi/file-key-outline";
import IconFileLinkOutline from "~icons/mdi/file-link-outline";
import IconFileLockOutline from "~icons/mdi/file-lock-outline";
import IconFileMarkerOutline from "~icons/mdi/file-marker-outline";
import IconFileMusicOutline from "~icons/mdi/file-marker-outline";
import IconFilePdfBox from "~icons/mdi/file-pdf-box";
import IconFilePowerpointOutline from "~icons/mdi/file-powerpoint-outline";
import IconFilePresentationBox from "~icons/mdi/file-presentation-box";
import IconFileTableBox from "~icons/mdi/file-table-box";
import IconFileVideoOutline from "~icons/mdi/file-video-outline";
import IconFileWordBox from "~icons/mdi/file-word-box";
import IconFormatFont from "~icons/mdi/format-font";
import IconGamepad from "~icons/mdi/gamepad";
import IconPrinter3d from "~icons/mdi/printer-3d";
import IconSquareRootBox from "~icons/mdi/square-root-box";
import IconZipBoxOutline from "~icons/mdi/zip-box-outline";

export const getFileIcon = (file: any) => {
  const fileExtension = file.name.split(".").pop().toLowerCase();

  const application = [
    "apk",
    "appx",
    "deb",
    "exe",
    "jar",
    "appxbundle",
    "appimage",
    "rpm",
    "xap",
    "msi",
    "pkg",
    "lemonapp",
    "pif",
  ];
  const database = [
    "db",
    "db2",
    "sqlite",
    "sql",
    "frm",
    "mda",
    "mdb",
    "wmdb",
    "dif",
  ];
  const disc = [
    "bin",
    "daa",
    "dmg",
    "iso",
    "img",
    "nrg",
    "d64",
    "sdi",
    "vhdx",
    "vhd",
    "dat",
    "vfd",
    "vmdk",
    "nvram",
    "vdi",
    "hdd",
    "qcow",
    "qcow2",
    "cow",
    "qed",
  ];
  const fileCabinet = ["cab", "c4", "cals", "ecab", "tax", "qif", "ofx", "qfx"];
  const fileCad = ["skp", "skb"];
  const fileCertificate = ["cer", "crt", "der", "pem"];
  const fileCode = [
    "aspx",
    "jsp",
    "json",
    "cgi",
    "xaml",
    "yaml",
    "html",
    "lua",
    "mhtml",
    "php",
    "hex",
    "xhtml",
    "xml",
    "py",
    "class",
    "dll",
    "dylib",
    "sb",
    "sb2",
    "sb3",
    "o",
    "c",
    "cpp",
    "js",
    "ts",
    "jsx",
    "tsx",
    "so",
    "h",
    "cs",
    "applescript",
    "ps1",
    "cmd",
    "bat",
    "sh",
    "vbs",
  ];
  const fileCog = ["vmx", "cfg", "conf", "yni", "ini", "cnf"];
  const fileDelimited = ["csv", "tab", "tsv"];
  const fileDocument = [
    "diff",
    "log",
    "srt",
    "0",
    "license",
    "asc",
    "readme",
    "1st",
    "gdoc",
    "md",
    "odoc",
    "odm",
    "odt",
    "pages",
    "rtf",
    "txt",
    "text",
    "tex",
    "wps",
    "wpd",
    "xps",
  ];
  const fileDownload = [
    "torrent",
    "crdownload",
    "opdownload",
    "part",
    "partial",
    "!ut",
  ];
  const fileExcel = [
    "xlk",
    "xls",
    "xlsb",
    "xlsm",
    "xlsx",
    "xlt",
    "xltm",
    "xlw",
  ];
  const fileImage = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "bmp",
    "dng",
    "psd",
    "ai",
    "svg",
    "gdraw",
    "bmp",
    "dds",
    "exif",
    "ico",
    "icns",
    "jp2",
    "jps",
    "kra",
    "pdn",
    "procreate",
    "psb",
    "pdd",
    "pxr",
    "raw",
    "tiff",
    "tif",
    "vtf",
    "cdr",
    "cmx",
    "wmf",
    "figma",
  ];
  const fileKey = ["pub", "ssh", "ppk", "gxk", "omf", "kdb", "kdbx"];
  const fileLink = ["alias", "lnk", "url", "webloc", "sym", "desktop"];
  const fileLock = ["fun", "axx", "eea", "tc", "kode", "nsigne"];
  const fileMarker = [
    "geojson",
    "topojson",
    "geotiff",
    "gml",
    "gpx",
    "itn",
    "ov2",
  ];
  const fileMusic = [
    "midi",
    "aac",
    "wav",
    "flac",
    "aiff",
    "aif",
    "aifc",
    "thd",
    "wma",
    "dts",
    "dtshd",
    "dtsma",
    "ast",
    "als",
    "mp3",
    "mp2",
    "mp1",
    "swa",
    "mid",
    "mscx",
    "mscz",
    "sib",
    "m3u",
    "aimppl",
    "alc",
    "alp",
    "atmos",
    "audio",
    "band",
    "cpr",
    "cwp",
    "flm",
    "flp",
    "logic",
    "ptx",
    "ptf",
    "rpp",
    "rpp-bak",
    "sng",
    "snd",
    "vpr",
    "vsq",
    "vsqx",
    "🗿",
  ];
  const filePdf = ["pdf", "epub", "pdax"];
  const filePowerpoint = ["pot", "pps", "ppt", "pptx"];
  const filePresentation = [
    "gslides",
    "key",
    "keynote",
    "nb",
    "pez",
    "odp",
    "otp",
    "shw",
  ];
  const fileTable = [
    "123",
    "gsheet",
    "numbers",
    "gnumeric",
    "ods",
    "ots",
    "sdc",
  ];
  const fileVideo = [
    "dvr-ms",
    "wtv",
    "aaf",
    "avi",
    "flv",
    "mpeg-1",
    "mpeg-2",
    "mkv",
    "m4v",
    "mov",
    "mxf",
    "mp4",
    "avi",
    "webm",
    "swf",
    "braw",
    "fcp",
    "prproj",
    "aep",
    "drp",
    "ppj",
    "kdenlive",
  ];
  const fileWord = ["doc", "docx", "docm", "dot"];
  const formatFont = ["otf", "ttf", "ttc", "woff", "woff2", "tfm"];
  const gamepad = [
    "osg",
    "osk",
    "osr",
    "osz",
    "ipg",
    "pk3",
    "pk4",
    "rag",
    "rags",
    "rbxl",
    "rbxm",
    "rbxmx",
    "mcaddon",
    "mcfunction",
    "mcmeta",
    "mcpack",
    "mcr",
    "mctemplate",
    "mcworld",
    "nbs",
    "gbx",
    "vmf",
    "vmx",
    "osu",
    "simcity",
    "wbfs",
    "gba",
    "pss",
    "nds",
    "n64",
  ];
  const printer3d = [
    "blend",
    "3dxml",
    "3mf",
    "cad",
    "drw",
    "dwg",
    "dxf",
    "dwf",
    "skp",
    "skb",
    "obj",
    "c4d",
    "dae",
    "lxf",
    "io",
    "m3d",
    "ma",
    "max",
    "mesh",
  ];
  const squareRoot = ["harwell-boeing", "mml", "sxm", "odf"];
  const zip = [
    "7z",
    "a",
    "ace",
    "alz",
    "at3",
    "arc",
    "arj",
    "b",
    "bz2",
    "esd",
    "wim",
    "gz",
    "gzip",
    "lz",
    "lzma",
    "lzo",
    "par",
    "par2",
    "pea",
    "swm",
    "tar",
    "xz",
    "zip",
    "xip",
  ];

  switch (true) {
    case application.indexOf(fileExtension) !== -1:
      return <IconApplication class="text-xl" text-peach />;
    case database.indexOf(fileExtension) !== -1:
      return <IconDatabase class="text-xl text-maroon" />;
    case disc.indexOf(fileExtension) !== -1:
      return <IconDisc class="text-xl text-subtext0" />;
    case fileCabinet.indexOf(fileExtension) !== -1:
      return <IconFileCabinet class="text-xl text-mauve" />;
    case fileCad.indexOf(fileExtension) !== -1:
      return <IconFileCadBox class="text-xl text-maroon" />;
    case fileCertificate.indexOf(fileExtension) !== -1:
      return <IconFileCertificate class="text-xl text-[#df8e1d]" />;
    case fileCode.indexOf(fileExtension) !== -1:
      return <IconFileCodeOutline class="text-xl text-peach" />;
    case fileCog.indexOf(fileExtension) !== -1:
      return <IconFileCogOutline class="text-xl text-subtext0" />;
    case fileDelimited.indexOf(fileExtension) !== -1:
      return <IconFileDelimitedOutline class="text-xl text-[#40a02b]" />;
    case fileDocument.indexOf(fileExtension) !== -1:
      return <IconFileDocumentOutline class="text-xl text-sapphire" />;
    case fileDownload.indexOf(fileExtension) !== -1:
      return <IconFileDownloadOutline class="text-xl text-[#1e66f5]" />;
    case fileExcel.indexOf(fileExtension) !== -1:
      return <IconFileExcelBox class="text-xl text-[#40a02b]" />;
    case fileImage.indexOf(fileExtension) !== -1:
      return <IconFileImageOutline class="text-xl text-[#179299]" />;
    case fileKey.indexOf(fileExtension) !== -1:
      return <IconFileKeyOutline class="text-xl text-[#df8e1d]" />;
    case fileLink.indexOf(fileExtension) !== -1:
      return <IconFileLinkOutline class="text-xl text-[#04a5e5]" />;
    case fileLock.indexOf(fileExtension) !== -1:
      return <IconFileLockOutline class="text-xl text-[#df8e1d]" />;
    case fileMarker.indexOf(fileExtension) !== -1:
      return <IconFileMarkerOutline class="text-xl text-[#d20f39]" />;
    case fileMusic.indexOf(fileExtension) !== -1:
      return <IconFileMusicOutline class="text-xl text-maroon" />;
    case filePdf.indexOf(fileExtension) !== -1:
      return <IconFilePdfBox class="text-xl text-[#d20f39]" />;
    case filePowerpoint.indexOf(fileExtension) !== -1:
      return <IconFilePowerpointOutline class="text-xl text-[#d20f39]" />;
    case filePresentation.indexOf(fileExtension) !== -1:
      return <IconFilePresentationBox class="text-xl text-peach" />;
    case fileTable.indexOf(fileExtension) !== -1:
      return <IconFileTableBox class="text-xl text-[#40a02b]" />;
    case fileVideo.indexOf(fileExtension) !== -1:
      return <IconFileVideoOutline class="text-xl text-mauve" />;
    case fileWord.indexOf(fileExtension) !== -1:
      return <IconFileWordBox class="text-xl text-[#1e66f5]" />;
    case formatFont.indexOf(fileExtension) !== -1:
      return <IconFormatFont class="text-xl text-[#d20f39]" />;
    case gamepad.indexOf(fileExtension) !== -1:
      return <IconGamepad class="text-xl text-[#40a02b]" />;
    case printer3d.indexOf(fileExtension) !== -1:
      return <IconPrinter3d class="text-xl text-sapphire" />;
    case squareRoot.indexOf(fileExtension) !== -1:
      return <IconSquareRootBox class="text-xl text-[#179299]" />;
    case zip.indexOf(fileExtension) !== -1:
      return <IconZipBoxOutline class="text-xl text-[#40a02b]" />;
    default:
      return <IconFileOutline class="text-xl text-subtext0" />;
  }
};
