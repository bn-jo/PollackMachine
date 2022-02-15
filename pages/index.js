import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

export default function Home() {
  const [selectedImage, setSelectedImage] = useState();
  const [invalidImage, setInvalidImage] = useState(false);

  let img;

  const preload = (p5) => {
    img = p5.loadImage(selectedImage);
  };

  const setup = (p5, canvasParentRef) => {
    let cnv = p5.createCanvas(img.width, img.height).parent(canvasParentRef);
    cnv.background("#fff");

    for (let col = 0; col < img.width; col += 5) {
      for (let row = 0; row < img.height; row += 5) {
        let xPos = col;
        let yPos = row;

        let c = img.get(col, row);
        p5.push();
        p5.translate(xPos, yPos);
        p5.rotate(p5.radians(p5.random(360)));
        p5.noFill();
        p5.stroke(p5.color(c));
        p5.strokeWeight(p5.random(5));
        // fill(color(c));
        p5.point(xPos, yPos);
        p5.strokeWeight(p5.random(3));
        // rect(col, row, 10, 5);
        p5.curve(
          xPos,
          yPos,
          p5.sin(xPos) * p5.random(160),
          p5.cos(yPos) * p5.sin(xPos) * p5.random(30),
          p5.random(10),
          p5.random(80),
          p5.cos(yPos) * p5.sin(xPos) * p5.random(120),
          p5.cos(yPos) * p5.sin(xPos) * p5.random(70)
        );
        p5.pop();
      }
    }
  };

  const uploadImage = (file) => {
    // Load the image
    let reader = new FileReader();
    reader.onload = function (readerEvent) {
      let image = new Image();
      image.onload = function (imageEvent) {
        // Resize the image
        let canvas = document.createElement("canvas"),
          max_size = 600, // TODO : pull max size from a site config
          width = image.width,
          height = image.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg");
        console.log(dataUrl);
        setSelectedImage(dataUrl);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvasElement = document.querySelector(".p5Canvas");

    if (typeof window !== undefined) {
      let gh = canvasElement.toDataURL("png");

      let a = document.createElement("a");
      a.href = gh;
      a.download = "Pollock-Machine.png";
      a.click();
    } else {
      console.error("Window undefined when downloading image");
    }
  };

  return (
    <div>
      <Head>
        <title>Pollock Machine</title>
      
        <link rel="icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      
      </Head>
     
      <main className="mains">
      <center> <div className="absolute transform -translate-x-1/2 top-8 left-1/2 lg:translate-x-0 lg:transform-none lg:static">
          <h1 className="uppercase font-damn page-title lg:inline">
            <a
              href="#"
              aria-label=""
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="inline-block"
              >
                Pollock
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }}
                className="inline-block"
              >
                 Machine
              </motion.span>
            </a>
          </h1>
         
        <div className="flex flex-col items-center justify-center space-y-4">
          <AnimatePresence>
            {selectedImage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1 }}
                className="relative flex flex-col items-center justify-center space-y-4 canvas-container md:space-y-0 group"
              >
                <div className="z-10 flex flex-col items-center justify-center space-y-4 md:space-y-0">
                  <Sketch preload={preload} setup={setup} />
                  <div className="flex items-center justify-center space-x-4 transition md:absolute md:opacity-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 group-hover:opacity-100">
                    <button
                      className="w-32 p-4 transition transform bg-white border border-black focus-visible:opacity-100 focus-visible:ring-1 ring-black font-space"
                      aria-label="Restart with new image"
                      type="button"
                      onClick={() => setSelectedImage(null)}
                    >
                      Restart
                    </button>
                    <button
                      className="w-32 p-4 transition transform bg-white border border-black focus-visible:opacity-100 focus-visible:ring-1 ring-black font-space"
                      aria-label="Download creation"
                      type="button"
                      onClick={downloadImage}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="file"
                name="myImage"
                accept=".jpg, .png"
                aria-label="Choose an image to Pollock Machine"
                className="custom-input"
                onChange={(event) => {
                  if (event.target.files[0].type.match(/image.*/)) {
                    setInvalidImage(false);
                    uploadImage(event.target.files[0]);
                    
                  } else {
                    setInvalidImage("Upload an image file type");
                  }
                }}
              />
            )}
          </AnimatePresence>
          {invalidImage && <p className="font-space">{invalidImage}</p>}
    
           </div>
        
        </div></center>
      </main>
     
    </div>
  );
}
