import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import { useState } from "react";

export default function App() {
  const [companyName, setCompanyName] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [regLabel, setRegLabel] = useState("");
  const [regNo, setRegNo] = useState("");
  const [language, setLanguage] = useState("en");

  // Universal Translate Function
  const translateText = async (text, sourceLang, targetLang) => {
    if (!text || sourceLang === targetLang) return text;

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    const data = await response.json();
    return data[0].map((item) => item[0]).join("");
  };

  //  Convert All Fields
  const handleTranslate = async (targetLang) => {
    const translatedCompany = await translateText(
      companyName,
      language,
      targetLang
    );

    const translatedBottom = await translateText(
      bottomText,
      language,
      targetLang
    );

    const translatedLabel = await translateText(
      regLabel,
      language,
      targetLang
    );

    setCompanyName(translatedCompany);
    setBottomText(translatedBottom);
    setRegLabel(translatedLabel);
    setLanguage(targetLang);
  };

  //  Download High Quality PNG
  const downloadPNG = () => {
    const svg = document.getElementById("sealSvg");
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const img = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
      const scale = 6;
      const canvas = document.createElement("canvas");
      canvas.width = 350 * scale;
      canvas.height = 350 * scale;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const png = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = png;
      link.download = "digital_seal.png";
      link.click();
    };

    img.src = url;
  };

  const fontFamily =
    language === "ta"
      ? "'Noto Sans Tamil', sans-serif"
      : language === "hi"
      ? "'Noto Sans Devanagari', sans-serif"
      : "Arial, sans-serif";

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Seal Generator
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {/* Language Select */}
        <TextField
          select
          fullWidth
          label="Select Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="hi">Hindi</MenuItem>
          <MenuItem value="ta">Tamil</MenuItem>
        </TextField>

        {/* Translate Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={() => handleTranslate("en")}>
            Convert to English
          </Button>

          <Button variant="outlined" onClick={() => handleTranslate("hi")}>
            Convert to Hindi
          </Button>

          <Button variant="outlined" onClick={() => handleTranslate("ta")}>
            Convert to Tamil
          </Button>
        </Box>

        {/* Inputs */}
        <TextField
          fullWidth
          label="Top Curved Text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Bottom Curved Text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Center Label"
          value={regLabel}
          onChange={(e) => setRegLabel(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Registration Number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />
      </Paper>

      {/* SEAL */}
      <Box
        sx={{
          mx: "auto",
          width: 350,
          height: 350,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent"
        }}
      >
        <svg
          id="sealSvg"
          width="350"
          height="350"
          viewBox="0 0 350 350"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily }}
        >
          <defs>
            <path id="topCircle" d="M 50,175 a 125,125 0 1,1 250,0" />
            <path id="bottomCircle" d="M 300,175 a 125,125 0 1,1 -250,0" />
          </defs>

          <circle
            cx="175"
            cy="175"
            r="160"
            stroke="black"
            strokeWidth="6"
            fill="none"
          />

          <circle
            cx="175"
            cy="175"
            r="110"
            stroke="black"
            strokeWidth="5"
            fill="none"
          />

          <text fontSize="20" fontWeight="bold">
            <textPath href="#topCircle" startOffset="50%" textAnchor="middle">
              {companyName}
            </textPath>
          </text>

          <text fontSize="20" fontWeight="bold">
            <textPath href="#bottomCircle" startOffset="50%" textAnchor="middle">
              {bottomText}
            </textPath>
          </text>

          <text x="175" y="165" textAnchor="middle" fontSize="18">
            {regLabel}
          </text>

          <text
            x="175"
            y="195"
            textAnchor="middle"
            fontSize="22"
            fontWeight="bold"
          >
            {regNo}
          </text>
        </svg>
      </Box>

      <Button variant="contained" sx={{ mt: 4 }} onClick={downloadPNG}>
        Download PNG
      </Button>
    </Container>
  );
}